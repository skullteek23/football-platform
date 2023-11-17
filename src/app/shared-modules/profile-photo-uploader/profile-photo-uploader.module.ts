import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePhotoUploaderComponent } from './profile-photo-uploader.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ProfilePhotoUploaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    ProfilePhotoUploaderComponent
  ]
})
export class ProfilePhotoUploaderModule { }
