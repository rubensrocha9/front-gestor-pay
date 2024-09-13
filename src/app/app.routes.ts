import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CompanyRegisterComponent } from './root/company-register/company-register.component';
import { ConfirmRegisterComponent } from './root/confirm-register/confirm-register.component';
import { LoginComponent } from './root/login/login.component';
import { NotFoundComponent } from './root/not-found/not-found.component';
import { RegisterEmployeeComponent } from './root/register-employee/register-employee.component';
import { ResetPasswordComponent } from './root/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'confirm-email', component: ConfirmRegisterComponent },
  { path: 'register-company', component: CompanyRegisterComponent },
  { path: 'register-employee', component: RegisterEmployeeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    canActivate: [AuthGuard],
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
      { path: 'dashboard', data: { role: ['Admin'] }, loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
      { path: 'expense-manager', data: { role: ['Admin'] }, loadChildren: () => import('./pages/expense-manager/expense-manager.routes').then(m => m.EXPENSEMANAGER_ROUTES) },
      { path: 'position', data: { role: ['Admin'] }, loadChildren: () => import('./pages/position/position.routes').then(m => m.POSITION_ROUTES) },
      { path: 'employee', data: { role: ['Admin'] }, loadChildren: () => import('./pages/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES) },
      { path: 'permission', data: { role: ['Admin'] }, loadChildren: () => import('./pages/permission/permission.routes').then(m => m.PERMISSION_ROUTES) },
      { path: 'company-profile', data: { role: ['Admin'] }, loadChildren: () => import('./pages/company-profile/company-profile.routes').then(m => m.COMPANYPROFILE_ROUTES) },
      { path: 'employee-profile', data: { role: ['Admin', 'Usuário'] }, loadChildren: () => import('./pages/employee-profile/employee-profile.routes').then(m => m.PROFILE_ROUTES) },
      { path: 'feedback', data: { role: ['Admin'] }, loadChildren: () => import('./pages/feedback/feedback.routes').then(m => m.FEEDBACK_ROUTES) },

    ]
  },

  { path: '**', pathMatch: 'full', redirectTo: 'not-found' },
  { path: 'not-found', component: NotFoundComponent },
];
