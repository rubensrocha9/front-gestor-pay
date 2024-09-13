import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { ExpenseManagerService } from '../../../core/service/expense-manager.service';
import { StorageService } from '../../../core/service/storage.service';
import { ExpenseManager } from '../../../shared/models/expense-manager';
import { HelperService } from '../../../shared/service/helper.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-expense-manager-detail',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './expense-manager-detail.component.html',
  styleUrl: './expense-manager-detail.component.scss'
})
export class ExpenseManagerDetailComponent implements OnInit {

  headerTitle: string = '';
  form!: FormGroup;
  companyId: number = 0;
  expenseId: number = 0;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private notificationService: ModalService,
    private expenseService: ExpenseManagerService,
  ) {
    this.form = this.formBuilder.group({
      name: [null , [Validators.required]],
      amount: [null , [Validators.required]],
      status: [null , [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
      }
    });

    this.activatedRoute.params.subscribe((params) => {
        this.expenseId = params['id'];
        if (this.expenseId > 0) {
          this.headerTitle = 'Editar Gasto';
          this.getExpenseyId();
        } else {
        this.headerTitle = 'Criar Gasto';
      }
    });
  }

  getExpenseyId(): void {
    LoaderService.toggle({ show: true });
    this.expenseService.getById(this.companyId, this.expenseId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.form.patchValue({
          name: data.name,
          amount: data.amount,
          status: data.status,
        });
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  onSubmit() {
    if (HelperService.validateForm(this.form)) {
      const formValues = this.form.getRawValue();
      const expense: ExpenseManager = {
        name: formValues.name,
        amount: formValues.amount,
        status: formValues.status,
      }

      if (this.expenseId > 0) {
        LoaderService.toggle({ show: true });
        this.expenseService.update(this.companyId, this.expenseId, expense).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Gasto atualizado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('expense-manager');
          }, error => {
            LoaderService.toggle({ show: false });
            this.notificationService.modalLoadDataError(error);
        });

      } else {
        LoaderService.toggle({ show: true });
        this.expenseService.create(this.companyId, expense).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Gasto criado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('expense-manager');
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
      nzOnOk: () => this.router.navigateByUrl('expense-manager')
    });
  }
}
