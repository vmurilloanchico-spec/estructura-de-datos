import { Component, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NetworkGraph } from './network-graph';
import { initialNetwork, Network } from './model';

const storageKey = 'challenge-11-network-v1';
function loadNetwork(): Network {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      if (Array.isArray(data?.cities) && Array.isArray(data.people) && Array.isArray(data.friendships)) return data;
    }
  } catch { /* El grafo inicial permite trabajar si el navegador restringe el almacenamiento. */ }
  return initialNetwork;
}

@Component({selector:'app-root',standalone:true,imports:[FormsModule,NetworkGraph],templateUrl:'./app.html'})
class App {
  network = signal(loadNetwork());
  selectedCity = signal(this.network().cities[0].id);
  city = computed(() => this.network().cities.find(c => c.id === this.selectedCity())!);
  residents = computed(() => this.network().people.filter(p => p.cityId === this.selectedCity()));
  cityName = '';
  personName = '';
  age: number | null = null;
  residence = this.selectedCity();
  first = '';
  second = '';
  message = '';

  private save(data: Network, message: string) {
    this.network.set(data);
    this.message = message;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); }
    catch { this.message += ' Los cambios solo estarán disponibles durante esta sesión.'; }
  }

  addCity() {
    const name = this.cityName.trim();
    const data = this.network();
    if (!name) { this.message = 'Escribe el nombre de la ciudad.'; return; }
    if (data.cities.some(c => c.name.localeCompare(name,'es',{sensitivity:'base'}) === 0)) {
      this.message = 'Esa ciudad ya existe.'; return;
    }
    const city = {id:crypto.randomUUID(), name};
    this.save({...data, cities:[...data.cities, city]}, 'Ciudad agregada.');
    this.selectedCity.set(city.id);
    this.residence = city.id;
    this.cityName = '';
  }

  addPerson() {
    const data = this.network();
    const name = this.personName.trim();
    if (!name || this.age === null || !Number.isInteger(this.age) || this.age < 0 || !data.cities.some(c => c.id === this.residence)) {
      this.message = 'Completa el nombre, una edad entera de cero o más y la ciudad.'; return;
    }
    const person = {id:crypto.randomUUID(), name, age:this.age, cityId:this.residence};
    this.save({...data, people:[...data.people,person]}, 'Persona agregada.');
    this.selectedCity.set(this.residence);
    this.personName = ''; this.age = null;
  }

  addFriendship() {
    const data = this.network();
    if (!this.first || !this.second || this.first === this.second) {
      this.message = 'Elige dos personas diferentes.'; return;
    }
    if (data.friendships.some(e => (e.source===this.first && e.target===this.second) || (e.target===this.first && e.source===this.second))) {
      this.message = 'Esta amistad ya existe.'; return;
    }
    this.save({...data, friendships:[...data.friendships,{source:this.first,target:this.second}]}, 'Amistad agregada.');
    this.first = this.second = '';
  }

  printList() { window.print(); }
}
bootstrapApplication(App,{providers:[provideZonelessChangeDetection()]}).catch(console.error);
