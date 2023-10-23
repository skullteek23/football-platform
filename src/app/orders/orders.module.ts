import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';
import { RouterModule, Routes } from '@angular/router';
import { OrderPageSuccessModule } from '@app/shared-modules/order-page-success/order-page-success.module';
import { FooterModule } from '@app/footer/footer.module';
import { MatListModule } from '@angular/material/list';
import { TransactionItemModule } from '@app/shared-modules/transaction-item/transaction-item.module';
import { ParseOrderService } from './services/parse-order.service';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OrderListComponent },
      { path: 'view', component: ViewOrderComponent },
      { path: 'view/:oid', component: ViewOrderComponent },
    ],
  },
];

@NgModule({
  declarations: [OrdersComponent, OrderListComponent, ViewOrderComponent],
  imports: [CommonModule, RouterModule.forChild(routes), OrderPageSuccessModule, FooterModule, MatListModule, TransactionItemModule],
  providers: [
    CurrencyPipe,
    DatePipe,
    ParseOrderService
  ]
})
export class OrdersModule { }
