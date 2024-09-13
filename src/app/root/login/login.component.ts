import { Component, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { StorageService } from '../../core/service/storage.service';
import { LoaderService } from '../../shared/service/loader.service';
import { ModalService } from '../../shared/service/modal.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';
import { ResetPasswordComponent } from './../../shared/components/reset-password/reset-password.component';
import { Login } from './../../shared/models/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  passwordVisible = false;
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private storageService: StorageService,
    private _viewContainerRef: ViewContainerRef,
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null , [Validators.required, Validators.email]],
      password: [null , [Validators.required]],
    });
  }

  onLogin(){
    const formValues = this.loginForm.getRawValue();
    const login: Login = {
      email: formValues.email,
      password: formValues.password
    }

    LoaderService.toggle({ show: true });
    this.authService.signIn(login).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.loginForm.reset();
        this.authService.storeToken(data.token);
        const tokenPayload = this.authService.decodedToken();

        const role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const unique_name = tokenPayload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const companyId = tokenPayload.companyId;
        const is_company = tokenPayload.is_company;
        const employeeId = tokenPayload.employeeId;

        this.storageService.setFullnameForStore(unique_name);
        this.storageService.setRoleForStore(role);
        this.storageService.setCompanyForStore(companyId);
        this.storageService.setIsCompanyForStore(is_company);
        this.storageService.setEmployeeForStore(employeeId);

        if (role === 'Admin') {
          this.router.navigateByUrl('dashboard');
        } else if (role === 'Usuário') {
          this.router.navigateByUrl('employee-profile');
        }
    }, error => {
      LoaderService.toggle({ show: false });
      this.modalService.modalLoadDataError(error);
    });
  }

  onRegister(): void {
    this.router.navigateByUrl('register-company');
  }

  onResetPassword(): void {
    this.modal.create({
      nzContent: ResetPasswordComponent,
      nzViewContainerRef: this._viewContainerRef,
      nzFooter: null,
      nzWidth: '30%',
			nzStyle: {
				'top': '24px',
				'min-width': '600px',
			}
    });
  }

}
