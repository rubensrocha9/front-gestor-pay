import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzResultStatusType } from 'ng-zorro-antd/result';
import { AuthService } from '../../core/service/auth.service';
import { ConfirmEmail } from '../../shared/models/auth';
import { LoaderService } from '../../shared/service/loader.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-confirm-register',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.scss'
})
export class ConfirmRegisterComponent implements OnInit {

  employeeId: number = 0;
  companyId: number = 0;
  emailToken: string = '';
  type!: NzResultStatusType;
  title: string = '';
  content: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
   ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(value => {
      this.companyId = value['companyid'];
      let uriToken = value['code'];

      if (value['employeeid']) {
        this.employeeId = value['employeeid'];
      }

      this.emailToken = uriToken.replace(/ /g,'+');
    });
    this.confirmEmail();
    this.redirectTimeRoute();
  }

  confirmEmail(){
    const confirm: ConfirmEmail = {
      companyId: this.companyId,
      emailToken: this.emailToken,
      employeeId: this.employeeId ?? 0
    }

    if (this.employeeId === 0) {
      LoaderService.toggle({ show: true });
      this.authService.confirmEmail(confirm).subscribe(
        data => {
          LoaderService.toggle({ show: false });
          this.type = 'success';
          this.title = 'Sucesso';
          this.content = 'Cadastro confirmado com sucesso, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
        },error => {
          LoaderService.toggle({ show: false });
          if (error.error.statusCode === 409) {
            this.type = 'info';
            this.title = 'Atenção';
            this.content = 'Esse cadastro já foi confirmado, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
          } else {
            this.type = 'error';
            this.title = 'Atenção';
            this.content = 'Esse cadastro já foi confirmado, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
          }
      });
    } else if (this.employeeId > 0) {
      this.authService.confirmEmployeeEmail(confirm).subscribe(
        data => {
          LoaderService.toggle({ show: false });
          this.type = 'success';
          this.title = 'Sucesso';
          this.content = 'Cadastro confirmado com sucesso, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
        },error => {
          LoaderService.toggle({ show: false });
          if (error.error.statusCode === 409) {
            this.type = 'info';
            this.title = 'Atenção';
            this.content = 'Esse cadastro já foi confirmado, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
          } else {
            this.type = 'error';
            this.title = 'Atenção';
            this.content = 'Esse cadastro já foi confirmado, para voltar, clique no botão a seguir ou espere 5 segundos que será redirecionado para a tela de login.';
          }
      });
    }

  }

  redirectTimeRoute() {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 5000); // 5 segundos
  }

  onBack() {
    this.router.navigateByUrl('login');
  }

}
