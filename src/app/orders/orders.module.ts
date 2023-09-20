import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OrderListComponent },
      { path: 'view', component: ViewOrderComponent },
    ],
  },
];

@NgModule({
  declarations: [OrdersComponent, OrderListComponent, ViewOrderComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class OrdersModule {}
