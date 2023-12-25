import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { Constants } from '@ballzo-ui/core';
import { IUser } from '@app/utils/models/user.model';
import { OrderRz } from '@ballzo-ui/core';
import { ParseOrderService } from '@app/orders/services/parse-order.service';
import { OrderService } from '@app/utils/services/order.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  readonly SHIMMER_ARRAY = Constants.PLACEHOLDER_ARRAY;

  ordersList: OrderRz[] = [];
  uiList: TransactionItemData[] = [];
  user!: IUser;
  isLoaderShown = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private parseOrderService: ParseOrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.showLoader();
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.user = user;
        this.getOrders();
      } else {
        this.router.navigate(['/error']);
      }
    })
  }

  /**
   * Get orders by user
  */
  getOrders() {
    if (this.user) {
      this.orderService.getOrdersByUser(this.user.uid).subscribe({
        next: orders => {
          this.ordersList = orders;
          this.uiList = this.parseOrderService.parseOrderList(orders);
          this.hideLoader();
        },
        error: err => {
          this.ordersList = [];
          this.uiList = [];
          this.snackbarService.displayError(err);
          this.hideLoader();
        }
      });
    }
  }

  /**
   * Show loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hide loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }

}
