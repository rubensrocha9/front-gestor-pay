import { Routes } from '@angular/router';
import { ExpenseManagerDetailComponent } from './expense-manager-detail/expense-manager-detail.component';
import { ExpenseManagerComponent } from './expense-manager-list/expense-manager.component';

export const EXPENSEMANAGER_ROUTES: Routes = [
  { path: '', component: ExpenseManagerComponent },
  { path: 'detail/:id', component: ExpenseManagerDetailComponent },
];
