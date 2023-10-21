import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardsComponent } from './rewards.component';
import { RouterModule } from '@angular/router';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

@NgModule({
  declarations: [RewardsComponent],
  imports: [
    CommonModule,
    PlaceholderModule,
    RouterModule.forChild([{ path: '', component: RewardsComponent }]),
  ],
})
export class RewardsModule { }
