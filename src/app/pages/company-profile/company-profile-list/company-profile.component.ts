import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, take } from 'rxjs';
import { CompanyService } from '../../../core/service/company.service';
import { StorageService } from '../../../core/service/storage.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [SharedModuleModule ],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  companyId: number = 0;
  name: string = '';
  documentNumber: string = '';
  email: string = '';
  street: string = '';
  number: string = '';
  complement?: string = '';
  district: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  zipCode: string = '';
  imgUrl: string = '';

  constructor(
    private router: Router,
    private message: NzMessageService,
    private storageService: StorageService,
    private companyService: CompanyService,
    private notificationService: ModalService,
  ){}

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
    forkJoin([
      this.companyService.getById(this.companyId),
      this.companyService.getAttachment(this.companyId)
    ]).pipe(take(1)).subscribe(([company, attachment]) => {
      LoaderService.toggle({ show: false });
      this.name = company.name;
      this.documentNumber = company.documentNumber;
      this.email = company.email;
      this.street = company.address.street;
      this.number = company.address.number;
      this.complement = company.address.complement;
      this.district = company.address.district;
      this.city = company.address.city;
      this.state = company.address.state;
      this.country = company.address.country;
      this.zipCode = company.address.zipCode;
      this.imgUrl = attachment.imgUrl
    }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  onEdit() {
    this.router.navigateByUrl(`company-profile/detail/${this.companyId}`)
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
        this.companyService.sendAttachment(this.companyId, file).pipe(take(1)).subscribe(
          data => {
            this.imgUrl = data.imgUrl;
            this.message.success('Imagem do perfil foi alterada com sucesso.', { nzDuration: 3000 });
          }, error => {
            this.notificationService.modalLoadDataError(error);
        });
      }
    }
  }

}
