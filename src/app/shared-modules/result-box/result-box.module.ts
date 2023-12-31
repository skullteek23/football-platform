import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultBoxComponent } from './result-box.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ResultBoxComponent
  ],
  imports: [
    CommonModule, MatIconModule
  ],
  exports: [ResultBoxComponent]
})
export class ResultBoxModule { }
