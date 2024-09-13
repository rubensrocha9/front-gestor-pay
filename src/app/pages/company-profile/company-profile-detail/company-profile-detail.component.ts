import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { CompanyService } from '../../../core/service/company.service';
import { StorageService } from '../../../core/service/storage.service';
import { CompanyAddress, CompanyProfile } from '../../../shared/models/company';
import { HelperService } from '../../../shared/service/helper.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-company-profile-detail',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './company-profile-detail.component.html',
  styleUrl: './company-profile-detail.component.scss'
})
export class CompanyProfileDetailComponent implements OnInit {

  form!: FormGroup;
  formAddress!: FormGroup;
  companyId: number = 0;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private companyService: CompanyService,
    private notificationService: ModalService,
  ){
    this.form = this.formBuilder.group({
      name: [null , [Validators.required]],
      documentNumber: [null , [Validators.required]],
      phoneNumber: [null , [Validators.required, Validators.maxLength(18)]],
      email: [null , [Validators.required, Validators.email]],
    });

    this.formAddress = this.formBuilder.group({
      street: [null , [Validators.required]],
      number: [null , [Validators.required]],
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
        if (this.companyId > 0) {
          this.getCompanyProfile();
        }
      }
    });
  }

  getCompanyProfile(): void {
    LoaderService.toggle({ show: true });
    this.companyService.getById(this.companyId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.form.patchValue({
          name: data.name,
          email: data.email,
          documentNumber: data.documentNumber,
          phoneNumber: data.phoneNumber
        });

        this.formAddress.patchValue({
          street: data.address.street,
          number: data.address.number,
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

  onSubmit() {
    const formValues = this.form.getRawValue();
    const company: CompanyProfile = {
      name: formValues.name,
      documentNumber: formValues.documentNumber,
      phoneNumber: formValues.phoneNumber,
      email: formValues.email,
      address: this.getDataAddressForm()
    }

    if (HelperService.validateForm(this.form) && HelperService.validateForm(this.formAddress)) {
      LoaderService.toggle({ show: true });
      this.companyService.update(this.companyId, company).pipe(take(1)).subscribe(
        data => {
          LoaderService.toggle({ show: false });
          this.message.success('Empresa atualizada com sucesso!', { nzDuration: 3000 });
          this.router.navigateByUrl('company-profile');
        }, error => {
          LoaderService.toggle({ show: false });
          this.notificationService.modalLoadDataError(error);
      });
    } else {
      this.message.warning('Existem campos a serem preenchidos.', { nzDuration: 3000 });
    }
  }

  onBack() {
    this.modal.confirm({
      nzTitle: '<i>Certeza que deseja voltar?</i>',
      nzOnOk: () => this.router.navigateByUrl('company-profile')
    });
  }

  getDataAddressForm(): CompanyAddress {
    const formValues = this.formAddress.getRawValue();

    const address: CompanyAddress = {
      street: formValues.street,
      number: formValues.number,
      complement: formValues.complement,
      district: formValues.district,
      city: formValues.city,
      state: formValues.state,
      country: formValues.country,
      zipCode: formValues.zipCode
    }

    return address;
  }
}
