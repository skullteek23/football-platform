import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {
  orderID!: string;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('oid') && params['oid']) {
        this.orderID = params['oid'];
      } else {
        this.router.navigate(['/error']);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
