import { Component } from '@angular/core';
import { AnimationsList } from './services/animation.service';
import { AuthService } from './authentication/auth.service';
import { Constants, LocalStorageProperties } from './constant/app-constants';
import { LocalStorageService } from './services/local-storage.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthConstants } from './authentication/constants/auth.constant';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [AnimationsList.fadeInOutAnimation],
})
export class AppComponent {
  readonly loginCaptcha = AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER;
  readonly signupCaptcha = AuthConstants.SIGNUP_CAPTCHA_PLACEHOLDER;
  title = 'football-platform';

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        let currentRoute = this.route.root;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }
        // Check if the current page should have scroll-to-top behavior
        const element = document.getElementById('main-container-app');
        if (currentRoute.snapshot.data['scrollToTop'] && element) {
          element.scrollIntoView();
        }
        // This event is fired when a route has successfully ended
        const sheetOpen = this.localStorageService.get(
          LocalStorageProperties.BOTTOM_SHEET
        );
        const loginRoute = `/${Constants.loginURL}`;
        const signupRoute = `/${Constants.signupURL}`;

        if (sheetOpen && window.location.pathname.includes(loginRoute)) {
          this.authService.openLogin();
        } else if (window.location.pathname.includes(signupRoute)) {
          this.authService.openSignup();
        }
      });
  }
}
