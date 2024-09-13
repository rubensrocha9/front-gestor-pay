import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { take } from 'rxjs';
import { DashboardService } from '../../core/service/dashboard.service';
import { StorageService } from '../../core/service/storage.service';
import { FeedbackWithAttachmentDTO } from '../../shared/models/dashboard';
import { Feedback } from '../../shared/models/employee';
import { LoaderService } from '../../shared/service/loader.service';
import { ModalService } from '../../shared/service/modal.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {

  companyId: number = 0;
  feedbacks!: FeedbackWithAttachmentDTO;
  feeds: Feedback[] = [];

  constructor(
    private router: Router,
    private message: NzMessageService,
    private storageService: StorageService,
    private notificationService: ModalService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
        this.getFeedbacks();
      }
    });
  }

  getFeedbacks(): void {
    LoaderService.toggle({ show: true });
    this.dashboardService.feedback(this.companyId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.feedbacks = data;
        this.feeds = data.feedback.map(item => item);
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
      });
  }

}
