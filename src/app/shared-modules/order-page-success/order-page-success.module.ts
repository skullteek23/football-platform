import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPageSuccessComponent } from './order-page-success.component';
import { ResultBoxModule } from '../result-box/result-box.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    OrderPageSuccessComponent
  ],
  imports: [
    CommonModule,
    ResultBoxModule,
    ButtonsModule,
    MatIconModule
  ],
  exports: [
    OrderPageSuccessComponent
  ]
})
export class OrderPageSuccessModule { }
