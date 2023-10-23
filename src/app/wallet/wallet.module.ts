import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { WalletTransactionListComponent } from './components/wallet-transaction-list/wallet-transaction-list.component';
import { MatListModule } from '@angular/material/list';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { FooterModule } from '@app/footer/footer.module';
import { WalletService } from './services/wallet.service';
import { TransactionItemModule } from '@app/shared-modules/transaction-item/transaction-item.module';

@NgModule({
  declarations: [WalletComponent, WalletTransactionListComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatListModule,
    PlaceholderModule,
    FooterModule,
    TransactionItemModule,
    RouterModule.forChild([{ path: '', component: WalletComponent }]),
  ],
  providers: [
    WalletService,
    DatePipe
  ]
})
export class WalletModule { }
