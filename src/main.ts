import 'zone.js';
import '@angular/compiler';
import { ChangeDetectorRef, Component, NgZone, inject, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { createClient, type RealtimeChannel, type Session } from '@supabase/supabase-js';
import template from './app.html?raw';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const db = url && key ? createClient(url, key) : null;
type Task = { id: string; title: string; completed: boolean };

@Component({ selector: 'app-root', standalone: true, template })
class App {
  private view = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private channel?: RealtimeChannel;
  private revision = 0;
  private avatarRevision = 0;
  userId = '';
  emailAddress = '';
  avatar = '';
  tasks: Task[] = [];
  live = '';
  loaded = false;
  editing = '';
  register = false;
  busy = false;
  message = db ? '' : 'Configura el archivo .env y reinicia el servidor.';

  constructor() {
    db?.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => this.zone.run(() => this.setSession(session)), 0);
    });
  }

  setSession(session: Session | null) {
    const id = session?.user.id ?? '';
    if (id === this.userId) {
      if (session) void db!.realtime.setAuth(session.access_token);
      return;
    }
    this.userId = id;
    this.emailAddress = session?.user.email ?? '';
    if (this.channel) void db!.removeChannel(this.channel);
    URL.revokeObjectURL(this.avatar);
    this.avatar = this.editing = this.message = '';
    this.tasks = [];
    this.loaded = false;
    this.view.markForCheck();
    if (!id) return;
    this.live = 'Conectando lista en vivo…';
    void this.refresh();
    void this.loadAvatar(id);
    void this.connect(session!);
  }

  async connect(session: Session) {
    const id = session.user.id;
    await db!.realtime.setAuth(session.access_token);
    if (this.userId !== id) return;
    this.channel = db!.channel('tasks:' + id, { config: { private: true } })
      .on('broadcast', { event: 'changed' }, () => this.zone.run(() => void this.refresh()))
      .subscribe(status => this.zone.run(() => {
        if (this.userId !== id) return;
        this.live = status === 'SUBSCRIBED' ? 'Lista en vivo conectada' : 'Lista en vivo desconectada';
        this.view.markForCheck();
        if (status === 'SUBSCRIBED') void this.refresh();
      }));
  }

  async auth(event: Event, email: string, password: string) {
    event.preventDefault();
    if (!db || this.busy) return;
    this.busy = true;
    this.message = '';
    try {
      const credentials = { email: email.trim(), password };
      const { data, error } = this.register
        ? await db.auth.signUp({ ...credentials, options: { emailRedirectTo: location.origin } })
        : await db.auth.signInWithPassword(credentials);
      if (error) this.message = error.message;
      else if (!data.session) {
        this.register = false;
        this.message = 'Revisa tu correo para confirmar la cuenta. Luego inicia sesión.';
      }
    } finally { this.busy = false; this.view.markForCheck(); }
  }

  async logout() {
    const { error } = await db!.auth.signOut({ scope: 'local' });
    if (error) this.message = error.message;
    this.view.markForCheck();
  }

  async refresh() {
    const id = this.userId;
    const revision = ++this.revision;
    const { data, error } = await db!.from('tasks').select('id,title,completed')
      .eq('user_id', id).order('created_at', { ascending: false }).order('id');
    if (id !== this.userId || revision !== this.revision) return;
    if (error) this.message = error.message;
    else { this.tasks = data; this.loaded = true; }
    this.view.markForCheck();
  }

  async add(event: Event, input: HTMLInputElement) {
    event.preventDefault();
    const title = input.value.trim();
    if (!title || this.busy) return;
    this.busy = true;
    try {
      const { error } = await db!.from('tasks').insert({ title });
      if (error) this.message = error.message;
      else { input.value = ''; await this.refresh(); }
    } finally { this.busy = false; this.view.markForCheck(); }
  }

  async save(event: Event, id: string, value: string) {
    event.preventDefault();
    const title = value.trim();
    if (!title) { this.message = 'Escribe un título.'; return; }
    const { error } = await db!.from('tasks').update({ title }).eq('id', id);
    if (error) this.message = error.message;
    else { this.editing = ''; await this.refresh(); }
    this.view.markForCheck();
  }

  async toggle(task: Task, event: Event) {
    const box = event.target as HTMLInputElement;
    const { error } = await db!.from('tasks').update({ completed: box.checked }).eq('id', task.id);
    if (error) { box.checked = task.completed; this.message = error.message; }
    else await this.refresh();
    this.view.markForCheck();
  }

  async remove(task: Task) {
    if (!confirm('¿Eliminar «' + task.title + '»?')) return;
    const { error } = await db!.from('tasks').delete().eq('id', task.id);
    if (error) this.message = error.message;
    else await this.refresh();
    this.view.markForCheck();
  }

  async loadAvatar(id: string) {
    const revision = ++this.avatarRevision;
    const bucket = db!.storage.from('avatars');
    const { data: files, error } = await bucket.list(id, { search: 'avatar' });
    if (id !== this.userId || revision !== this.avatarRevision) return;
    if (error) { this.message = error.message; this.view.markForCheck(); return; }
    if (!files.some(file => file.name === 'avatar')) return;
    const result = await bucket.download(id + '/avatar');
    if (id !== this.userId || revision !== this.avatarRevision) return;
    if (result.error) { this.message = result.error.message; this.view.markForCheck(); return; }
    URL.revokeObjectURL(this.avatar);
    this.avatar = URL.createObjectURL(result.data);
    this.view.markForCheck();
  }

  async upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const id = this.userId;
    input.value = '';
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 2097152) {
      this.message = 'Elige una imagen JPG, PNG o WebP de hasta 2 MB.'; return;
    }
    const { error } = await db!.storage.from('avatars').upload(id + '/avatar', file,
      { upsert: true, cacheControl: '0' });
    if (id !== this.userId) return;
    if (error) this.message = error.message;
    else { this.message = 'Avatar actualizado.'; await this.loadAvatar(id); }
    this.view.markForCheck();
  }
}

bootstrapApplication(App, { providers: [provideZoneChangeDetection()] }).catch(console.error);
