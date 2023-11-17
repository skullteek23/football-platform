import { NgModule } from '@angular/core';
import { LogoComponent } from './logo.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LogoComponent],
  imports: [RouterModule],
  exports: [LogoComponent],
})
export class LogoModule {}
