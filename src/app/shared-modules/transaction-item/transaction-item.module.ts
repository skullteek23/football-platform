import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionItemComponent } from './transaction-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    TransactionItemComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatRippleModule
  ],
  exports: [
    TransactionItemComponent
  ]
})
export class TransactionItemModule { }
