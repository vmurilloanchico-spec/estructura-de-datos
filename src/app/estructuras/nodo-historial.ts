import { Paciente } from '../modelos/paciente';

export class NodoHistorial {
  paciente: Paciente;
  anterior: NodoHistorial | null;
  siguiente: NodoHistorial | null;

  constructor(paciente: Paciente) {
    this.paciente = paciente;
    this.anterior = null;
    this.siguiente = null;
  }
}
