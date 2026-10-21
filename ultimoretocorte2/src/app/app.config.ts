import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

const firebase = environment.firebase;
const firebaseOptions = {
  apiKey: firebase.apiKey || 'not-configured',
  authDomain: firebase.authDomain || 'not-configured.firebaseapp.com',
  projectId: firebase.projectId || 'taskguard-not-configured',
  storageBucket: firebase.storageBucket || 'taskguard-not-configured.appspot.com',
  messagingSenderId: firebase.messagingSenderId || '000000000000',
  appId: firebase.appId || '1:000000000000:web:not-configured',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseOptions)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
