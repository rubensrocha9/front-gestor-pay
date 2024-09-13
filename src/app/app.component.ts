import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { filter } from 'rxjs';
import { AuthService } from './core/service/auth.service';
import { StorageService } from './core/service/storage.service';
import { SharedModuleModule } from './shared/shared-module/shared-module.module';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [ RouterOutlet, RouterLink, SharedModuleModule]
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  currentDate: string = '';
  isHideSideBar: boolean = false;
  isAdmin: boolean = false;
  isCompany: boolean = false;
  companyId: number = 0;
  employeeId: number = 0;

  constructor (
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {

    this.storageService.getCompanyFromStore().subscribe(companyId => {
      if (!isNaN(parseInt(companyId, 10))) {
        this.companyId = parseInt(companyId, 10);
      }
    });
    this.storageService.getIsCompanyFromStore().subscribe(company => {
      if (company === 'True') {
        this.isCompany = true;
      } else if (company === 'False') {
        this.isCompany = false;
      }
    });
    this.storageService.getRoleFromStore().subscribe(role => {
      if (role === 'Admin') {
        this.isAdmin = true;
      } else if (role === 'Usuário') {
        this.isAdmin = false;
      }
    });


    this.currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      const currentRoute = this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
      this.isHideSideBar =
        currentRoute === 'login' ||
        currentRoute === 'not-found' ||
        currentRoute === 'register-company' ||
        currentRoute === 'confirm-email' ||
        currentRoute === 'register-employee' ||
        currentRoute === 'reset-password';
    });
  }

  onLogout(): void {
    this.authService.signOut();
  }
}
