import { NgModule } from '@angular/core';
import { IconsShareComponent } from './icons-share.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    IconsShareComponent
  ],
  imports: [
    ShareButtonsModule.withConfig(),
    ShareIconsModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    IconsShareComponent
  ],
  entryComponents: [IconsShareComponent],
})
export class IconsShareModule { }
