import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, take } from 'rxjs';
import { CompanyService } from '../../../core/service/company.service';
import { EmployeeProfileService } from '../../../core/service/employee-profile.service';
import { EmployeeService } from '../../../core/service/employee.service';
import { StorageService } from '../../../core/service/storage.service';
import { RoleType } from '../../../shared/enum/role.enum';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';
import { Feedback } from './../../../shared/models/employee';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  companyId: number = 0;
  employeeId: number = 0;
  visibleDrawer: boolean = false;

  name: string = '';
  documentNumber: string = '';
  email: string = '';
  position: string = '';
  phoneNumber: string = '';
  countryCode: string = '';
  role!: RoleType;
  companyTime?: string = '';
  birthDate!: Date;
  entryDate!: Date;

  street: string = '';
  number: string = '';
  complement?: string = '';
  district: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  zipCode: string = '';
  imgUrl: string = '';
  feedbacks: Feedback[] = [];

  companyName: string = '';
  companyDocumentNumber: string = '';
  companyEmail: string = '';
  companyStreet: string = '';
  companyNumber: string = '';
  companyComplement?: string = '';
  companyDistrict: string = '';
  companyCity: string = '';
  companyState: string = '';
  companyCountry: string = '';
  companyZipCode: string = '';

  tabs = [
    {
      id: 1,
      name: 'Dados Pessoais'
    },
    {
      id: 2,
      name: 'Empresa'
    },
    {
      id: 3,
      name: 'Feedback'
    }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private notificationService: ModalService,
    private employeeProfileService: EmployeeProfileService,
  ){
    this.form = this.formBuilder.group({
      feedback: [null, [Validators.maxLength(300)]],
    });
  }

  ngOnInit(): void {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      this.storageService.getEmployeeFromStore().subscribe(employeeId => {
        if (!isNaN(parseInt(companyId, 10))) {
          this.companyId = parseInt(companyId, 10);
          if (!isNaN(parseInt(employeeId, 10))) {
            this.employeeId = parseInt(employeeId, 10);
            if (this.employeeId > 0 && this.companyId > 0) {
              this.getEmployeeProfile();
            }
          }
        }
      });
    });

  }

  getEmployeeProfile(): void {
    forkJoin([
      this.companyService.getById(this.companyId),
      this.employeeService.getById(this.companyId, this.employeeId),
      this.employeeProfileService.getAttachment(this.employeeId)
    ]).pipe(take(1)).subscribe(([company, employee, attachment]) => {
      LoaderService.toggle({ show: false });
      this.name = employee.name;
      this.position = employee.positionName;
      this.documentNumber = employee.documentNumber;
      this.phoneNumber = employee.phoneNumber;
      this.countryCode = employee.countryCode;
      this.role = employee.role;
      this.birthDate = employee.birthDate;
      this.entryDate = employee.entryDate;
      this.companyTime = employee.companyTime;
      this.email = employee.email;
      this.street = employee.address.street;
      this.number = employee.address.homeNumber;
      this.complement = employee.address.complement;
      this.district = employee.address.district;
      this.city = employee.address.city;
      this.state = employee.address.state;
      this.country = employee.address.country;
      this.zipCode = employee.address.zipCode;
      this.imgUrl = attachment.imgUrl

      this.companyName = company.name;
      this.companyDocumentNumber = company.documentNumber;
      this.companyEmail = company.email;
      this.companyStreet = company.address.street;
      this.companyNumber = company.address.number;
      this.companyComplement = company.address.complement;
      this.companyDistrict = company.address.district;
      this.companyCity = company.address.city;
      this.companyState = company.address.state;
      this.companyCountry = company.address.country;
      this.companyZipCode = company.address.zipCode;

      this.getFeedbackHistory();
    }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  getFeedbackHistory(): void {
    this.employeeProfileService.getFeedbackHistory(this.companyId, this.employeeId).pipe(take(1)).subscribe(
      data => {
        this.feedbacks = data;
    }, error => {
      this.notificationService.modalLoadDataError(error);
    });
  }

  onEdit() {
    this.router.navigateByUrl(`employee-profile/detail/${this.employeeId}`)
  }

  onSendFeedback() {
    const feedback: Feedback = {
      companyId: this.companyId,
      employeeId: this.employeeId,
      feedback: this.form.get('feedback')?.value
    }
    if (this.form.get('feedback')?.value !== null && this.form.get('feedback')?.value !== '') {
      this.employeeProfileService.createFeedback(this.companyId, this.employeeId, feedback).pipe(take(1)).subscribe(
        data => {
          this.message.success('Feedback enviado com sucesso.', { nzDuration: 3000 });
          this.getFeedbackHistory();
          this.form.reset();
        }, error => {
          this.notificationService.modalLoadDataError(error);
      });
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        this.message.error('O tipo de arquivo enviado não é permitido.', { nzDuration: 3000 });
      } else {
        this.employeeProfileService.sendAttachment(this.employeeId, file).pipe(take(1)).subscribe(
          data => {
            this.imgUrl = data.imgUrl;
            this.message.success('Imagem do perfil foi alterada com sucesso.', { nzDuration: 3000 });
          }, error => {
            this.notificationService.modalLoadDataError(error);
        });
      }
    }
  }

  showFeedbackHistory(): void {
    this.visibleDrawer = true;
  }

  close(): void {
    this.visibleDrawer = false;
  }

}
