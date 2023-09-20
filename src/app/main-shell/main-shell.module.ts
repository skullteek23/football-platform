import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainShellRoutingModule } from './main-shell-routing.module';
import { MainShellComponent } from './main-shell.component';

@NgModule({
  declarations: [MainShellComponent],
  imports: [CommonModule, MainShellRoutingModule],
})
export class MainShellModule {}
