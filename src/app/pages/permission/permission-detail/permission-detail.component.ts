import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { PermissionService } from '../../../core/service/permission.service';
import { StorageService } from '../../../core/service/storage.service';
import { EmployeeRole } from '../../../shared/models/employee';
import { HelperService } from '../../../shared/service/helper.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-permission-detail',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './permission-detail.component.html',
  styleUrl: './permission-detail.component.scss'
})
export class PermissionDetailComponent implements OnInit {

  form!: FormGroup;
  companyId: number = 0;
  employeeId: number = 0;
  name: string = '';
  email: string = '';
  entryDate!: Date;
  companyTime: string = '';
  employeePosition: string = '';
  address: string = '';

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private notificationService: ModalService,
    private permissionService: PermissionService,
  ){
    this.form = this.formBuilder.group({
      role: [null , [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
      }
    });

    this.activatedRoute.params.subscribe((params) => {
        this.employeeId = params['id'];
        if (this.employeeId > 0) {
          this.getpermissionId();
        }
    });
  }

  getpermissionId(): void {
    LoaderService.toggle({ show: true });
    this.permissionService.getById(this.companyId, this.employeeId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.name = data.name;
        this.email = data.email;
        this.entryDate = data.entryDate;
        this.companyTime = data.companyTime;
        this.employeePosition = data.employeePosition;
        this.address = data.address;

        this.form.patchValue({
          role: data.role
        });
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  onSubmit() {
    if (HelperService.validateForm(this.form)) {
      const formValues = this.form.getRawValue();
      const role: EmployeeRole = {
        userRole: formValues.role
      }
      if (this.employeeId > 0) {
        LoaderService.toggle({ show: true });
        this.permissionService.update(this.companyId, this.employeeId, role.userRole).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Permissão atualizada com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('permission');
          }, error => {
            LoaderService.toggle({ show: false });
            this.notificationService.modalLoadDataError(error);
        });

      }
    } else {
      this.message.warning('Existem campos a serem preenchidos.', { nzDuration: 3000 });
    }
  }

  onBack(): void {
    this.modal.confirm({
      nzTitle: '<i>Certeza que deseja voltar?</i>',
      nzOnOk: () => this.router.navigateByUrl('permission')
    });
  }

}
