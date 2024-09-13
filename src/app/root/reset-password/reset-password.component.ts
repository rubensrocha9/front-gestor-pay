import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { take } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { SendResetPassword } from '../../shared/models/auth';
import { HelperService } from '../../shared/service/helper.service';
import { LoaderService } from '../../shared/service/loader.service';
import { ModalService } from '../../shared/service/modal.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  passwordVisible = false;
  checkPasswordVisible = false;
  form!: FormGroup;
  email: string = '';
  emailToken: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private notificationService: ModalService,
  )
  {
    this.form = this.formBuilder.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(value => {
      this.email = value['email'];
      let uriToken = value['code'];

      this.emailToken = uriToken.replace(/ /g,'+');
    });
  }

  onResetPassword(): void {
    const formValue = this.form.getRawValue();
    const reset: SendResetPassword = {
      emailToken: this.emailToken,
      email: this.email,
      newPassword: formValue.password
    }
    console.log(reset);

    if (HelperService.validateForm(this.form)) {
      LoaderService.toggle({ show: true });
      this.authService.resetPassword(reset).pipe(take(1)).subscribe(
        data => {
          LoaderService.toggle({ show: false });
          this.message.success('Senha Redefinida com sucesso.', { nzDuration: 3000 });
          this.router.navigateByUrl('login');
        }, error => {
          LoaderService.toggle({ show: false });
          this.notificationService.modalLoadDataError(error);
      });
    } else {
      this.message.warning('Existem campos a serem preenchidos.', { nzDuration: 3000 });
    }
  }

  onLogin() {
    this.router.navigateByUrl('login');
  }
}
