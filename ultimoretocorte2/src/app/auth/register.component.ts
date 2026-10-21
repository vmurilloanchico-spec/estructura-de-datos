import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="container py-5" style="max-width: 480px">
      <h1 class="mb-4">Fake Login App</h1>
      <section class="card">
        <div class="card-body">
          <h2 class="h4 mb-3">Registro</h2>
          <div class="alert alert-warning" *ngIf="!auth.isConfigured">Configura Firebase en <code>src/environments/environment.ts</code>.</div>
          <div class="alert alert-danger" *ngIf="errorMessage()" role="alert">{{ errorMessage() }}</div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label class="form-label" for="name">Nombre</label>
            <input class="form-control mb-3" id="name" type="text" formControlName="name" autocomplete="name" required>
            <label class="form-label" for="email">Correo electrónico</label>
            <input class="form-control mb-3" id="email" type="email" formControlName="email" autocomplete="email" required>
            <label class="form-label" for="password">Contraseña</label>
            <input class="form-control mb-3" id="password" type="password" formControlName="password" autocomplete="new-password" required>
            <button class="btn btn-primary w-100" type="submit" [disabled]="busy() || !auth.isConfigured">{{ busy() ? 'Creando cuenta...' : 'Registrarse' }}</button>
          </form>
          <p class="mt-3 mb-0">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
        </div>
      </section>
    </main>
  `,
})
export class RegisterComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  readonly busy = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async submit(): Promise<void> {
    this.errorMessage.set('');
    const { name, email, password } = this.form.getRawValue();
    if (this.form.invalid || this.busy()) return;

    this.busy.set(true);
    try {
      await this.auth.register(name.trim(), email.trim(), password);
      await this.router.navigateByUrl('/tasks');
    } catch (error) {
      this.errorMessage.set(this.readError(error));
    } finally {
      this.busy.set(false);
    }
  }

  private readError(error: unknown): string {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/email-already-in-use') return 'Ese correo ya tiene una cuenta.';
    if (code === 'auth/invalid-email') return 'El formato del correo no es válido.';
    if (code === 'auth/weak-password') return 'Elige una contraseña más segura.';
    return error instanceof Error ? error.message : 'No se pudo crear la cuenta. Inténtalo de nuevo.';
  }
}
