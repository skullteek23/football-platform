import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'football-platform';

  constructor() {
    this.title = environment.production ? 'This is production' : 'This is dev';
  }
}
