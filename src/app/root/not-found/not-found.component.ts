import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../core/service/storage.service';
import { SharedModuleModule } from '../../shared/shared-module/shared-module.module';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [SharedModuleModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {

  role: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.storageService.getRoleFromStore().subscribe(role => {
      this.role = role;
    });
  }

  onBack() {
    if (this.role === 'Admin') {
      this.router.navigateByUrl('dashboard');
    } else if (this.role === 'Usuário'){
      this.router.navigateByUrl('employee-profile');
    } else if (this.role === '') {
      this.router.navigateByUrl('login');
    }
  }
}
