import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, BookOpen, BookPlus, Check, Layers3, RotateCcw, Trash2 } from 'lucide-react';

type Book = { id: number; name: string; isbn: string; author: string; editorial: string };
const initialBooks: Book[] = [
  { id: 1, name: 'Cien años de soledad', isbn: '978-0307474728', author: 'Gabriel García Márquez', editorial: 'Vintage Español' },
  { id: 2, name: 'El amor en los tiempos del cólera', isbn: '978-0307389732', author: 'Gabriel García Márquez', editorial: 'Vintage Español' },
  { id: 3, name: 'La casa de los espíritus', isbn: '978-0525433477', author: 'Isabel Allende', editorial: 'Vintage' },
  { id: 4, name: 'Ficciones', isbn: '978-0802130303', author: 'Jorge Luis Borges', editorial: 'Grove Press' },
];
const emptyBook = { name: '', isbn: '', author: '', editorial: '' };

export default function App() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [form, setForm] = useState(emptyBook);
  const [notice, setNotice] = useState('');
  const topBook = books.at(-1);

  function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBooks((stack) => [...stack, { ...form, id: Date.now() }]);
    setForm(emptyBook);
    setNotice('Libro agregado a la cima de la pila.');
    window.setTimeout(() => setNotice(''), 2600);
  }

  function removeTop() {
    if (!books.length) return;
    setBooks((stack) => stack.slice(0, -1));
    setNotice('Se retiró el libro de la cima.');
    window.setTimeout(() => setNotice(''), 2600);
  }

  return <main className="page-shell">
    <header className="topbar"><a className="brand" href="#inicio"><span className="brand-icon"><BookOpen size={18}/></span> archivo<span className="brand-dot">.</span></a><span className="top-note"><span className="live-dot"/> ESTRUCTURAS DE DATOS <span className="top-separator">/</span> PILAS</span><span className="edition">BIBLIOTECA PERSONAL <span>№ 04</span></span></header>

    <section className="intro" id="inicio"><div className="intro-copy"><p className="overline"><span>01</span> &nbsp; COLECCIÓN · PILA LIFO</p><h1>Libros que<br/><em>dejan huella.</em></h1><p className="intro-text">Una pila personal para tus próximas lecturas. Cada libro nuevo encuentra su lugar en la cima.</p><a className="text-link" href="#agregar">AÑADIR A LA COLECCIÓN <ArrowDown size={14}/></a></div>
      <div className="hero-art" aria-hidden="true"><div className="sun-disc"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="book-silhouette book-a"><i/><i/><i/></div><div className="book-silhouette book-b"><i/><i/><i/></div><div className="hero-label"><span>LECTURAS EN ROTACIÓN</span><b>Una historia<br/>a la vez.</b><span className="hero-label-line"/></div><span className="art-coord">04° · LIFO</span></div></section>

    <section className="collection" aria-labelledby="collection-title"><div className="section-heading"><div><p className="overline"><span>02</span> &nbsp; TU ESPACIO DE LECTURA</p><h2 id="collection-title">La colección <span>actual</span></h2></div><div className="stack-count"><Layers3 size={16}/><span><b>{String(books.length).padStart(2, '0')}</b> {books.length === 1 ? 'LIBRO' : 'LIBROS'}</span></div></div>
      <div className="collection-grid"><section className="stack-panel" aria-label="Libros en la pila"><div className="panel-top"><span><span className="live-dot"/> PILA DE LIBROS</span><span>TOPE ↑</span></div>{topBook ? <div className="stack-content"><div className="book-stack" aria-label={`${books.length} libros apilados`}>{books.slice(-4).reverse().map((book, index) => <div className={`stack-book stack-book-${index}`} key={book.id}><span className="stack-book-title">{book.name}</span><span className="stack-book-author">{book.author}</span><span className="stack-book-number">{String(books.length - index).padStart(2, '0')}</span></div>)}<div className="stack-base"/></div><div className="top-details"><span className="top-tag"><ArrowUp size={12}/> ÚLTIMO EN ENTRAR</span><h3>{topBook.name}</h3><p>{topBook.author} <span>·</span> {topBook.editorial}</p><div className="isbn">ISBN <code>{topBook.isbn}</code></div></div></div> : <div className="empty-stack"><BookOpen size={30}/><p>Tu pila está vacía.</p><span>Agrega un libro para empezar una nueva historia.</span></div>}<div className="panel-bottom"><span>LIFO</span><span>LAST IN, FIRST OUT</span><span>{books.length ? '● ACTIVA' : '○ VACÍA'}</span></div></section>

      <section className="form-panel" id="agregar"><div className="form-heading"><div className="form-icon"><BookPlus size={18}/></div><div><p className="overline"><span>03</span> &nbsp; NUEVA INCORPORACIÓN</p><h3>Agregar un libro</h3></div></div><p className="form-subtitle">Completa los datos para sumar una lectura a la cima.</p><form onSubmit={addBook}><label htmlFor="book-name">TÍTULO DEL LIBRO</label><input id="book-name" placeholder="Ej. El principito" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required/><div className="form-row"><div><label htmlFor="book-author">AUTOR</label><input id="book-author" placeholder="Antoine de Saint-Exupéry" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required/></div><div><label htmlFor="book-isbn">ISBN</label><input id="book-isbn" placeholder="978-..." value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required/></div></div><label htmlFor="book-editorial">EDITORIAL</label><input id="book-editorial" placeholder="Ej. Salamandra" value={form.editorial} onChange={(e) => setForm({ ...form, editorial: e.target.value })} required/><button className="submit-button" type="submit">AGREGAR A LA PILA <BookPlus size={16}/></button></form><div className="form-foot"><span><Check size={13}/> LOS CAMPOS SON OBLIGATORIOS</span><span>+ PUSH()</span></div></section></div>
    </section>

    <section className="inventory" aria-labelledby="inventory-title"><div className="inventory-head"><div><p className="overline"><span>04</span> &nbsp; INVENTARIO</p><h2 id="inventory-title">Dentro de la pila</h2></div><button className="print-button" onClick={() => window.print()}><span>IMPRIMIR LISTA</span><BookOpen size={15}/></button></div><div className="table-wrap"><table><thead><tr><th>POS.</th><th>TÍTULO</th><th>AUTOR</th><th>ISBN</th><th>EDITORIAL</th><th></th></tr></thead><tbody>{[...books].reverse().map((book, index) => <tr key={book.id} className={index === 0 ? 'is-top' : ''}><td><span className="position">{String(books.length - index).padStart(2, '0')}</span>{index === 0 && <span className="top-indicator">CIMA</span>}</td><td className="book-name-cell">{book.name}</td><td>{book.author}</td><td><code>{book.isbn}</code></td><td>{book.editorial}</td><td>{index === 0 && <button className="remove-button" onClick={removeTop} aria-label="Retirar libro de la cima" title="Retirar de la cima"><Trash2 size={15}/></button>}</td></tr>)}</tbody></table>{books.length === 0 && <p className="table-empty">Aún no hay libros. Añade uno con el formulario de arriba.</p>}</div><p className="inventory-note"><RotateCcw size={13}/> La pila sigue el principio LIFO: el último libro agregado es el primero que sale.</p></section>

    <footer><span>ARCHIVO<span className="brand-dot">.</span> <span className="footer-muted">COLECCIÓN PERSONAL</span></span><span>HECHO PARA LOS QUE SIEMPRE LEEN UNA PÁGINA MÁS.</span><span>2025 — 2026</span></footer>
    <div className={`toast ${notice ? 'toast-visible' : ''}`} role="status">{notice}</div>
  </main>;
}
