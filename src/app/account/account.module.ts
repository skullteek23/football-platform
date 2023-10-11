import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { EditDetailsComponent } from './components/edit-details/edit-details.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { ChangeNumberModule } from '@app/shared-modules/change-number/change-number.module';
import { MatIconModule } from '@angular/material/icon';
import { DetailsContainerModule } from '@app/shared-modules/details-container/details-container.module';
import { FooterModule } from '@app/footer/footer.module';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', component: ViewDetailsComponent, pathMatch: 'full' },
      { path: 'edit', pathMatch: 'full', component: EditDetailsComponent },
    ],
  },
];

@NgModule({
  declarations: [AccountComponent, ViewDetailsComponent, EditDetailsComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    RouterModule.forChild(routes),
    ChangeNumberModule,
    MatIconModule,
    DetailsContainerModule,
    FooterModule
  ],
})
export class AccountModule { }
