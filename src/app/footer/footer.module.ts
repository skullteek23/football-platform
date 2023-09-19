import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { LogoModule } from '@app/shared-modules/logo/logo.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, MatDividerModule, LogoModule, RouterModule],
  exports: [FooterComponent],
})
export class FooterModule {}
