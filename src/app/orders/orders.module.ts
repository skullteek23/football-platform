import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';



@NgModule({
  declarations: [
    OrdersComponent,
    OrderListComponent,
    ViewOrderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class OrdersModule { }
