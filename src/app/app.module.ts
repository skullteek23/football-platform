import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { TopNavComponent } from './top-nav/top-nav.component';
import { LogoModule } from './shared-modules/logo/logo.module';
import { LoginBottomSheetModule } from './authentication/login/login-bottom-sheet.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { LoaderModule } from './shared-modules/loader/loader.module';
import { HomeModule } from './home/home.module';
import { SignupBottomSheetModule } from './authentication/signup/signup-bottom-sheet.module';
import { NavigationService } from './utils/services/navigation.service';
import { CoreApiService } from './utils/services/core-api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, TopNavComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LogoModule,
    LoginBottomSheetModule,
    SignupBottomSheetModule,
    LoaderModule,
    HomeModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatButtonModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideFunctions(() =>
      getFunctions(undefined, environment.firebase.locationId)
    ),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    /* Initialize Services and/or run code on application initialization. */
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => null,
      deps: [NavigationService, CoreApiService],
      multi: true,
    },
    DatePipe,
    NgxImageCompressService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
