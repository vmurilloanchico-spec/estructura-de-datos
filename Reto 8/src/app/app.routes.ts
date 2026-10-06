import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { EjercicioDosComponent, EjercicioUnoComponent, LoginPageComponent } from './pages.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'ejercicio-1', component: EjercicioUnoComponent, canActivate: [authGuard] },
  { path: 'ejercicio-2', component: EjercicioDosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'ejercicio-1', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
