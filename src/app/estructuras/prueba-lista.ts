import { ListaPacientes } from './lista-pacientes';

const lista = new ListaPacientes();

console.log('¿Está vacía?', lista.estaVacia());

lista.agregar({
  id: 1,
  nombre: 'Ana',
  edad: 25,
  motivoConsulta: 'Dolor de cabeza'
});

lista.agregar({
  id: 2,
  nombre: 'Carlos',
  edad: 40,
  motivoConsulta: 'Dolor de espalda'
});

lista.agregar({
  id: 3,
  nombre: 'María',
  edad: 32,
  motivoConsulta: 'Fiebre'
});

console.log('Pacientes en espera:', lista.listar());

const pacienteAtendido = lista.atender();

console.log('Paciente atendido:', pacienteAtendido);

console.log('Pacientes restantes:', lista.listar());