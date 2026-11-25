export interface Product {
  name: string;
  popularity: number;
}

function normalize(text: string): string {
  return text.trim().replace(/\s+/gu, ' ').toLocaleLowerCase('es').normalize('NFC');
}

const alphabetical = new Intl.Collator('es');
function worse(a: Product, b: Product): boolean {
  if (a.popularity !== b.popularity) return a.popularity < b.popularity;
  return alphabetical.compare(a.name, b.name) > 0;
}

class TopKHeap {
  private items: Product[] = [];
  constructor(private capacity: number) {}

  offer(product: Product): void {
    const a = this.items;
    if (a.length === this.capacity) {
      if (!worse(a[0], product)) return;
      a[0] = product;
      this.sink();
      return;
    }
    a.push(product);
    let index = a.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (!worse(a[index], a[parent])) break;
      [a[index], a[parent]] = [a[parent], a[index]];
      index = parent;
    }
  }

  private sink(): void {
    const a = this.items;
    let index = 0;
    while (2 * index + 1 < a.length) {
      let child = 2 * index + 1;
      if (child + 1 < a.length && worse(a[child + 1], a[child])) child++;
      if (!worse(a[child], a[index])) break;
      [a[index], a[child]] = [a[child], a[index]];
      index = child;
    }
  }

  drainBestFirst(): Product[] {
    const result = [];
    while (this.items.length) {
      result.push(this.items[0]);
      const last = this.items.pop()!;
      if (this.items.length) {
        this.items[0] = last;
        this.sink();
      }
    }
    return result.reverse();
  }
}

class TrieNode {
  children = new Map<string, TrieNode>();
  product?: Product;
}

export class ProductTrie {
  private root = new TrieNode();
  size = 0;

  insert(name: string, popularity: number): void {
    const key = normalize(name);
    if (!key || !Number.isFinite(popularity) || popularity < 0) {
      throw new Error('Ingresa un nombre y una popularidad mayor o igual a cero.');
    }
    let node = this.root;
    for (const letter of key) {
      let next = node.children.get(letter);
      if (!next) {
        next = new TrieNode();
        node.children.set(letter, next);
      }
      node = next;
    }
    if (!node.product) this.size++;
    node.product = { name: name.trim().replace(/\s+/gu, ' '), popularity };
  }

  searchTopK(prefix: string, k: number): Product[] {
    if (!Number.isInteger(k) || k <= 0) return [];
    let node = this.root;
    for (const letter of normalize(prefix)) {
      const next = node.children.get(letter);
      if (!next) return [];
      node = next;
    }
    const heap = new TopKHeap(k);
    const pending = [node];
    while (pending.length) {
      const current = pending.pop()!;
      if (current.product) heap.offer(current.product);
      for (const child of current.children.values()) pending.push(child);
    }
    return heap.drainBestFirst();
  }
}
