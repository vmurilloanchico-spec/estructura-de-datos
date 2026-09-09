import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaPacientes } from './estructuras/lista-pacientes';
import { Paciente } from './modelos/paciente';
import { HistorialAtencion } from './estructuras/historial-atencion';
import { ListaCircularMedicos } from './estructuras/lista-circular-medicos';
import { ListaCircularComite } from './estructuras/lista-circular-comite';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {

  listaPacientes = new ListaPacientes();

  pacientes: Paciente[] = [];

  historial = new HistorialAtencion();

  pacientesAtendidos: Paciente[] = [];
  medicos = new ListaCircularMedicos();
  comite = new ListaCircularComite();
  medicosEnGuardia: string[] = [];
  miembrosComite: string[] = [];
  medicoActual: string | null = null;
  miembroComiteActual: string | null = null;
  segundosParaRotacion = 10;
  nuevoPaciente: Paciente = this.crearPacienteVacio();
  private temporizador: ReturnType<typeof setInterval>;

  constructor() {

    this.listaPacientes.agregar({
      id: 1,
      nombre: 'Ana',
      edad: 25,
      motivoConsulta: 'Dolor de cabeza'
    });

    this.listaPacientes.agregar({
      id: 2,
      nombre: 'Carlos',
      edad: 40,
      motivoConsulta: 'Dolor de espalda'
    });

    this.listaPacientes.agregar({
      id: 3,
      nombre: 'María',
      edad: 32,
      motivoConsulta: 'Fiebre'
    });

    ['Dra. Laura Méndez', 'Dr. Diego Silva', 'Dra. Paula Ríos'].forEach((medico) => {
      this.medicos.agregar(medico);
    });
    ['Administración', 'Enfermería', 'Dirección médica'].forEach((miembro) => {
      this.comite.agregar(miembro);
    });

    this.pacientes = this.listaPacientes.listar();
    this.actualizarVista();
    this.temporizador = setInterval(() => this.actualizarRotacion(), 1000);
  }

  atenderPaciente(): void {
    const pacienteAtendido = this.listaPacientes.atender();

    if (pacienteAtendido !== null) {
      this.historial.agregar(pacienteAtendido);

      this.actualizarVista();
    }
  }

  agregarPaciente(): void {
    if (!this.nuevoPaciente.nombre.trim() || !this.nuevoPaciente.motivoConsulta.trim()) {
      return;
    }

    this.listaPacientes.agregar({ ...this.nuevoPaciente, nombre: this.nuevoPaciente.nombre.trim() });
    this.nuevoPaciente = this.crearPacienteVacio();
    this.actualizarVista();
  }

  moverComiteSiguiente(): void {
    this.comite.moverSiguiente();
    this.actualizarComite();
  }

  moverComiteAnterior(): void {
    this.comite.moverAnterior();
    this.actualizarComite();
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  private actualizarRotacion(): void {
    this.segundosParaRotacion--;
    if (this.segundosParaRotacion === 0) {
      this.medicos.rotar();
      this.medicoActual = this.medicos.obtenerActual();
      this.segundosParaRotacion = 10;
    }
  }

  private actualizarVista(): void {
    this.pacientes = this.listaPacientes.listar();
    this.pacientesAtendidos = this.historial.listar();
    this.medicosEnGuardia = this.medicos.listar();
    this.medicoActual = this.medicos.obtenerActual();
    this.actualizarComite();
  }

  private actualizarComite(): void {
    this.miembrosComite = this.comite.listar();
    this.miembroComiteActual = this.comite.obtenerActual();
  }

  private crearPacienteVacio(): Paciente {
    return { id: Date.now(), nombre: '', edad: 0, motivoConsulta: '' };
  }
}