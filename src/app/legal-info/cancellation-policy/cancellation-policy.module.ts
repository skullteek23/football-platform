import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancellationPolicyComponent } from './cancellation-policy.component';
import { PlainTextViewerModule } from '@app/shared-modules/plain-text-viewer/plain-text-viewer.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    CancellationPolicyComponent
  ],
  imports: [
    CommonModule,
    PlainTextViewerModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    CancellationPolicyComponent
  ]
})
export class CancellationPolicyModule { }
