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
import { ProfilePhotoUploaderModule } from '@app/shared-modules/profile-photo-uploader/profile-photo-uploader.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorsModule } from '@app/shared-modules/form-field-errors/form-field-errors.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from '@app/utils/custom-date-formats';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { ImageViewerModule } from '@app/shared-modules/image-viewer/image-viewer.module';

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
    FooterModule,
    MatFormFieldModule,
    MatInputModule,
    FormFieldErrorsModule,
    ReactiveFormsModule,
    ProfilePhotoUploaderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    LoaderModule,
    ImageViewerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ]
})
export class AccountModule { }
