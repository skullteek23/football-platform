import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RulesComponent } from './rules.component';
import { PlainTextViewerModule } from '@app/shared-modules/plain-text-viewer/plain-text-viewer.module';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: RulesComponent,
    data: { animation: 'fadeInOut', scrollToTop: true },
  },
];

@NgModule({
  declarations: [
    RulesComponent
  ],
  imports: [
    CommonModule,
    PlainTextViewerModule,
    RouterModule.forChild(routes)
  ]
})
export class RulesModule { }
