import { NgModule } from '@angular/core';
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
import { MaterialModule } from './material.module';
import { TopNavComponent } from './top-nav/top-nav.component';
import { LogoModule } from './shared-modules/logo/logo.module';
import { HomeModule } from './home/home.module';
import { LoginBottomSheetModule } from './authentication/login-bottom-sheet/login-bottom-sheet.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const firebase = {
  projectId: 'football-platform-dev',
  appId: '1:386420685008:web:f8105a75d5859ab49386d5',
  databaseURL:
    'https://football-platform-dev-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'football-platform-dev.appspot.com',
  locationId: 'asia-south1',
  apiKey: 'AIzaSyAiPctyxsb1rWPqI-VqwhXmha1_1GwO4t4',
  authDomain: 'football-platform-dev.firebaseapp.com',
  messagingSenderId: '386420685008',
};

@NgModule({
  declarations: [AppComponent, TopNavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LogoModule,
    HomeModule,
    LoginBottomSheetModule,

    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideFunctions(() =>
      getFunctions(undefined, environment.firebase.locationId)
    ),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
