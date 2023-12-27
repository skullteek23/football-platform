import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderFailureResponse } from '@app/shared-modules/order-page-failure/models/order-failure.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})
export class FailureComponent implements OnInit, OnDestroy {
  responseData!: OrderFailureResponse;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.responseData = new OrderFailureResponse();
    this.subscription.add(this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('slot') && params['slot']) {
        this.responseData.value = params['slot'];
      }
      if (params && params.hasOwnProperty('message') && params['message']) {
        this.responseData.description = params['message'];
      }
      if (params && params.hasOwnProperty('status') && params['status']) {
        this.responseData.status = params['status'];
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
