import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiscoverGamesComponent } from './discover-games.component';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DiscoverGamesComponent],
  imports: [ButtonsModule, RouterModule,MatCardModule,MatIconModule ]
})
export class DiscoverGamesModule {}
