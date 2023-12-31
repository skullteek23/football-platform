import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      {
        path: 'wallet',
        loadChildren: () =>
          import('@app/wallet/wallet.module').then((m) => m.WalletModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('@app/account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('@app/orders/orders.module').then((m) => m.OrdersModule),
      },
    ],
  },
];

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class UserModule { }
