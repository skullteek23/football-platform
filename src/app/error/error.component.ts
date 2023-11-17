import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  displayDets = new ButtonConfig();

  constructor(private router: Router) {
    this.displayDets.label = 'Go Home';
  }

  goBack() {
    this.router.navigate(['/']); // Navigate back to the previous page
  }
}
