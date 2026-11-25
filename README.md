# Challenge 12 · Buscador de productos en Angular

## Abrir en Windows

Extrae el ZIP y abre en VS Code la carpeta donde se encuentran angular.json y package.json. Usa Node.js 22.12 o posterior de la rama 22, o Node.js 24. En Terminal → Nueva terminal ejecuta:

```powershell
npm ci --include=dev
npm start
```

Abre http://localhost:4200 o la dirección Local que aparezca. Si ya estás usando el puerto 4200 para el Challenge 11, puedes iniciar este con `npm start -- --port 4201` y abrir http://localhost:4201.

## Prueba del enunciado

El catálogo inicial tiene air max (90), air force (95), air jordan (85) y adidas boost (80). Cada registro guarda name y popularity. Se usa 90 para air max porque es el valor de la inserción y del resultado esperado en la diapositiva.

| Prefijo | K | Resultado, de mayor a menor popularidad |
| --- | --- | --- |
| air | 2 | air force 95, air max 90 |
| AIR | 3 | air force 95, air max 90, air jordan 85 |
| ad | 2 | adidas boost 80 |
| max | 2 | Sin coincidencias |
| vacío | 1 | air force 95 |

Agrega air zoom con popularidad 98 y vuelve a buscar air con K = 2. El nuevo resultado es air zoom (98) y air force (95). Guarda otra vez air zoom con 70 y verifica que vuelve a salir el par original y que el contador se mantiene en cinco. Al recargar se restablecen los cuatro productos del ejemplo.

## Cómo sustentarlo

El Trie es un árbol de prefijos. Al insertar air max y air force comparten el camino a → i → r. El producto completo queda guardado en el nodo donde termina su nombre. Para buscar, primero se recorre el prefijo y después se visitan únicamente los nodos que cuelgan de él.

El min-heap mantiene como máximo K productos. La raíz contiene el peor de los seleccionados. Cuando llega un candidato mejor y ya hay K elementos, reemplaza esa raíz. Al final se extraen los productos y se invierte su orden para mostrarlos de mayor a menor popularidad. En un empate se favorece el nombre que aparece primero alfabéticamente.

El código de ambas estructuras y de searchTopK está en src/search.ts. Los formularios y la conexión con Angular están en src/main.ts y src/app.html.
