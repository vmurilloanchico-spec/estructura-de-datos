import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { menuItems } from './menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Menú</h2>
        <nav>
          @for (item of menuItems; track item.link) {
            <div class="menu-group">
              <a [routerLink]="'/' + item.link" routerLinkActive="activo">{{ item.title }}</a>
              @if (item.children) {
                <div class="submenus">
                  @for (child of item.children; track child.link) {
                    <a [routerLink]="'/' + child.link" routerLinkActive="activo">{{ child.title }}</a>
                  }
                </div>
              }
            </div>
          }
        </nav>
      </aside>

      <main class="contenido">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly menuItems = menuItems;
}
