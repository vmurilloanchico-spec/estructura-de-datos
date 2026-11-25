# Frecuencia · Parcial 3 en Angular

Panel de música educativa construido en Angular y TypeScript con estilos Sass. Incluye seis canciones ficticias con escuchas de ejemplo. Los cambios viven en memoria y al recargar se restablece el catálogo inicial.

## Ejecutar

Usa Node.js 22.12 o posterior de la rama 22, o Node.js 24. En Windows extrae todo el ZIP y abre en VS Code la carpeta donde aparezcan angular.json y package.json. En Terminal → Nueva terminal escribe:

```powershell
npm ci --include=dev
npm start
```

Abre http://localhost:4214 o la dirección Local que indique la terminal. Para compilar ejecuta npm run build. Funciona sin cuentas, API keys ni bases de datos.

## Prueba guiada

1. En el buscador escribe rit. Aparecen Ritmo lunar y Ritmo solar. Pulsa Comprobar título exacto: rit es un prefijo y la respuesta es negativa. Pulsa la sugerencia Ritmo solar y se confirma que existe.
2. En Agregar canción escribe Ritmo del mar con 1500 escuchas. Se agrega al Trie, al Max Heap y al grafo. Ocupa el primer lugar, seguida por Ritmo solar (1280) y Órbita azul (1140). Repite la búsqueda rit y verás tres sugerencias.
3. Selecciona Top 5 y luego Top 3. Los primeros lugares se conservan. Si agregas una canción que empata en escuchas, los nombres se desempatan alfabéticamente.
4. Conecta Ritmo del mar con Ritmo lunar. Consulta la primera y verás la segunda. Consulta la segunda y también encontrarás la primera. Una canción nueva puede tener cero recomendaciones hasta que la conectes.
5. Intenta insertar un título repetido o conectar la misma pareja en orden inverso. El sistema conserva una sola canción y una sola relación por pareja.

## Para la sustentación

| Requisito | Dónde verlo | Cómo funciona |
| --- | --- | --- |
| Trie | src/estructuras.ts, clase Trie | Cada letra corresponde a un paso del árbol. El nodo final guarda la canción. Buscar comprueba el título completo y sugerir recorre los descendientes del prefijo. |
| Max Heap | src/estructuras.ts, clase MaxHeap | Un arreglo representa un árbol binario. Cada padre tiene prioridad sobre sus hijos. Al insertar, la canción sube hasta su posición. Para el Top se copia el arreglo y se extrae la raíz repetidamente. |
| Grafo no dirigido | src/estructuras.ts, clase Grafo | Cada canción es un vértice. Un mapa guarda los vecinos de cada título en un conjunto. Conectar A y B agrega B a los vecinos de A y A a los de B. Las recomendaciones son vecinos directos. |
| Sass | src/_tema.scss y src/styles.scss | Variables compartidas definen colores. Los mixins tarjeta y control reutilizan estilos. El archivo principal importa el tema con @use. |
| Interfaz Angular | src/main.ts y src/app.html | El componente maneja los formularios, consulta las estructuras y actualiza el panel. |

Los títulos se identifican por su texto normalizado. La búsqueda admite mayúsculas y acentos. El ranking usa el número de escuchas registrado para cada canción. El enunciado se representa con un catálogo de ejemplo y relaciones elegidas desde el panel.
