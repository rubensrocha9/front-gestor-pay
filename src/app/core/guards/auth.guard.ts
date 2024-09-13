import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NzModalService } from "ng-zorro-antd/modal";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private modal: NzModalService,
    private authService: AuthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
  {
    const role = route.firstChild?.data['role'];
    return this.checkAccess(role);
  }

  checkAccess(allowedRoles: string[]): boolean | UrlTree {
    if (this.authService.userAuthenticated()) {
      const tokenPayload = this.authService.decodedToken();
      const userRole = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (allowedRoles && allowedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['login']);
        this.messageInfo();
        this.authService.signOut();
        return false;
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  messageInfo(): void {
    this.modal.error({
      nzTitle: 'Acesso negado!',
      nzContent: 'Você não tem permissão para acessar aquela página.',
      nzOnOk: () => {}
    });
  }

}
