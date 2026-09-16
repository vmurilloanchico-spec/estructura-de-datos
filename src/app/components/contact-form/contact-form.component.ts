import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnChanges {
  @Input() contact: Contact | null = null;
  @Output() saved = new EventEmitter<{ name: string; phone: string }>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(7)] })
  });

  ngOnChanges(): void {
    this.form.setValue({ name: this.contact?.name ?? '', phone: this.contact?.phone ?? '' });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saved.emit(this.form.getRawValue());
    this.form.reset();
  }
}
