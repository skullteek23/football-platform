import { Component, Input, OnInit } from '@angular/core';
import { TransactionItemData } from './models/transaction-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent implements OnInit {

  @Input() data = new TransactionItemData();

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  /**
   * Open link
   */
  openLink() {
    if (this.data.routeLink) {
      this.router.navigate([this.data.routeLink]);
    }
  }

}
