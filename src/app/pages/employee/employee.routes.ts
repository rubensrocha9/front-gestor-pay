import { Routes } from '@angular/router';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeComponent } from './employee-list/employee.component';

export const EMPLOYEE_ROUTES: Routes = [
  { path: '', component: EmployeeComponent },
  { path: 'detail/:id', component: EmployeeDetailComponent },
];
