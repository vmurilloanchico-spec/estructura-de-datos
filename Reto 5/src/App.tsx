import { useState, type FormEvent } from 'react';

type Persona = {
  id: number;
  nombre: string;
  monto: number;
  fechaLlegada: string;
};

const personasIniciales: Persona[] = [
  { id: 1, nombre: 'Ana López', monto: 80000, fechaLlegada: '2026-10-06T09:00:00' },
  { id: 2, nombre: 'Carlos Pérez', monto: 150000, fechaLlegada: '2026-10-06T09:10:00' },
  { id: 3, nombre: 'María Gómez', monto: 50000, fechaLlegada: '2026-10-06T09:20:00' },
];

function mostrarFecha(fecha: string) {
  return new Date(fecha).toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function App() {
  const [personas, setPersonas] = useState(personasIniciales);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');

  function agregarPersona(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const personaNueva: Persona = {
      id: Date.now(),
      nombre,
      monto: Number(monto),
      fechaLlegada: new Date().toISOString(),
    };

    setPersonas([...personas, personaNueva]);
    setNombre('');
    setMonto('');
  }

  function atenderPersona() {
    // En una cola se atiende primero a la persona que llegó antes.
    const filaOrdenada = [...personas].sort(
      (a, b) => new Date(a.fechaLlegada).getTime() - new Date(b.fechaLlegada).getTime(),
    );
    setPersonas(filaOrdenada.slice(1));
  }

  const filaOrdenada = [...personas].sort(
    (a, b) => new Date(a.fechaLlegada).getTime() - new Date(b.fechaLlegada).getTime(),
  );

  return (
    <main className="contenedor">
      <header>
        <h1>Reto 5: Fila del cajero</h1>
        <p>Registra a las personas que llegan al cajero. Se atienden en orden de llegada.</p>
      </header>

      <section className="panel">
        <h2>Agregar persona a la fila</h2>
        <form onSubmit={agregarPersona}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Escribe el nombre"
            required
          />

          <label htmlFor="monto">Monto que desea retirar</label>
          <input
            id="monto"
            type="number"
            min="1"
            value={monto}
            onChange={(event) => setMonto(event.target.value)}
            placeholder="Ej. 50000"
            required
          />

          <button type="submit">Agregar a la fila</button>
        </form>
        <p className="nota">La fecha y hora de llegada se asignan automáticamente.</p>
      </section>

      <section className="panel">
        <div className="titulo-fila">
          <div>
            <h2>Fila actual</h2>
            <p>Personas en espera: {filaOrdenada.length}</p>
          </div>
          <button type="button" onClick={atenderPersona} disabled={filaOrdenada.length === 0}>
            Atender siguiente
          </button>
        </div>

        {filaOrdenada.length === 0 ? (
          <p>La fila está vacía.</p>
        ) : (
          <ol className="lista-personas">
            {filaOrdenada.map((persona) => (
              <li key={persona.id}>
                <strong>{persona.nombre}</strong>
                <p>Monto a retirar: ${persona.monto.toLocaleString('es-CO')}</p>
                <p>Hora de llegada: {mostrarFecha(persona.fechaLlegada)}</p>
              </li>
            ))}
          </ol>
        )}

        <button className="boton-imprimir" type="button" onClick={() => window.print()}>
          Imprimir fila
        </button>
      </section>
    </main>
  );
}
