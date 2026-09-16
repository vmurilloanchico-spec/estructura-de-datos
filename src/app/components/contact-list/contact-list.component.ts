import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({ selector: 'app-contact-list', templateUrl: './contact-list.component.html' })
export class ContactListComponent {
  @Input({ required: true }) contacts: Contact[] = [];
  @Output() edit = new EventEmitter<Contact>();
  @Output() remove = new EventEmitter<number>();
}
