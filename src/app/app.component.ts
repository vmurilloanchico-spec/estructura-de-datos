import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Contact } from './models/contact.model';
import { ContactService } from './services/contact.service';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({ selector: 'app-root', imports: [ContactFormComponent, ContactListComponent, LoaderComponent], templateUrl: './app.component.html' })
export class AppComponent implements OnInit {
  private readonly contactService = inject(ContactService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  contacts: Contact[] = [];
  editing: Contact | null = null;
  loading = true;

  async ngOnInit(): Promise<void> {
    this.contacts = await this.contactService.getAll();
    this.loading = false;
    this.changeDetector.detectChanges();
  }

  save(data: Omit<Contact, 'id'>): void {
    if (this.editing) { this.contactService.update({ ...this.editing, ...data }); this.editing = null; }
    else { this.contactService.add(data); }
    this.refresh();
  }
  remove(id: number): void { this.contactService.delete(id); this.refresh(); }
  private refresh(): void { this.contacts = this.contactService.snapshot(); }
}
