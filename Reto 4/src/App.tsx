import { useState, type FormEvent } from 'react';

type Libro = {
  id: number;
  nombre: string;
  isbn: string;
  autor: string;
  editorial: string;
};

const librosIniciales: Libro[] = [
  { id: 1, nombre: 'Cien años de soledad', isbn: '978-0307474728', autor: 'Gabriel García Márquez', editorial: 'Vintage' },
  { id: 2, nombre: 'El principito', isbn: '978-0156012195', autor: 'Antoine de Saint-Exupéry', editorial: 'Salamandra' },
  { id: 3, nombre: 'La casa de los espíritus', isbn: '978-0525433477', autor: 'Isabel Allende', editorial: 'Plaza & Janés' },
];

export default function App() {
  const [libros, setLibros] = useState(librosIniciales);
  const [nombre, setNombre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [autor, setAutor] = useState('');
  const [editorial, setEditorial] = useState('');

  function agregarLibro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const libroNuevo = {
      id: Date.now(),
      nombre,
      isbn,
      autor,
      editorial,
    };

    // Agrega el libro al final de la pila (push).
    setLibros([...libros, libroNuevo]);
    setNombre('');
    setIsbn('');
    setAutor('');
    setEditorial('');
  }

  function quitarLibro() {
    if (libros.length > 0) {
      // El último libro agregado es el primero que sale (pop).
      setLibros(libros.slice(0, -1));
    }
  }

  return (
    <main className="contenedor">
      <header>
        <h1>Reto 4: Pila de libros</h1>
        <p>Agrega libros a la pila. El último libro agregado aparece arriba.</p>
      </header>

      <section className="panel">
        <h2>Agregar un libro</h2>
        <form onSubmit={agregarLibro}>
          <label htmlFor="nombre">Nombre del libro</label>
          <input id="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required />

          <label htmlFor="isbn">ISBN</label>
          <input id="isbn" value={isbn} onChange={(event) => setIsbn(event.target.value)} required />

          <label htmlFor="autor">Autor</label>
          <input id="autor" value={autor} onChange={(event) => setAutor(event.target.value)} required />

          <label htmlFor="editorial">Editorial</label>
          <input id="editorial" value={editorial} onChange={(event) => setEditorial(event.target.value)} required />

          <button type="submit">Agregar a la pila</button>
        </form>
      </section>

      <section className="panel">
        <div className="titulo-lista">
          <h2>Pila de libros</h2>
          <button type="button" onClick={quitarLibro} disabled={libros.length === 0}>Quitar el último</button>
        </div>

        <p className="contador">Cantidad de libros: {libros.length}</p>
        {libros.length === 0 ? (
          <p>La pila está vacía.</p>
        ) : (
          <ol className="lista-libros">
            {[...libros].reverse().map((libro, indice) => (
              <li key={libro.id}>
                <strong>{libro.nombre}</strong>
                {indice === 0 && <span className="etiqueta">CIMA</span>}
                <p>ISBN: {libro.isbn}</p>
                <p>Autor: {libro.autor}</p>
                <p>Editorial: {libro.editorial}</p>
              </li>
            ))}
          </ol>
        )}

        <button className="boton-imprimir" type="button" onClick={() => window.print()}>
          Imprimir pila
        </button>
      </section>
    </main>
  );
}
