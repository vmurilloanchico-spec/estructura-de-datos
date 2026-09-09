export class NodoMedico {
  nombre: string;
  siguiente: NodoMedico | null;

  constructor(nombre: string) {
    this.nombre = nombre;
    this.siguiente = null;
  }
}