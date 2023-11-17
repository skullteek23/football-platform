import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { Route, RouterModule } from '@angular/router';
import { PlainTextViewerModule } from '@app/shared-modules/plain-text-viewer/plain-text-viewer.module';

const route: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: TermsComponent,
    data: { animation: 'fadeInOut', scrollToTop: true },
  },
];

@NgModule({
  declarations: [TermsComponent],
  imports: [CommonModule, RouterModule.forChild(route), PlainTextViewerModule],
})
export class TermsModule { }
