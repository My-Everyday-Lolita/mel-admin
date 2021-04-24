import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ROLES, UserService, UserSignInService } from '@my-everyday-lolita/mel-shared';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { SignInModalComponent } from './sign-in-modal/sign-in-modal.component';

@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {

  constructor(
    private signInService: UserSignInService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isSignedIn = this.signInService.isSignedIn();
    if (!isSignedIn) {
      return this.openSignInModal();
    }
    if (!this.userService.hasRole(ROLES.DAHSBOARD_ACCESS)) {
      this.translate.get('APP.TOASTS.ERRORS.ACCESS_DENIED').subscribe(translatedString => {
        this.toastr.error(translatedString, undefined, { disableTimeOut: true });
      });
      return this.openSignInModal();
    }
    return true;
  }

  private openSignInModal(): Observable<boolean> {
    return this.dialog.open(SignInModalComponent, {
      disableClose: true,
    }).afterClosed();
  }
}
