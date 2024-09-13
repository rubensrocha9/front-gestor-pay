import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { EmployeeService } from '../../../core/service/employee.service';
import { PositionService } from '../../../core/service/position.service';
import { StorageService } from '../../../core/service/storage.service';
import { CreateEmployee, EmployeeAddress, EmployeeAndAddress } from '../../../shared/models/employee';
import { Position } from '../../../shared/models/position';
import { HelperService } from '../../../shared/service/helper.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {

  headerTitle: string = '';
  form!: FormGroup;
  formAddress!: FormGroup;
  companyId: number = 0;
  employeeId: number = 0;
  positions: Position[] = [];
  entryDateValidation!: Date;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private notificationService: ModalService,
  ) {
    this.form = this.formBuilder.group({
      name: [null , [Validators.required]],
      amount: [null , [Validators.required]],
      birthDate: [null , [Validators.required]],
      documentNumber: [null , [Validators.required]],
      gender: [null , [Validators.required]],
      positionId: [null , [Validators.required]],
      phoneNumber: [null , [Validators.required]],
      countryCode: ['BR' , [Validators.required]],
      email: [null , [Validators.required, Validators.email]],
      entryDate: [null , [Validators.required]],
      departureDate: [null],
    });

    this.formAddress = this.formBuilder.group({
      street: [null , [Validators.required]],
      homeNumber: [null , [Validators.required]],
      complement: [null],
      district: [null , [Validators.required]],
      city: [null , [Validators.required]],
      state: [null , [Validators.required]],
      country: [null , [Validators.required]],
      zipCode: [null , [Validators.required]]
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
          this.headerTitle = 'Editar Funcionário';
          this.getEmployeeId();
        } else {
        this.headerTitle = 'Cadastrar Funcionário';
      }
    });

    this.getpostions();
  }

  getEmployeeId(): void {
    LoaderService.toggle({ show: true });
    this.employeeService.getById(this.companyId, this.employeeId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.form.patchValue({
          positionId: data.positionId,
          name: data.name,
          birthDate: data.birthDate,
          amount: data.amount,
          email: data.email,
          entryDate: data.entryDate,
          departureDate: data.departureDate,
          documentNumber: data.documentNumber,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode
        });

        this.formAddress.patchValue({
          street: data.address.street,
          homeNumber: data.address.homeNumber,
          complement: data.address.complement,
          district: data.address.district,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          zipCode: data.address.zipCode
        });
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  getpostions(): void {
    LoaderService.toggle({ show: true });
    this.positionService.getPositionList(this.companyId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.positions = data;
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  onSubmit() {
    if (HelperService.validateForm(this.form)) {
      const employee = this.getDataEmployeeForm();
      const address = this.getDataAddressForm();
      const expense: EmployeeAndAddress = {
        employee: employee,
        address: address
      }

      if (this.employeeId > 0) {
        LoaderService.toggle({ show: true });
        this.employeeService.update(this.companyId, this.employeeId, expense).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Funcionário atualizado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('employee');
          }, error => {
            LoaderService.toggle({ show: false });
            this.notificationService.modalLoadDataError(error);
        });

      } else {
        LoaderService.toggle({ show: true });
        this.employeeService.create(this.companyId, expense).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Funcionário criado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('employee');
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
      nzOnOk: () => this.router.navigateByUrl('employee')
    });
  }

  getDataEmployeeForm(): CreateEmployee {
    const formValues = this.form.getRawValue();

    const employee: CreateEmployee = {
      positionId: formValues.positionId,
      name: formValues.name,
      birthDate: formValues.birthDate,
      amount: formValues.amount,
      email: formValues.email,
      entryDate: formValues.entryDate,
      departureDate: formValues.departureDate,
      documentNumber: formValues.documentNumber,
      gender: formValues.gender,
      phoneNumber: formValues.phoneNumber,
      countryCode: formValues.countryCode
    }

    return employee;
  }

  getDataAddressForm(): EmployeeAddress {
    const formValues = this.formAddress.getRawValue();

    const address: EmployeeAddress = {
      street: formValues.street,
      homeNumber: formValues.homeNumber,
      complement: formValues.complement,
      district: formValues.district,
      city: formValues.city,
      state: formValues.state,
      country: formValues.country,
      zipCode: formValues.zipCode
    }

    return address;
  }

  disabledDate = (current: Date): boolean => {
    const today = new Date();

    return current.getTime() > today.getTime();
  }
}
