import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenImageViewerComponent } from './full-screen-image-viewer.component';



@NgModule({
  declarations: [
    FullScreenImageViewerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FullScreenImageViewerComponent
  ]
})
export class FullScreenImageViewerModule { }
