export interface Cancion {
  titulo: string;
  escuchas: number;
}

export function clave(titulo: string): string {
  return titulo.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

class NodoTrie {
  hijos = new Map<string, NodoTrie>();
  cancion?: Cancion;
}

export class Trie {
  private raiz = new NodoTrie();

  insertar(cancion: Cancion): void {
    let nodo = this.raiz;
    for (const letra of clave(cancion.titulo)) {
      let hijo = nodo.hijos.get(letra);
      if (!hijo) {
        hijo = new NodoTrie();
        nodo.hijos.set(letra, hijo);
      }
      nodo = hijo;
    }
    nodo.cancion = cancion;
  }

  private recorrer(texto: string): NodoTrie | undefined {
    let nodo = this.raiz;
    for (const letra of clave(texto)) {
      const hijo = nodo.hijos.get(letra);
      if (!hijo) return undefined;
      nodo = hijo;
    }
    return nodo;
  }

  buscar(titulo: string): Cancion | undefined {
    return this.recorrer(titulo)?.cancion;
  }

  sugerir(prefijo: string): Cancion[] {
    const inicio = this.recorrer(prefijo);
    if (!inicio) return [];
    const pendientes = [inicio];
    const resultados: Cancion[] = [];
    while (pendientes.length) {
      const nodo = pendientes.pop()!;
      if (nodo.cancion) resultados.push(nodo.cancion);
      for (const hijo of nodo.hijos.values()) pendientes.push(hijo);
    }
    return resultados.sort((a,b) => a.titulo.localeCompare(b.titulo,'es'));
  }
}

function supera(a: Cancion, b: Cancion): boolean {
  if (a.escuchas !== b.escuchas) return a.escuchas > b.escuchas;
  return a.titulo.localeCompare(b.titulo,'es') < 0;
}

export class MaxHeap {
  private datos: Cancion[] = [];

  insertar(cancion: Cancion): void {
    let i = this.datos.length;
    this.datos.push(cancion);
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (!supera(cancion, this.datos[padre])) break;
      this.datos[i] = this.datos[padre];
      i = padre;
    }
    this.datos[i] = cancion;
  }

  private extraerMaximo(): Cancion {
    const a = this.datos;
    const primero = a[0];
    const ultimo = a.pop()!;
    if (!a.length) return primero;
    let i = 0;
    while (2*i + 1 < a.length) {
      let hijo = 2*i + 1;
      if (hijo + 1 < a.length && supera(a[hijo+1], a[hijo])) hijo++;
      if (!supera(a[hijo], ultimo)) break;
      a[i] = a[hijo];
      i = hijo;
    }
    a[i] = ultimo;
    return primero;
  }

  top(k: number): Cancion[] {
    const copia = new MaxHeap();
    copia.datos = this.datos.slice();
    const ranking: Cancion[] = [];
    while (copia.datos.length && ranking.length < k) ranking.push(copia.extraerMaximo());
    return ranking;
  }
}

export class Grafo {
  private adyacencia = new Map<string, Set<string>>();

  agregarVertice(titulo: string): void {
    if (!this.adyacencia.has(titulo)) this.adyacencia.set(titulo, new Set());
  }

  conectar(a: string, b: string): boolean {
    const vecinosA = this.adyacencia.get(a);
    const vecinosB = this.adyacencia.get(b);
    if (!vecinosA || !vecinosB || a === b || vecinosA.has(b)) return false;
    vecinosA.add(b);
    vecinosB.add(a);
    return true;
  }

  relacionadas(titulo: string): string[] {
    return [...(this.adyacencia.get(titulo) ?? [])];
  }
}
