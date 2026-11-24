import { Routes } from '@angular/router';
import { App } from './app';

export const routes: Routes = [
  {
    path: 'reto-10',
    loadComponent: () => import('./reto-10/reto-10').then((module) => module.Reto10),
  },
  { path: '', component: App },
  { path: '**', redirectTo: '' },
];
