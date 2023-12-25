import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';
import {
  Constants,
  LocalStorageProperties,
} from '@ballzo-ui/core';
import { SessionStorageService } from '@app/utils/services/session-storage.service';
import { LocalStorageService } from '@app/utils/services/local-storage.service';
import { SessionStorageProperties } from '@app/utils/constant/constants';

@Injectable({
  providedIn: 'root',
})
export class UnauthorizedAccessGuard implements CanActivate {
  readonly NON_REDIRECT_URLS = [
    Constants.loginURL,
    Constants.signupURL,
    '/' + Constants.loginURL,
    '/' + Constants.signupURL,
    '/'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isUserLogin()) {
      return true;
    }
    if (state?.url && !this.NON_REDIRECT_URLS.includes(state.url)) {
      this.sessionStorageService.set(
        SessionStorageProperties.REDIRECT_URL,
        state.url
      );
    }
    this.localStorageService.set(LocalStorageProperties.BOTTOM_SHEET, true);
    this.router.navigate([
      { outlets: { [Constants.SHEET_OPEN_OUTLET]: 'login' } },
    ]);
    return false;
  }
}
