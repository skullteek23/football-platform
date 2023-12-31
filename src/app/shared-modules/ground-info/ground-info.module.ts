import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundInfoComponent } from './ground-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { LoaderModule } from '../loader/loader.module';



@NgModule({
  declarations: [
    GroundInfoComponent
  ],
  imports: [
    MatIconModule,
    MatChipsModule,
    LoaderModule
  ],
  exports: [
    GroundInfoComponent
  ]
})
export class GroundInfoModule { }
