import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { Route, RouterModule } from '@angular/router';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';

const route: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ErrorComponent,
    data: { animation: 'fadeInOut' },
  },
];

@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ButtonsModule, RouterModule.forChild(route)],
})
export class ErrorModule {}
