import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginBottomSheetComponent } from './authentication/login-bottom-sheet/login-bottom-sheet.component';
import { SignupBottomSheetComponent } from './authentication/signup-bottom-sheet/signup-bottom-sheet.component';
import { ConfirmFormClosureGuard } from './guards/confirm-form-closure.guard';
import { RedirectLoggedUserGuard } from './authentication/guards/redirect-logged-user.guard';
import { HomeComponent } from './home/home.component';
import { UnauthorizedAccessGuard } from './authentication/guards/unauthorized-access.guard';
import { Constants } from '@ballzo-ui/core/common';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'm',
    canActivate: [UnauthorizedAccessGuard],
    loadChildren: () =>
      import('./main-shell/main-shell.module').then((m) => m.MainShellModule),
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
    data: { animation: 'fadeInOut' },
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
    data: { animation: 'fadeInOut' },
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
