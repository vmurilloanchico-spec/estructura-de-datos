import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { apiKey } from './config.generated';

interface Gif {
  id: string;
  title: string;
  url: string;
  username?: string;
  images: { fixed_width?: { url: string }; original?: { url: string } };
}

@Component({selector:'app-root', standalone:true, templateUrl:'./app.html'})
class GifSearch {
  readonly ready = Boolean(apiKey);
  readonly gifs = signal<Gif[]>([]);
  readonly message = signal('');
  private active?: AbortController;

  async search(event: Event, value: string): Promise<void> {
    event.preventDefault();
    const query = value.trim();
    this.active?.abort();
    this.gifs.set([]);
    if (!this.ready || !query) {
      this.message.set('Escribe una palabra para buscar.');
      return;
    }
    const request = new AbortController();
    this.active = request;
    this.message.set('Buscando GIFs…');
    const params = new URLSearchParams({api_key:apiKey, q:query, limit:'25', offset:'0', rating:'g', lang:'en'});
    try {
      const response = await fetch('https://api.giphy.com/v1/gifs/search?' + params, {signal:request.signal});
      if (!response.ok) {
        if ([401,403].includes(response.status)) throw new Error('GIPHY rechazó la clave. Revisa el archivo .env y reinicia la aplicación.');
        if (response.status === 429) throw new Error('Se alcanzó el límite de consultas de GIPHY. Inténtalo más tarde.');
        throw new Error('GIPHY no pudo completar la búsqueda. Inténtalo de nuevo.');
      }
      const body = await response.json();
      if (request.signal.aborted) return;
      if (!Array.isArray(body.data)) throw new Error('GIPHY devolvió una respuesta inesperada.');
      const gifs: Gif[] = body.data.filter((gif: Gif) => gif?.id && (gif.images?.fixed_width?.url || gif.images?.original?.url));
      this.gifs.set(gifs);
      this.message.set(gifs.length ? gifs.length + ' GIFs para «' + query + '»' : 'Sin resultados para «' + query + '». Prueba otra palabra.');
    } catch (error) {
      if (!request.signal.aborted) this.message.set(error instanceof TypeError ? 'Revisa la conexión e intenta de nuevo.' : (error as Error).message);
    }
  }
}
bootstrapApplication(GifSearch, {providers:[provideZonelessChangeDetection()]}).catch(console.error);
