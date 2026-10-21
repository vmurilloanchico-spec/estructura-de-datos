import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="container py-5" style="max-width: 480px">
      <h1 class="mb-4">Fake Login App</h1>
      <section class="card">
        <div class="card-body">
          <h2 class="h4 mb-3">Iniciar sesión</h2>
          <div class="alert alert-warning" *ngIf="!auth.isConfigured">Configura Firebase en <code>src/environments/environment.ts</code>.</div>
          <div class="alert alert-danger" *ngIf="errorMessage()" role="alert">{{ errorMessage() }}</div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label class="form-label" for="email">Correo electrónico</label>
            <input class="form-control mb-3" id="email" type="email" formControlName="email" autocomplete="email" required>
            <label class="form-label" for="password">Contraseña</label>
            <input class="form-control mb-3" id="password" type="password" formControlName="password" autocomplete="current-password" required>
            <button class="btn btn-primary w-100" type="submit" [disabled]="busy() || !auth.isConfigured">{{ busy() ? 'Entrando...' : 'Iniciar sesión' }}</button>
          </form>
          <p class="mt-3 mb-0">¿No tienes cuenta? <a routerLink="/register">Regístrate</a></p>
        </div>
      </section>
    </main>
  `,
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  readonly busy = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit(): Promise<void> {
    this.errorMessage.set('');
    if (this.form.invalid || this.busy()) return;

    this.busy.set(true);
    try {
      await this.auth.login(this.form.controls.email.value.trim(), this.form.controls.password.value);
      await this.router.navigateByUrl('/tasks');
    } catch (error) {
      this.errorMessage.set(this.readError(error));
    } finally {
      this.busy.set(false);
    }
  }

  private readError(error: unknown): string {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'El correo o la contraseña no coinciden.';
    }
    if (code === 'auth/too-many-requests') return 'Demasiados intentos. Prueba de nuevo más tarde.';
    return error instanceof Error ? error.message : 'No se pudo iniciar sesión. Inténtalo de nuevo.';
  }
}
