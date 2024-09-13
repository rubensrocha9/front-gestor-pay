import { Routes } from '@angular/router';
import { CompanyProfileDetailComponent } from './company-profile-detail/company-profile-detail.component';
import { CompanyProfileComponent } from './company-profile-list/company-profile.component';

export const COMPANYPROFILE_ROUTES: Routes = [
  { path: '', component: CompanyProfileComponent },
  { path: 'detail/:id', component: CompanyProfileDetailComponent },
];
