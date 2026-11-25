# Challenge 13 · Buscador de GIFs en Angular

## Configuración en Windows

1. En https://developers.giphy.com/dashboard/ inicia sesión o crea tu cuenta. Crea una aplicación para usar la API, dale un nombre como Challenge 13 y copia su API Key. Si ya creaste la aplicación de este reto, usa su clave.
2. Extrae el ZIP y abre la carpeta que contiene angular.json y package.json en VS Code. Usa Node.js 22.12 o superior de la rama 22, o Node.js 24.
3. En PowerShell ejecuta los siguientes comandos. Si ya tienes .env, abre ese archivo directamente.

```powershell
Copy-Item .env.example .env
notepad .env
```

4. Escribe GIPHY_API_KEY= seguido de tu propia clave, guarda y cierra el Bloc de notas.
5. Instala las dependencias con npm ci --include=dev. Cuando termine, ejecuta npm start y abre http://localhost:4213 o la dirección Local de la terminal.
6. Escribe smile y pulsa Buscar o Enter. Se deberían mostrar hasta 25 GIFs. Prueba otra palabra y verifica que cambien las imágenes. Haz clic en un GIF para abrirlo en GIPHY.

## Funcionamiento

Al ejecutar npm start o npm run build, scripts/config.mjs lee .env y genera la configuración que usa Angular. Si cambias la clave, detén el servidor con Ctrl+C y vuelve a ejecutar npm start. El proyecto excluye .env y el archivo generado de Git. La clave se utiliza en la petición del navegador y es visible para quien inspeccione la aplicación.

src/main.ts lee el texto, prepara los parámetros con URLSearchParams y llama al endpoint https://api.giphy.com/v1/gifs/search mediante fetch. Se envían api_key, q, limit=25, offset=0, rating=g y lang=en, como en la diapositiva. src/app.html muestra las imágenes de la respuesta y el nombre del creador cuando está disponible.

## Comprobación

- Busca smile y luego cats. Las búsquedas se envían al presionar Buscar o Enter.
- En el navegador, F12 → Red → Fetch/XHR permite revisar el estado de la petición a search. Un estado 200 indica que GIPHY atendió la búsqueda.
- Si la clave falta, la página indica cómo configurarla. Si GIPHY rechaza la clave o se alcanza la cuota, se muestra un mensaje.
- Para compilar, ejecuta npm run build.

Documentación oficial: https://developers.giphy.com/docs/api/endpoint/#search
