import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainShellRoutingModule } from './main-shell-routing.module';
import { MainShellComponent } from './main-shell.component';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { PlayerListModule } from '@app/shared-modules/player-list/player-list.module';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';

@NgModule({
  declarations: [MainShellComponent],
  imports: [CommonModule, MainShellRoutingModule, LoaderModule, PlayerListModule, PaymentModule],
})
export class MainShellModule { }
