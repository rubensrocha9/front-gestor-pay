import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, debounceTime, take } from 'rxjs';
import { PermissionService } from '../../../core/service/permission.service';
import { StorageService } from '../../../core/service/storage.service';
import { EmployeePermission } from '../../../shared/models/employee';
import { Pagination } from '../../../shared/models/pagination';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent implements OnInit {

  employees: EmployeePermission[] = [];
  companyId: number = 0;

  pagination = {} as Pagination;
  searchFieldChanged: Subject<string> = new Subject<string>();
  searchValue: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private notificationService: ModalService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 15,
      totalItems: 1,
    } as Pagination;

    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
      }
    });
  }

  getPermissionManager(): void {
    LoaderService.toggle({ show: true });
    this.permissionService.getPageParams(this.companyId, this.pagination.currentPage, this.pagination.itemsPerPage).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.employees = data.result;
        this.pagination = data.pagination;
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  searchField(evt: any): void {
    if (this.searchFieldChanged.observers.length === 0) {
      this.searchValue = evt.value;
      this.searchFieldChanged.pipe(debounceTime(800)).subscribe(
        filtered => {
          LoaderService.toggle({ show: true });
          this.permissionService.getPageParams(this.companyId, this.pagination.currentPage, this.pagination.itemsPerPage, filtered).pipe(take(1)).subscribe(
            data => {
              LoaderService.toggle({ show: false });
              this.employees = data.result;
              this.pagination = data.pagination;
            }, error => {
              LoaderService.toggle({ show: false });
              this.notificationService.modalLoadDataError(error);
          });
        }
      );
    }
    this.searchFieldChanged.next(evt.value);
  }

  clearInput(): void {
    this.searchValue = '';
    this.searchFieldChanged.next('');
  }

  onEdit(id?: number): void {
    this.router.navigateByUrl(`permission/detail/${id}`);
  }

  onQueryParamsChange($event: NzTableQueryParams) {
    this.pagination.currentPage = $event.pageIndex;
    this.getPermissionManager();
  }
}
