import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Cancion, clave, Grafo, MaxHeap, Trie } from './estructuras';

@Component({selector:'app-root',standalone:true,imports:[FormsModule],templateUrl:'./app.html'})
class Panel {
  private trie = new Trie();
  private heap = new MaxHeap();
  private grafo = new Grafo();
  canciones: Cancion[] = [];
  ranking: Cancion[] = [];
  sugerencias: Cancion[] = [];
  prefijo = '';
  consulta = '';
  seleccion = 'Ritmo solar';
  relacionadas: string[] = [];
  cantidad: number | 'todas' = 3;
  titulo = '';
  escuchas: number | null = 0;
  origen = '';
  destino = '';
  avisoCancion = '';
  avisoRelacion = '';

  constructor() {
    const iniciales: Cancion[] = [
      {titulo:'Ritmo solar',escuchas:1280}, {titulo:'Ritmo lunar',escuchas:960},
      {titulo:'Órbita azul',escuchas:1140}, {titulo:'La danza del agua',escuchas:845},
      {titulo:'Canto del bosque',escuchas:720}, {titulo:'Pulso de la Tierra',escuchas:690}
    ];
    for (const cancion of iniciales) this.insertar(cancion);
    this.grafo.conectar('Ritmo solar','Ritmo lunar');
    this.grafo.conectar('Ritmo solar','Órbita azul');
    this.grafo.conectar('La danza del agua','Canto del bosque');
    this.grafo.conectar('Canto del bosque','Pulso de la Tierra');
    this.actualizarRanking();
    this.verRelacionadas(this.seleccion);
  }

  private insertar(cancion: Cancion) {
    this.trie.insertar(cancion);
    this.heap.insertar(cancion);
    this.grafo.agregarVertice(cancion.titulo);
    this.canciones.push(cancion);
  }

  actualizarRanking() { this.ranking = this.heap.top(this.cantidad === 'todas' ? this.canciones.length : this.cantidad); }

  predecir(texto: string) {
    this.prefijo = texto;
    this.consulta = '';
    this.sugerencias = clave(texto) ? this.trie.sugerir(texto) : [];
  }

  comprobar() {
    const encontrada = this.trie.buscar(this.prefijo);
    this.consulta = encontrada ? 'Sí existe: ' + encontrada.titulo + '.' : 'Ese título completo no está en el catálogo.';
    if (encontrada) this.verRelacionadas(encontrada.titulo);
  }

  guardar() {
    const titulo = this.titulo.trim().replace(/\s+/g,' ');
    if (!clave(titulo) || this.escuchas === null || !Number.isSafeInteger(this.escuchas) || this.escuchas < 0) {
      this.avisoCancion = 'Escribe un título y un número entero de escuchas igual o mayor a cero.'; return;
    }
    if (this.trie.buscar(titulo)) { this.avisoCancion = 'Ya existe una canción con ese título.'; return; }
    this.insertar({titulo,escuchas:this.escuchas});
    this.actualizarRanking();
    this.predecir(this.prefijo);
    this.verRelacionadas(titulo);
    this.titulo = ''; this.escuchas = 0;
    this.avisoCancion = 'Canción agregada: ' + titulo + '.';
  }

  verRelacionadas(titulo: string) {
    this.seleccion = titulo;
    this.relacionadas = this.grafo.relacionadas(titulo);
  }

  conectar() {
    if (this.origen === this.destino) { this.avisoRelacion = 'Selecciona dos canciones distintas.'; return; }
    if (!this.grafo.conectar(this.origen,this.destino)) { this.avisoRelacion = 'Esa relación ya existe.'; return; }
    this.verRelacionadas(this.origen);
    this.avisoRelacion = 'Relación guardada en ambos sentidos.';
  }
}
bootstrapApplication(Panel,{providers:[provideZonelessChangeDetection()]}).catch(console.error);
