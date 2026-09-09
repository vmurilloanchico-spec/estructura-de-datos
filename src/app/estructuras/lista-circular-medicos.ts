import { NodoMedico } from './nodo-medico';

export class ListaCircularMedicos {
  private actual: NodoMedico | null = null;
  private cantidad = 0;

  agregar(nombre: string): void {
    const nuevoNodo = new NodoMedico(nombre);

    if (this.actual === null) {
      nuevoNodo.siguiente = nuevoNodo;
      this.actual = nuevoNodo;
      this.cantidad = 1;
      return;
    }

    let ultimo = this.actual;
    for (let indice = 0; indice < this.cantidad - 1; indice++) {
      ultimo = ultimo.siguiente!;
    }

    nuevoNodo.siguiente = this.actual;
    ultimo.siguiente = nuevoNodo;
    this.cantidad++;
  }

  rotar(): void {
    if (this.actual !== null) {
      this.actual = this.actual.siguiente;
    }
  }

  obtenerActual(): string | null {
    return this.actual?.nombre ?? null;
  }

  listar(): string[] {
    const medicos: string[] = [];

    if (this.actual === null) {
      return medicos;
    }

    let nodo = this.actual;
    do {
      medicos.push(nodo.nombre);
      nodo = nodo.siguiente!;
    } while (nodo !== this.actual);

    return medicos;
  }
}