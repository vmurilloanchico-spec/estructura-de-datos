import { Type } from '@angular/core';
import {
  AyudaComponent,
  CerrarSesionComponent,
  ConfiguracionComponent,
  ContrasenaComponent,
  CuentaComponent,
  MensajesComponent,
  PerfilComponent,
  PreguntasComponent,
  PrivacidadComponent,
  SoporteComponent,
} from './pages/pages';

export interface MenuItem {
  title: string;
  link: string;
  component: Type<unknown>;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { title: 'Perfil', link: 'perfil', component: PerfilComponent },
  { title: 'Mensajes', link: 'mensajes', component: MensajesComponent },
  {
    title: 'Configuración',
    link: 'configuracion',
    component: ConfiguracionComponent,
    children: [
      { title: 'Cuenta', link: 'configuracion/cuenta', component: CuentaComponent },
      { title: 'Privacidad', link: 'configuracion/privacidad', component: PrivacidadComponent },
      { title: 'Contraseña', link: 'configuracion/contrasena', component: ContrasenaComponent },
    ],
  },
  {
    title: 'Ayuda',
    link: 'ayuda',
    component: AyudaComponent,
    children: [
      { title: 'Preguntas frecuentes', link: 'ayuda/preguntas', component: PreguntasComponent },
      { title: 'Soporte', link: 'ayuda/soporte', component: SoporteComponent },
    ],
  },
  { title: 'Cerrar sesión', link: 'cerrar-sesion', component: CerrarSesionComponent },
];
