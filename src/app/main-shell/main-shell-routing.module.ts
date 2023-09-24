import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainShellComponent } from './main-shell.component';
import { PlayerListComponent } from '../shared-modules/player-list/player-list.component';
import { OnboardingGuard } from '@app/guards/onboarding.guard';

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
        path: 'user',
        loadChildren: () =>
          import('@app/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'onboarding',
        canActivate: [OnboardingGuard],
        data: {
          destination: 'onboarding',
        },
        loadChildren: () =>
          import('@app/onboarding/onboarding.module').then(
            (m) => m.OnboardingModule
          ),
      },
      {
        path: 'book-match',
        canActivate: [OnboardingGuard],
        data: {
          destination: 'booking',
        },
        loadChildren: () =>
          import('@app/match-booking/match-booking.module').then(
            (m) => m.MatchBookingModule
          ),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('@app/shared-modules/payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'players-list',
        component: PlayerListComponent
      },
      {
        path: 'players-list/:slotid',
        component: PlayerListComponent
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
export class MainShellRoutingModule { }
