import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsContainerComponent } from './details-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DetailsContainerComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DetailsContainerComponent
  ]
})
export class DetailsContainerModule { }
