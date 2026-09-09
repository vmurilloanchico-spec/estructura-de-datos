import { Paciente } from '../modelos/paciente';
import { NodoPaciente } from './nodo-paciente';

export class ListaPacientes {
  private cabeza: NodoPaciente | null;

  constructor() {
    this.cabeza = null;
  }

  estaVacia(): boolean {
    return this.cabeza === null;
  }

  agregar(paciente: Paciente): void {
    const nuevoNodo = new NodoPaciente(paciente);

    if (this.cabeza === null) {
      this.cabeza = nuevoNodo;
      return;
    }

    let actual = this.cabeza;

    while (actual.siguiente !== null) {
      actual = actual.siguiente;
    }

    actual.siguiente = nuevoNodo;
  }

  atender(): Paciente | null {
    if (this.cabeza === null) {
      return null;
    }

    const pacienteAtendido = this.cabeza.paciente;
    this.cabeza = this.cabeza.siguiente;

    return pacienteAtendido;
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