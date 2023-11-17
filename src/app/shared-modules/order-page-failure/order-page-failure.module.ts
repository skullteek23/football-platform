import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPageFailureComponent } from './order-page-failure.component';
import { ResultBoxModule } from '../result-box/result-box.module';
import { MatIconModule } from '@angular/material/icon';
import { ButtonsModule } from '../buttons/buttons.module';

@NgModule({
  declarations: [
    OrderPageFailureComponent
  ],
  imports: [
    CommonModule,
    ResultBoxModule,
    ButtonsModule,
    MatIconModule
  ],
  exports: [
    OrderPageFailureComponent
  ]
})
export class OrderPageFailureModule { }
