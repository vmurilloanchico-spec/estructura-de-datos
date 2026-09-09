export class NodoComite {
  nombre: string;
  anterior: NodoComite | null = null;
  siguiente: NodoComite | null = null;

  constructor(nombre: string) {
    this.nombre = nombre;
  }
}