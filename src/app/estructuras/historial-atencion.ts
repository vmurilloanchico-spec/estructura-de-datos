import { Paciente } from '../modelos/paciente';
import { NodoHistorial } from './nodo-historial';

export class HistorialAtencion {
  private cabeza: NodoHistorial | null;
  private cola: NodoHistorial | null;

  constructor() {
    this.cabeza = null;
    this.cola = null;
  }

  agregar(paciente: Paciente): void {
    const nuevoNodo = new NodoHistorial(paciente);

    if (this.cabeza === null) {
      this.cabeza = nuevoNodo;
      this.cola = nuevoNodo;
      return;
    }

    nuevoNodo.anterior = this.cola;
    this.cola!.siguiente = nuevoNodo;
    this.cola = nuevoNodo;
  }

  listar(): Paciente[] {
    const pacientes: Paciente[] = [];
    let actual = this.cabeza;

    while (actual !== null) {
      pacientes.push(actual.paciente);
      actual = actual.siguiente;
    }

    return pacientes;
  }
}