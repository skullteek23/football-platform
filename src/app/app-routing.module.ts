import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginBottomSheetComponent } from './authentication/login-bottom-sheet/login-bottom-sheet.component';
import { SignupBottomSheetComponent } from './authentication/signup-bottom-sheet/signup-bottom-sheet.component';
import { SignupBottomSheetModule } from './authentication/signup-bottom-sheet/signup-bottom-sheet.module';
import { ConfirmFormClosureGuard } from './guards/confirm-form-closure.guard';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RedirectLoggedUserGuard } from './authentication/guards/redirect-logged-user.guard';
const redirectUnauthorizedGuard = () => redirectUnauthorizedTo(['/']);

const routes: Routes = [
  {
    ...redirectUnauthorizedGuard,
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { animation: 'fadeInOut' },
  },
  {
    path: 'login',
    component: LoginBottomSheetComponent,
    canDeactivate: [ConfirmFormClosureGuard],
    outlet: 'open',
    canActivate: [RedirectLoggedUserGuard],
  },
  {
    path: 'signup',
    component: SignupBottomSheetComponent,
    canDeactivate: [ConfirmFormClosureGuard],
    outlet: 'open',
    canActivate: [RedirectLoggedUserGuard],
  },
  {
    path: 'register',
    redirectTo: 'signup',
  },
  {
    path: 'terms',
    data: { animation: 'fadeInOut' },
    loadChildren: () =>
      import('./terms/terms.module').then((m) => m.TermsModule),
  },
  {
    path: 'privacy-policy',
    redirectTo: 'terms',
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
  imports: [RouterModule.forRoot(routes), SignupBottomSheetModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
