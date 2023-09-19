import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { Route, RouterModule } from '@angular/router';

const route: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TermsComponent,
    data: { animation: 'fadeInOut' },
  },
];

@NgModule({
  declarations: [TermsComponent],
  imports: [CommonModule, RouterModule.forChild(route)],
})
export class TermsModule {}
