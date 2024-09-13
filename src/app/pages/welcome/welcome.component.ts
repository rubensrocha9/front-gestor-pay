import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { DashboardService } from '../../core/service/dashboard.service';
import { StorageService } from '../../core/service/storage.service';
import { LoaderService } from '../../shared/service/loader.service';
import { ModalService } from '../../shared/service/modal.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  employeeWithHighestAmountName: string = '';
  employeeWithHighestAmount: number = 0;
  employeeWithHighestAmountPosition: string = '';
  lastEmployeeHiredName: string = '';
  lastEmployeeHiredPosition: string = '';
  lastEmployeeHiredDate: Date = new Date();
  quantityEmployeesActive: number = 0;
  totalAmountEmployees: number = 0;
  employeeAmount: number = 0;
  amount: number = 0;
  accumulatedAmount: number = 0;
  accumulatedExpenses: number[] = [];
  totalSpendingAmount: number[] = [];
  monthlyExpense: number[] = [];

  companyId: number = 0;
  year = new Date().getFullYear();

  constructor(
    private storageService: StorageService,
    private notificationService: ModalService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
        if (this.companyId > 0) {
          this.getDashboard();
        }
      }
    });
  }

  getDashboard(): void {
    LoaderService.toggle({ show: true });
    this.dashboardService.dashboard(this.companyId).pipe(take(1)).subscribe(
      data => {
        LoaderService.toggle({ show: false });
        this.employeeWithHighestAmountName = data.employeeWithHighestAmountName;
        this.employeeWithHighestAmount = data.employeeWithHighestAmount;
        this.employeeWithHighestAmountPosition = data.employeeWithHighestAmountPosition;
        this.lastEmployeeHiredName = data.lastEmployeeHiredName;
        this.lastEmployeeHiredPosition = data.lastEmployeeHiredPosition
        this.lastEmployeeHiredDate = data.lastEmployeeHiredDate
        this.quantityEmployeesActive = data.quantityEmployeesActive;
        this.totalAmountEmployees = data.totalAmountEmployees;
        this.employeeAmount = data.employeeAmount;
        this.amount = data.amount;
        this.accumulatedAmount = data.accumulatedAmount;
        this.accumulatedExpenses = data.accumulatedExpenses.map(item => item.accumulatedAmount);
        this.totalSpendingAmount = data.totalSpendingAmount.map(item => item.amount);
        this.monthlyExpense = data.monthlyExpense.map(item => item.employeeAmount);
      }, error => {
        LoaderService.toggle({ show: false });
        this.notificationService.modalLoadDataError(error);
    });
  }

}
