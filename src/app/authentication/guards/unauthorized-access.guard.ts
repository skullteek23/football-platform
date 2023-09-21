import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import {
  GlobalConstants,
  SessionStorageProperties,
} from '@app/constant/app-constants';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { SignupBottomSheetComponent } from '../signup-bottom-sheet/signup-bottom-sheet.component';
import { SessionStorageService } from '@app/services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthorizedAccessGuard implements CanActivate, CanActivateChild {
  readonly NON_REDIRECT_URLS = ['/(open:signup)', '/(open:login)', '/'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private sheetService: BottomSheetService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (state?.url && !this.NON_REDIRECT_URLS.includes(state.url)) {
      this.sessionStorageService.set(
        SessionStorageProperties.REDIRECT_URL,
        state.url
      );
    }
    if (this.authService.isUserLogin()) {
      return true;
    }
    this.router.navigate([
      { outlets: { [GlobalConstants.SHEET_OPEN_OUTLET]: 'login' } },
    ]);
    this.sheetService.openSheet(SignupBottomSheetComponent);
    return false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
