import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesComponent } from './challenges.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ChallengesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ChallengesComponent }]),
  ],
})
export class ChallengesModule {}
