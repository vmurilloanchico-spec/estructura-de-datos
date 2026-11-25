# Challenge 10 · Mis tareas

Aplicación de Angular con Vite y Supabase. Cada persona tiene una lista privada y puede guardar una foto de perfil. Para ejecutar el proyecto necesitas Node.js 22.12 o superior y un proyecto de Supabase.

## 1. Preparar Supabase

1. En https://supabase.com/dashboard crea un proyecto nuevo y espera a que termine de aprovisionarse.
2. En SQL Editor abre una consulta nueva. Copia el contenido completo de `supabase/setup.sql` y pulsa **Run**. El script está pensado para un proyecto nuevo.
3. Comprueba que aparece `tasks` en Table Editor con RLS habilitado y que aparece el bucket privado `avatars` en Storage. La carpeta de cada usuario se crea con la primera imagen.
4. En Authentication verifica que el proveedor Email permita registros. En URL Configuration usa `http://localhost:5173` como Site URL para la prueba local. Si usas Codespaces, usa la dirección HTTPS del puerto 5173 en Site URL y Redirect URLs. Abre esa misma dirección para registrarte.
5. En **Connect** o en la configuración del proyecto copia **Project URL** y **Publishable key**. En el frontend solo se usa la clave publicable.

## 2. Abrir la aplicación

1. Extrae el ZIP. Abre en VS Code la carpeta que contiene `package.json`.
2. Copia el archivo `.env.example` con el nombre `.env`. Reemplaza ambos valores con los de tu proyecto y guarda. Si cambias el archivo después, reinicia el servidor.
3. Abre la terminal de esa carpeta y ejecuta:

```sh
npm ci
npm start
```

4. Abre la dirección que imprime Vite (normalmente http://localhost:5173). En Codespaces entra por **Puertos → 5173 → Abrir en el navegador**. Los botones y la lista están en esa página.
5. Para comprobar la compilación usa `npm run build`.

## 3. Demostrar el challenge

| Prueba | Qué hacer | Qué debes observar |
| --- | --- | --- |
| Registro | Pulsa Crear una cuenta. Ingresa un correo al que tengas acceso y una contraseña de al menos 6 caracteres. Si está activa la confirmación, abre el enlace del correo. | El usuario aparece en Authentication → Users. |
| Login | Si el enlace ya abrió tu sesión, ciérrala. Entra con el correo y la contraseña. | Aparece Mis tareas. |
| CRUD y lista en vivo | Abre la aplicación dos veces en el mismo navegador con la misma cuenta. Espera a que ambas digan Lista en vivo conectada. En la primera agrega una tarea, edita el título, marca la casilla y luego elimínala. | La segunda pestaña refleja cada cambio sin recargar. |
| RLS | Deja una tarea creada en la cuenta A. En una ventana de incógnito entra con otra cuenta confirmada B y crea otra tarea. | A y B ven únicamente sus tareas, incluso después de recargar. |
| Avatar | Selecciona un JPG, PNG o WebP de hasta 2 MB. Luego recarga e intenta reemplazarlo. | Ves tu foto y luego la nueva. En Storage aparece avatars → ID del usuario → avatar. |

**Para sustentar:** “Al crear una tarea, Supabase guarda el identificador del usuario que inició sesión. La política RLS compara ese identificador con el de la sesión cada vez que alguien consulta o modifica una fila. Cuando una tarea cambia, la base envía un aviso por el canal privado de su dueño. Las pestañas que reciben ese aviso consultan las tareas de nuevo.”

## Si algo falla

- **Configura el archivo .env**: revisa el nombre del archivo, las dos variables y reinicia Vite.
- **Email not confirmed**: abre el correo de confirmación antes de iniciar sesión.
- **La lista funciona pero no se actualiza en otra pestaña**: confirma que ambas usan la misma cuenta y que ejecutaste el script completo, incluida la política de realtime.messages y el trigger task_changed. El proyecto usa Broadcast privado.
- **Error al subir la foto**: revisa el tipo, el tamaño y que hayas creado el bucket y su política ejecutando el SQL.
