import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { Route, RouterModule } from '@angular/router';
import { PlainTextViewerModule } from '@app/shared-modules/plain-text-viewer/plain-text-viewer.module';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: PrivacyPolicyComponent,
    data: { animation: 'fadeInOut' },
  },
];

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PlainTextViewerModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class PrivacyPolicyModule { }
