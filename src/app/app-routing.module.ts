import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginBottomSheetComponent } from './authentication/login/login-bottom-sheet.component';
import { SignupBottomSheetComponent } from './authentication/signup/signup-bottom-sheet.component';
import { ConfirmFormClosureGuard } from './utils/guards/confirm-form-closure.guard';
import { RedirectLoggedUserGuard } from './utils/guards/redirect-logged-user.guard';
import { Constants } from '@ballzo-ui/core';
import { HomeComponent } from './home/home.component';
import { UnauthorizedAccessGuard } from './utils/guards/unauthorized-access.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'games',
    canActivate: [UnauthorizedAccessGuard],
    loadChildren: () =>
      import('@app/discover-games/discover-games.module').then(
        (m) => m.DiscoverGamesModule
      ),
  },
  {
    path: 'payment',
    canActivate: [UnauthorizedAccessGuard],
    loadChildren: () =>
      import('@app/slot-payment/slot-payment.module').then(
        (m) => m.SlotPaymentModule
      ),
  },
  {
    path: 'grounds-near-me',
    loadChildren: () =>
      import('@app/grounds-near-me/grounds-near-me.module').then(
        (m) => m.GroundsNearMeModule
      ),
  },
  {
    path: 'challenges',
    loadChildren: () =>
      import('@app/challenges/challenges.module').then(
        (m) => m.ChallengesModule
      ),
  },
  {
    path: 'rankings',
    loadChildren: () =>
      import('@app/rankings/rankings.module').then((m) => m.RankingsModule),
  },
  {
    path: 'rewards',
    loadChildren: () =>
      import('@app/rewards/rewards.module').then((m) => m.RewardsModule),
  },
  {
    path: 'support',
    canActivate: [UnauthorizedAccessGuard],
    loadChildren: () =>
      import('@app/support/support.module').then((m) => m.SupportModule),
  },
  {
    path: 'user',
    canActivate: [UnauthorizedAccessGuard],
    loadChildren: () =>
      import('@app/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'login',
    component: LoginBottomSheetComponent,
    canActivate: [RedirectLoggedUserGuard],
    canDeactivate: [ConfirmFormClosureGuard],
    outlet: Constants.SHEET_OPEN_OUTLET,
  },
  {
    path: 'signup',
    component: SignupBottomSheetComponent,
    canActivate: [RedirectLoggedUserGuard],
    canDeactivate: [ConfirmFormClosureGuard],
    outlet: Constants.SHEET_OPEN_OUTLET,
  },
  {
    path: 'register',
    redirectTo: 'signup',
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./legal-info/terms/terms.module').then((m) => m.TermsModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./legal-info/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: 'cancellation-and-refund-policy',
    loadChildren: () =>
      import('./legal-info/cancellation-policy/cancellation-policy.module').then((m) => m.CancellationPolicyModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.module').then((m) => m.ErrorModule),
  },
  { path: '**', redirectTo: 'error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
