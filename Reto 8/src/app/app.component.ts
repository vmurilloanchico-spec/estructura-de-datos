import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="barra">
      <strong>Reto 8: Login</strong>
      @if (auth.usuario(); as usuario) {
        <nav>
          <a routerLink="/ejercicio-1" routerLinkActive="activo">Ejercicio 1</a>
          <a routerLink="/ejercicio-2" routerLinkActive="activo">Ejercicio 2</a>
          <span>Usuario: {{ usuario }}</span>
          <button type="button" (click)="salir()">Cerrar sesión</button>
        </nav>
      }
    </header>
    <main class="contenido">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected salir(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
