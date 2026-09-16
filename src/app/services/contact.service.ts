import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private contacts: Contact[] = [
    { id: 1, name: 'Ana Martínez', phone: '+57 300 123 4567' },
    { id: 2, name: 'Carlos Gómez', phone: '+57 310 765 4321' },
    { id: 3, name: 'Luisa Rodríguez', phone: '+57 315 456 7890' }
  ];

  getAll(): Promise<Contact[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.contacts]), 900));
  }

  snapshot(): Contact[] {
    return [...this.contacts];
  }

  add(data: Omit<Contact, 'id'>): Contact {
    const contact = { id: Date.now(), ...data };
    this.contacts = [...this.contacts, contact];
    return contact;
  }

  update(updated: Contact): void {
    this.contacts = this.contacts.map(contact => contact.id === updated.id ? updated : contact);
  }

  delete(id: number): void {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
  }
}
