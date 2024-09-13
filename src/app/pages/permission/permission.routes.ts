import { Routes } from '@angular/router';
import { PermissionDetailComponent } from './permission-detail/permission-detail.component';
import { PermissionComponent } from './permission-list/permission.component';

export const PERMISSION_ROUTES: Routes = [
  { path: '', component: PermissionComponent },
  { path: 'detail/:id', component: PermissionDetailComponent },
];
