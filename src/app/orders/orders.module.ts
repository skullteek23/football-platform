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
import { CancelBookingComponent } from './components/cancel-booking/cancel-booking.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { MatButtonModule } from '@angular/material/button';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { MatChipsModule } from '@angular/material/chips';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

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
  declarations: [
    OrdersComponent,
    OrderListComponent,
    ViewOrderComponent,
    CancelBookingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrderPageSuccessModule,
    FooterModule,
    MatListModule,
    PlaceholderModule,
    TransactionItemModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    ButtonsModule,
    LoaderModule,
    MatButtonModule,
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    ParseOrderService
  ]
})
export class OrdersModule { }
