# Fake Login App

Aplicación Angular standalone con registro e inicio de sesión de Firebase y gestión de tareas en Cloud Firestore.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm
- Un proyecto de Firebase con Authentication y Cloud Firestore habilitados

## Configurar Firebase

1. En Firebase Console, crea un proyecto web y activa el proveedor **Correo electrónico/contraseña** en Authentication.
2. Crea la base de datos de Cloud Firestore.
3. Copia la configuración de la app web en `src/environments/environment.ts`.
4. Publica las reglas de `firestore.rules` en la sección **Firestore Database > Rules**.

La app ya está conectada al proyecto Firebase `fake-login-app`. Authentication con correo/contraseña está habilitado y Firestore usa la base `(default)` en `southamerica-east1` con reglas que separan las tareas por UID.

## Desarrollo

```bash
npm install
npm start
```

Abre la URL local que indique Angular CLI, normalmente `http://localhost:4200`.

## Producción

```bash
npm run build
```

Los artefactos se generan en `dist/taskguard/browser`.

## Funcionalidad

- Registro, inicio de sesión y cierre de sesión con Firebase Auth.
- Ruta `/tasks` protegida con un guard de Angular.
- Crear, editar, borrar y completar tareas.
- Tareas separadas por UID en Firestore y reglas de acceso por usuario.
- Servicios dedicados de autenticación y tareas.
