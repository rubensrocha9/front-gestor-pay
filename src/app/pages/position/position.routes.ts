import { Routes } from '@angular/router';
import { PositionDetailComponent } from './position-detail/position-detail.component';
import { PositionComponent } from './postion-list/position.component';

export const POSITION_ROUTES: Routes = [
  { path: '', component: PositionComponent },
  { path: 'detail/:id', component: PositionDetailComponent },
];
