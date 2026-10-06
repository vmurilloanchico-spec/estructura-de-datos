import { Routes } from '@angular/router';
import { menuItems, MenuItem } from './menu';

function crearRutas(items: MenuItem[]): Routes {
  return items.flatMap((item) => [
    { path: item.link, component: item.component },
    ...(item.children ? crearRutas(item.children) : []),
  ]);
}

export const routes: Routes = [
  { path: '', redirectTo: 'perfil', pathMatch: 'full' },
  ...crearRutas(menuItems),
  { path: '**', redirectTo: 'perfil' },
];
