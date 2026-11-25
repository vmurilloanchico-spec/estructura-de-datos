# Challenge 11 · Atlas de amistades

Aplicación Angular 20 con una visualización interactiva de personas, ciudades y amistades. Los formularios, las validaciones, los datos y el filtro de habitantes están en Angular. El componente NetworkGraph monta react-d3-graph para dibujar el grafo que pide la consigna.

## Ejecutar en Windows

1. Extrae el ZIP en una carpeta nueva llamada Challenge-11. Abre esa carpeta en VS Code. Los archivos angular.json y package.json deben aparecer juntos.
2. Usa Node.js 22.12 o superior de la rama 22, o Node.js 24. Abre Terminal → Nueva terminal.
3. Ejecuta npm ci. Cuando termine, ejecuta npm start.
4. Abre http://localhost:4200 o la dirección que muestre Angular en la terminal.

Los datos de ejemplo ya están cargados. Los cambios se guardan en el navegador para esa dirección. Para generar la versión de producción ejecuta npm run build.

## Prueba para la entrega

1. Selecciona Cali en Habitantes por ciudad. Deben aparecer Ana (21) y Mateo (24).
2. Agrega Palmira en Nueva ciudad. Aparece como un rombo y la lista de habitantes está vacía.
3. Agrega a Valeri, de 21 años, con Palmira como residencia. Aparece un círculo conectado a Palmira y la consulta de esa ciudad muestra a Valeri.
4. En Nueva amistad selecciona a Valeri y Ana. Verás una línea de amistad entre ellas. La residencia de cada una permanece en su ciudad.
5. Intenta crear esa amistad en el orden inverso. El sistema indica que ya existe.
6. Selecciona Palmira y pulsa Imprimir lista. La vista de impresión muestra la ciudad y sus habitantes. Puedes elegir Guardar como PDF en el navegador.
7. Recarga la página y selecciona Palmira otra vez. La persona y la amistad siguen guardadas.

## Para explicar el código

- src/model.ts define City, Person, Friendship y los datos iniciales. Cada persona guarda un solo cityId, que identifica su ciudad.
- src/main.ts y src/app.html controlan los formularios y la consulta. La lista se obtiene filtrando las personas con el cityId seleccionado.
- src/network-graph.ts convierte cada persona y ciudad en un nodo. Genera una conexión por residencia y otra por cada amistad entre dos personas. Los identificadores permiten tener personas con el mismo nombre.
