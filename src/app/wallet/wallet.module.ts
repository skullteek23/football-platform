import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { WalletTransactionListComponent } from './components/wallet-transaction-list/wallet-transaction-list.component';
import { WalletTransactionItemComponent } from './components/wallet-transaction-item/wallet-transaction-item.component';
import { MatListModule } from '@angular/material/list';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { FooterModule } from '@app/footer/footer.module';

@NgModule({
  declarations: [WalletComponent, WalletTransactionListComponent, WalletTransactionItemComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatListModule,
    PlaceholderModule,
    FooterModule,
    RouterModule.forChild([{ path: '', component: WalletComponent }]),
  ],
})
export class WalletModule { }
