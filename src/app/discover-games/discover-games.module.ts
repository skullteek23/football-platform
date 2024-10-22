import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DiscoverGamesComponent } from './discover-games.component';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { GameListViewerComponent } from './components/game-list-viewer/game-list-viewer.component';
import { DiscoverMoreComponent } from './components/discover-more/discover-more.component';
import { MyGamesComponent } from './components/my-games/my-games.component';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { GroundInfoModule } from '@app/shared-modules/ground-info/ground-info.module';
import { UnauthorizedAccessGuard } from '@app/utils/guards/unauthorized-access.guard';
import { IconsShareModule } from '@app/shared-modules/icons-share/icons-share.module';
import { PlayersListModule } from '@app/shared-modules/players-list/players-list.module';

const routes: Route[] = [
  {
    path: '',
    component: DiscoverGamesComponent,
    children: [
      { path: '', redirectTo: 'discover', pathMatch: 'full' },
      { path: 'discover', component: DiscoverMoreComponent, canActivate: [UnauthorizedAccessGuard] },
      { path: 'bookings', component: MyGamesComponent, canActivate: [UnauthorizedAccessGuard] }
    ]
  },
]

@NgModule({
  declarations: [DiscoverGamesComponent, GameListViewerComponent, DiscoverMoreComponent, MyGamesComponent],
  imports: [
    ButtonsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    GroundInfoModule,
    LoaderModule,
    PlaceholderModule,
    IconsShareModule,
    PlayersListModule
  ]
})
export class DiscoverGamesModule { }
