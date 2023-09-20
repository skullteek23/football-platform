import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WalletComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: WalletComponent }]),
  ],
})
export class WalletModule {}
