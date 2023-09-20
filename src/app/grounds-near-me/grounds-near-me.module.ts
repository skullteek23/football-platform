import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundsNearMeComponent } from './grounds-near-me.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GroundsNearMeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: GroundsNearMeComponent }]),
  ],
})
export class GroundsNearMeModule {}
