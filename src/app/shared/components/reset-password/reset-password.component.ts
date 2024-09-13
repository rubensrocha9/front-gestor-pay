import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { AuthService } from '../../../core/service/auth.service';
import { SendResetPassword } from '../../models/auth';
import { HelperService } from '../../service/helper.service';
import { LoaderService } from '../../service/loader.service';
import { ModalService } from '../../service/modal.service';
import { SharedModuleModule } from '../../shared-module/shared-module.module';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  form!: FormGroup;

  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private notificationService: ModalService
  ) {
    this.form = this.formBuilder.group({
      email: [null , [Validators.required, Validators.email]],
    });
  }

  onReset(): void {
    if (HelperService.validateForm(this.form)) {
      const reset: SendResetPassword = {
        email: this.form.get('email')?.value
      }

      LoaderService.toggle({ show: true });
      this.authService.sendResetPassword(reset).pipe(take(1)).subscribe(
        data => {
          LoaderService.toggle({ show: false });
          this.modal.destroy();
          this.message.success('Email enviado com sucesso.', { nzDuration: 3000 });
        }, error => {
          LoaderService.toggle({ show: false });
          this.notificationService.modalLoadDataError(error);
      });
    } else {
      this.message.warning('Existem campos a serem preenchidos.', { nzDuration: 3000 });
    }
  }
}
