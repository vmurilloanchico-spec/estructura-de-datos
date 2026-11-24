# Frontend

Este repositorio contiene el panel académico **Clínica Turnos** y el **Reto 10**, una aplicación de tareas con Angular y Supabase.

## Reto 10: Angular + Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard) y abre su SQL Editor.
2. Ejecuta el archivo [`supabase/migrations/202611240001_reto_10.sql`](./supabase/migrations/202611240001_reto_10.sql) para crear `public.tasks`, sus políticas RLS, el bucket `avatars` y habilitar cambios en tiempo real.
3. En **Project Settings → API** copia la Project URL y la clave pública `anon`/publishable. Configúralas en [`src/app/reto-10/supabase.config.ts`](./src/app/reto-10/supabase.config.ts). Nunca uses la clave `service_role` en el frontend.
4. Inicia Angular con `npm start` y visita `http://localhost:4200/reto-10`.
5. Registra una cuenta, confirma el correo si la confirmación está habilitada y luego inicia sesión.

La sección incluye autenticación, CRUD de tareas, lista sincronizada mediante Supabase Realtime y carga de foto de perfil. El bucket público permite ver las imágenes; las políticas solo permiten a cada usuario escribir en su propia carpeta. Las tareas están protegidas por RLS.

La pantalla original de turnos sigue disponible en `http://localhost:4200/`.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
