import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {

  orderID!: string;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        if (params && params.hasOwnProperty('oid') && params['oid']) {
          this.orderID = params['oid'];
        } else {
          console.log('error');
          this.router.navigate(['/error']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
