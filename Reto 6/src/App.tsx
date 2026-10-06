import { useEffect, useRef, useState, type FormEvent } from 'react';
import * as d3 from 'd3';

type Nodo = {
  valor: number;
  izquierda: Nodo | null;
  derecha: Nodo | null;
};

type DatoArbol = {
  valor: number;
  hijos?: DatoArbol[];
};

function insertar(raiz: Nodo | null, valor: number): Nodo {
  if (raiz === null) {
    return { valor, izquierda: null, derecha: null };
  }

  if (valor < raiz.valor) {
    return { ...raiz, izquierda: insertar(raiz.izquierda, valor) };
  }

  if (valor > raiz.valor) {
    return { ...raiz, derecha: insertar(raiz.derecha, valor) };
  }

  return raiz;
}

function convertirArbol(nodo: Nodo): DatoArbol {
  const hijos: DatoArbol[] = [];
  if (nodo.izquierda) hijos.push(convertirArbol(nodo.izquierda));
  if (nodo.derecha) hijos.push(convertirArbol(nodo.derecha));
  return { valor: nodo.valor, hijos };
}

function inorden(nodo: Nodo | null): number[] {
  if (!nodo) return [];
  return [...inorden(nodo.izquierda), nodo.valor, ...inorden(nodo.derecha)];
}

function postorden(nodo: Nodo | null): number[] {
  if (!nodo) return [];
  return [...postorden(nodo.izquierda), ...postorden(nodo.derecha), nodo.valor];
}

function preorden(nodo: Nodo | null): number[] {
  if (!nodo) return [];
  return [nodo.valor, ...preorden(nodo.izquierda), ...preorden(nodo.derecha)];
}

function buscar(nodo: Nodo | null, valor: number): boolean {
  if (!nodo) return false;
  if (nodo.valor === valor) return true;
  return valor < nodo.valor ? buscar(nodo.izquierda, valor) : buscar(nodo.derecha, valor);
}

function ArbolVisual({ raiz }: { raiz: Nodo | null }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    if (!raiz) return;

    const ancho = 760;
    const alto = 410;
    const arbol = d3.hierarchy(convertirArbol(raiz), (dato) => dato.hijos);
    const puntos = d3.tree<DatoArbol>().size([ancho - 60, alto - 90])(arbol);
    const grupo = svg.attr('viewBox', `0 0 ${ancho} ${alto}`).append('g').attr('transform', 'translate(30, 35)');

    grupo
      .selectAll('path')
      .data(puntos.links())
      .enter()
      .append('path')
      .attr('d', (enlace) => {
        const inicioX = enlace.source.x;
        const inicioY = enlace.source.y + 20;
        const finX = enlace.target.x;
        const finY = enlace.target.y - 20;
        const mitadY = (inicioY + finY) / 2;
        return `M ${inicioX} ${inicioY} C ${inicioX} ${mitadY}, ${finX} ${mitadY}, ${finX} ${finY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#777')
      .attr('stroke-width', 2);

    const nodos = grupo
      .selectAll('g')
      .data(puntos.descendants())
      .enter()
      .append('g')
      .attr('transform', (nodo) => `translate(${nodo.x}, ${nodo.y})`);

    nodos.append('circle').attr('r', 20).attr('fill', '#dcecf2').attr('stroke', '#286b86').attr('stroke-width', 2);
    nodos
      .append('text')
      .text((nodo) => nodo.data.valor)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '14px');
  }, [raiz]);

  return <svg className="arbol-visual" ref={svgRef} role="img" aria-label="Visualización del árbol binario" />;
}

export default function App() {
  const [raiz, setRaiz] = useState<Nodo | null>(null);
  const [serie, setSerie] = useState('8, 3, 10, 1, 6, 14, 4, 7, 13');
  const [valorBuscar, setValorBuscar] = useState('');
  const [resultado, setResultado] = useState('');

  function crearArbol(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numeros = serie.split(/[\s,]+/).filter(Boolean).map(Number);

    if (numeros.some((numero) => !Number.isFinite(numero))) {
      setResultado('Escribe solamente números separados por comas.');
      return;
    }

    let nuevoArbol: Nodo | null = null;
    numeros.forEach((numero) => {
      nuevoArbol = insertar(nuevoArbol, numero);
    });
    setRaiz(nuevoArbol);

    console.log('Inorden:', inorden(nuevoArbol));
    console.log('Postorden:', postorden(nuevoArbol));
    console.log('Preorden:', preorden(nuevoArbol));
    setResultado('Se creó el árbol. Los recorridos están en la consola.');
  }

  function revisarNumero(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numero = Number(valorBuscar);
    if (!valorBuscar.trim() || !Number.isFinite(numero)) {
      setResultado('Escribe un número para buscar.');
      return;
    }
    setResultado(buscar(raiz, numero) ? `El número ${numero} sí está en el árbol.` : `El número ${numero} no está en el árbol.`);
  }

  return (
    <main className="contenedor">
      <h1>Reto 6: Árbol binario</h1>

      <section className="panel">
        <h2>Crear árbol</h2>
        <form onSubmit={crearArbol}>
          <label htmlFor="serie">Escribe números separados por comas</label>
          <input id="serie" value={serie} onChange={(event) => setSerie(event.target.value)} required />
          <button type="submit">Crear e imprimir recorridos</button>
        </form>
        <p>Los recorridos inorden, postorden y preorden aparecen en la consola del navegador.</p>
      </section>

      <section className="panel">
        <h2>Buscar en el árbol</h2>
        <form onSubmit={revisarNumero}>
          <label htmlFor="buscar">Número que quieres buscar</label>
          <input id="buscar" type="number" value={valorBuscar} onChange={(event) => setValorBuscar(event.target.value)} required />
          <button type="submit">Buscar</button>
        </form>
        {resultado && <p className="resultado">{resultado}</p>}
      </section>

      <section className="panel">
        <h2>Árbol</h2>
        {raiz ? <ArbolVisual raiz={raiz} /> : <p>Crea el árbol para verlo aquí.</p>}
      </section>
    </main>
  );
}
