import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingsComponent } from './rankings.component';
import { RouterModule } from '@angular/router';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

@NgModule({
  declarations: [RankingsComponent],
  imports: [
    CommonModule,
    PlaceholderModule,
    RouterModule.forChild([{ path: '', component: RankingsComponent }]),
  ],
})
export class RankingsModule { }
