import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlainTextViewerComponent } from './plain-text-viewer.component';



@NgModule({
  declarations: [
    PlainTextViewerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlainTextViewerComponent
  ]
})
export class PlainTextViewerModule { }
