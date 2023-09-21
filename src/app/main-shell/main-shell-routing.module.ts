import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainShellComponent } from './main-shell.component';
import { CheckOnboardingStatusGuard } from '@app/guards/check-onboarding-status.guard';
import { RouteResolver } from '@app/utils/route.resolver';

const routes: Routes = [
  {
    path: '',
    component: MainShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'onboarding',
      },
      {
        path: 'onboarding',
        canActivate: [CheckOnboardingStatusGuard],
        canActivateChild: [CheckOnboardingStatusGuard],
        loadChildren: () =>
          import('@app/onboarding/onboarding.module').then(
            (m) => m.OnboardingModule
          ),
      },
      {
        path: 'book-match',
        loadChildren: () =>
          import('@app/match-booking/match-booking.module').then(
            (m) => m.MatchBookingModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('@app/user/user.module').then((m) => m.UserModule),
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
        loadChildren: () =>
          import('@app/support/support.module').then((m) => m.SupportModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainShellRoutingModule {}
