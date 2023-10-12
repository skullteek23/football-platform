import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFileUploaderComponent } from './custom-file-uploader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    CustomFileUploaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule
  ],
  exports: [CustomFileUploaderComponent]
})
export class CustomFileUploaderModule { }
