import { NgZone, OnDestroy, OnInit, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RealtimeChannel, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Task, TaskDraft } from './task.model';

@Component({
  selector: 'app-reto-10',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './reto-10.html',
})
export class Reto10 implements OnInit, OnDestroy {
  readonly configured: boolean;
  readonly session = signal<Session | null>(null);
  readonly tasks = signal<Task[]>([]);
  readonly busy = signal(false);
  readonly loadingTasks = signal(false);
  readonly errorMessage = signal('');
  readonly notice = signal('');
  readonly authMode = signal<'login' | 'register'>('login');

  authName = '';
  authEmail = '';
  authPassword = '';
  newTask: TaskDraft = { title: '', description: '' };
  editingTaskId: string | null = null;
  editingDraft: TaskDraft = { title: '', description: '' };
  private authSubscription: { unsubscribe: () => void } | null = null;
  private taskChannel: RealtimeChannel | null = null;

  activeTaskCount(): number {
    return this.tasks().filter((task) => !task.is_completed).length;
  }

  completedTaskCount(): number {
    return this.tasks().filter((task) => task.is_completed).length;
  }

  constructor(
    private readonly supabase: SupabaseService,
    private readonly zone: NgZone,
  ) {
    this.configured = supabase.isConfigured;
  }

  async ngOnInit(): Promise<void> {
    if (!this.supabase.client) return;

    const { data, error } = await this.supabase.client.auth.getSession();
    if (error) {
      this.errorMessage.set(error.message);
      return;
    }
    await this.syncSession(data.session);

    const { data: authData } = this.supabase.client.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        this.zone.run(() => void this.syncSession(session));
      });
    });
    this.authSubscription = authData.subscription;
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    if (this.taskChannel && this.supabase.client) {
      void this.supabase.client.removeChannel(this.taskChannel);
    }
  }

  async submitAuth(): Promise<void> {
    this.clearFeedback();
    this.busy.set(true);
    try {
      if (this.authMode() === 'register') {
        await this.supabase.signUp(this.authName.trim(), this.authEmail.trim(), this.authPassword);
        this.notice.set('Cuenta creada. Si Supabase solicita confirmación, revisa tu correo antes de iniciar sesión.');
      } else {
        await this.supabase.signIn(this.authEmail.trim(), this.authPassword);
        this.notice.set('Sesión iniciada correctamente.');
      }
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  async logout(): Promise<void> {
    this.clearFeedback();
    try {
      await this.supabase.signOut();
      this.notice.set('Sesión cerrada.');
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    }
  }

  async addTask(): Promise<void> {
    const user = this.session()?.user;
    const title = this.newTask.title.trim();
    if (!user || !title) return;

    this.clearFeedback();
    this.busy.set(true);
    try {
      await this.supabase.createTask(user.id, {
        title,
        description: this.newTask.description.trim(),
      });
      this.newTask = { title: '', description: '' };
      this.notice.set('Tarea creada.');
      await this.loadTasks(user.id);
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  startEditing(task: Task): void {
    this.editingTaskId = task.id;
    this.editingDraft = { title: task.title, description: task.description };
  }

  cancelEditing(): void {
    this.editingTaskId = null;
  }

  async saveTask(task: Task): Promise<void> {
    const user = this.session()?.user;
    const title = this.editingDraft.title.trim();
    if (!user || !title) return;

    this.clearFeedback();
    this.busy.set(true);
    try {
      await this.supabase.updateTask(task.id, user.id, {
        title,
        description: this.editingDraft.description.trim(),
      });
      this.editingTaskId = null;
      this.notice.set('Tarea actualizada.');
      await this.loadTasks(user.id);
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.busy.set(false);
    }
  }

  async toggleTask(task: Task): Promise<void> {
    const user = this.session()?.user;
    if (!user) return;
    this.clearFeedback();
    try {
      await this.supabase.setTaskCompleted(task.id, user.id, !task.is_completed);
      await this.loadTasks(user.id);
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    }
  }

  async deleteTask(task: Task): Promise<void> {
    const user = this.session()?.user;
    if (!user) return;
    this.clearFeedback();
    try {
      await this.supabase.deleteTask(task.id, user.id);
      this.notice.set('Tarea eliminada.');
      await this.loadTasks(user.id);
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    }
  }

  async changeAvatar(event: Event): Promise<void> {
    const user = this.session()?.user;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!user || !file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      this.errorMessage.set('Selecciona una imagen JPG, PNG, WebP o GIF.');
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage.set('La imagen debe pesar menos de 2 MB.');
      input.value = '';
      return;
    }

    this.clearFeedback();
    this.busy.set(true);
    try {
      await this.supabase.uploadAvatar(user.id, file);
      this.notice.set('Foto de perfil actualizada.');
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }

  avatarUrl(): string | null {
    const value = this.session()?.user.user_metadata['avatar_url'];
    return typeof value === 'string' ? value : null;
  }

  userName(): string {
    const user = this.session()?.user;
    const name = user?.user_metadata['full_name'];
    return typeof name === 'string' && name.trim() ? name : user?.email ?? 'Usuario';
  }

  private async syncSession(session: Session | null): Promise<void> {
    this.session.set(session);
    if (this.taskChannel && this.supabase.client) {
      await this.supabase.client.removeChannel(this.taskChannel);
      this.taskChannel = null;
    }
    if (!session) {
      this.tasks.set([]);
      return;
    }

    await this.loadTasks(session.user.id);
    const client = this.supabase.client;
    if (!client) return;
    this.taskChannel = client
      .channel(`tasks-${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          this.zone.run(() => void this.loadTasks(session.user.id));
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          this.zone.run(() => {
            this.errorMessage.set('No se pudo conectar la lista en tiempo real. Revisa la publicación de Realtime en Supabase.');
          });
        }
      });
  }

  private async loadTasks(userId: string): Promise<void> {
    this.loadingTasks.set(true);
    try {
      this.tasks.set(await this.supabase.listTasks(userId));
    } catch (error) {
      this.errorMessage.set(this.describeError(error));
    } finally {
      this.loadingTasks.set(false);
    }
  }

  private clearFeedback(): void {
    this.errorMessage.set('');
    this.notice.set('');
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
  }
}
