import { Routes } from "@angular/router";
import { EmployeeProfileDetailComponent } from "./employee-profile-detail/employee-profile-detail.component";
import { EmployeeProfileComponent } from "./employee-profile-list/employee-profile.component";

export const PROFILE_ROUTES: Routes = [
  { path: '', component: EmployeeProfileComponent },
  { path: 'detail/:id', component: EmployeeProfileDetailComponent },
];
