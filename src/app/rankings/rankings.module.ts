import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingsComponent } from './rankings.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RankingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: RankingsComponent }]),
  ],
})
export class RankingsModule {}
