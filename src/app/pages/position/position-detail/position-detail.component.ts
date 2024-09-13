import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { PositionService } from '../../../core/service/position.service';
import { StorageService } from '../../../core/service/storage.service';
import { PositionDTO } from '../../../shared/models/position';
import { HelperService } from '../../../shared/service/helper.service';
import { LoaderService } from '../../../shared/service/loader.service';
import { ModalService } from '../../../shared/service/modal.service';
import { SharedModuleModule } from '../../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-position-detail',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './position-detail.component.html',
  styleUrl: './position-detail.component.scss'
})
export class PositionDetailComponent implements OnInit {

  headerTitle: string = '';
  form!: FormGroup;
  companyId: number = 0;
  positionId: number = 0;

  constructor(
    private router: Router,
    private modal: NzModalService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private positionService: PositionService,
    private notificationService: ModalService,

  ){
    this.form = this.formBuilder.group({
      name: [null , [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
      }
    });

    this.activatedRoute.params.subscribe((params) => {
      this.positionId = params['id'];
      if (this.positionId > 0) {
        this.headerTitle = 'Editar Cargo';
        this.getPostionById();
      } else {
        this.headerTitle = 'Criar Cargo';
      }
    });
  }

  getPostionById(): void {
    LoaderService.toggle({ show: true });
    this.positionService.getById(this.companyId, this.positionId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.form.patchValue({
          name: data.positionName
        });
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

  onSubmit() {
    if (HelperService.validateForm(this.form)) {
      const formValues = this.form.getRawValue();
      const position: PositionDTO = {
        positionName: formValues.name
      }

      if (this.positionId > 0) {
        LoaderService.toggle({ show: true });
        this.positionService.update(this.companyId, this.positionId, position).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Cargo atualizado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('position');
          }, error => {
            LoaderService.toggle({ show: false });
            this.notificationService.modalLoadDataError(error);
        });

      } else {
        LoaderService.toggle({ show: true });
        this.positionService.create(this.companyId, position).pipe(take(1)).subscribe(
          data => {
            LoaderService.toggle({ show: false });
            this.message.success('Cargo criado com sucesso!', { nzDuration: 3000 });
            this.router.navigateByUrl('position');
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
      nzOnOk: () => this.router.navigateByUrl('position')
    });
  }
}
