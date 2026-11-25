import { Component, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductTrie, Product } from './search';

@Component({ selector: 'app-root', standalone: true, imports: [FormsModule], templateUrl: './app.html' })
class SearchApp {
  readonly catalog = new ProductTrie();
  prefix = 'air';
  k: number | null = 2;
  name = '';
  popularity: number | null = null;
  message = '';
  results: Product[] = [];

  constructor() {
    this.catalog.insert('air max', 90);
    this.catalog.insert('air force', 95);
    this.catalog.insert('air jordan', 85);
    this.catalog.insert('adidas boost', 80);
    this.search();
  }

  get validK(): boolean {
    return this.k !== null && Number.isSafeInteger(this.k) && this.k > 0;
  }

  search(): void {
    this.results = this.validK ? this.catalog.searchTopK(this.prefix, this.k!) : [];
  }

  save(): void {
    try {
      if (this.popularity === null) throw new Error('Ingresa la popularidad.');
      const previousSize = this.catalog.size;
      this.catalog.insert(this.name, this.popularity);
      this.message = previousSize === this.catalog.size ? 'Popularidad actualizada.' : 'Producto agregado.';
      this.name = '';
      this.popularity = null;
      this.search();
    } catch (error) {
      this.message = (error as Error).message;
    }
  }
}
bootstrapApplication(SearchApp, { providers: [provideZonelessChangeDetection()] }).catch(console.error);
