import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject, debounceTime, take } from 'rxjs';
import { EmployeeService } from '../../../core/service/employee.service';
import { StorageService } from '../../../core/service/storage.service';
import { Employee } from '../../../shared/models/employee';
import { Pagination } from '../../../shared/models/pagination';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  companyId: number = 0;

  pagination = {} as Pagination;
  searchFieldChanged: Subject<string> = new Subject<string>();
  searchValue: string = '';

  constructor(
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService,
    private storageService: StorageService,
    private employeeService: EmployeeService,
    private notificationService: ModalService,
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

  getEmployeeManager(): void {
    LoaderService.toggle({ show: true });
    this.employeeService.getPageParams(this.companyId, this.pagination.currentPage, this.pagination.itemsPerPage).pipe(take(1)).subscribe(
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
          this.employeeService.getPageParams(this.companyId, this.pagination.currentPage, this.pagination.itemsPerPage, filtered).pipe(take(1)).subscribe(
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

  onCreate(): void {
    this.router.navigateByUrl('employee/detail/0');
  }

  onEdit(id?: number): void {
    this.router.navigateByUrl(`employee/detail/${id}`);
  }

  onDelete(id?: number, evt?: any) {
    evt.stopPropagation();
    this.modal.confirm({
      nzTitle: '<i>Certeza que deseja remover esse funcionário?</i>',
      nzOnOk: () => {
        this.employeeService.delete(this.companyId, id!).pipe(take(1)).subscribe(
        data => {
          this.getEmployeeManager();
          this.message.success('Funcionário removido com sucesso!', { nzDuration: 3000 });
        }, error =>{
          this.notificationService.modalLoadDataError(error);
        })
      }
    });
  }

  onQueryParamsChange($event: NzTableQueryParams) {
    this.pagination.currentPage = $event.pageIndex;
    this.getEmployeeManager();
  }

}
