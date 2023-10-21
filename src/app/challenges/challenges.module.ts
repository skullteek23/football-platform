import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesComponent } from './challenges.component';
import { RouterModule } from '@angular/router';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

@NgModule({
  declarations: [ChallengesComponent],
  imports: [
    CommonModule,
    PlaceholderModule,
    RouterModule.forChild([{ path: '', component: ChallengesComponent }]),
  ],
})
export class ChallengesModule { }
