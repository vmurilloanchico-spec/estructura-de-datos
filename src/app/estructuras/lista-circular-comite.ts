import { NodoComite } from './nodo-comite';

export class ListaCircularComite {
  private actual: NodoComite | null = null;

  agregar(nombre: string): void {
    const nuevoNodo = new NodoComite(nombre);

    if (this.actual === null) {
      nuevoNodo.anterior = nuevoNodo;
      nuevoNodo.siguiente = nuevoNodo;
      this.actual = nuevoNodo;
      return;
    }

    const siguiente = this.actual.siguiente!;
    nuevoNodo.anterior = this.actual;
    nuevoNodo.siguiente = siguiente;
    this.actual.siguiente = nuevoNodo;
    siguiente.anterior = nuevoNodo;
  }

  moverSiguiente(): void {
    this.actual = this.actual?.siguiente ?? null;
  }

  moverAnterior(): void {
    this.actual = this.actual?.anterior ?? null;
  }

  obtenerActual(): string | null {
    return this.actual?.nombre ?? null;
  }

  listar(): string[] {
    const miembros: string[] = [];

    if (this.actual === null) {
      return miembros;
    }

    let nodo = this.actual;
    do {
      miembros.push(nodo.nombre);
      nodo = nodo.siguiente!;
    } while (nodo !== this.actual);

    return miembros;
  }
}