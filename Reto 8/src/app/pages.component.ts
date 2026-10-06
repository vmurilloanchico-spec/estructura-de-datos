import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="login panel">
      <h1>Iniciar sesión</h1>
      <form (ngSubmit)="entrar()">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" [(ngModel)]="email" required />

        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" [(ngModel)]="password" required />

        @if (error) {
          <p class="error">{{ error }}</p>
        }
        <button type="submit">Login</button>
      </form>
      <p class="hint">Usuario: user&#64;mail.com · Contraseña: 123</p>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected email = '';
  protected password = '';
  protected error = '';

  protected entrar(): void {
    if (this.auth.login(this.email, this.password)) {
      void this.router.navigate(['/ejercicio-1']);
    } else {
      this.error = 'Email o contraseña incorrectos.';
    }
  }
}

@Component({
  standalone: true,
  template: '<section class="panel"><h1>Ejercicio 1</h1><p>Esta es la primera página privada.</p></section>',
})
export class EjercicioUnoComponent {}

@Component({
  standalone: true,
  template: '<section class="panel"><h1>Ejercicio 2</h1><p>Esta es la segunda página privada.</p></section>',
})
export class EjercicioDosComponent {}
