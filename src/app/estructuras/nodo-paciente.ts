import { Paciente } from '../modelos/paciente';

export class NodoPaciente {
  paciente: Paciente;
  siguiente: NodoPaciente | null;

  constructor(paciente: Paciente) {
    this.paciente = paciente;
    this.siguiente = null;
  }
}