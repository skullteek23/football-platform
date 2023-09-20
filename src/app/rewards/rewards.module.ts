import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardsComponent } from './rewards.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RewardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: RewardsComponent }]),
  ],
})
export class RewardsModule {}
