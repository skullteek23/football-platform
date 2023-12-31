import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonDirective } from './back-button.directive';
import { StickyTopBarDirective } from './sticky-top-bar.directive';



@NgModule({
  declarations: [
    BackButtonDirective,
    StickyTopBarDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackButtonDirective
  ]
})
export class DirectivesModule { }
