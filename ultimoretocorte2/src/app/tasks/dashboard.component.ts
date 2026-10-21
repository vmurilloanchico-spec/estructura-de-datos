import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NewTask, Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <header class="navbar bg-white border-bottom">
      <div class="container">
        <span class="navbar-brand mb-0">Fake Login App</span>
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small">{{ user()?.email }}</span>
          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="logout()">Cerrar sesión</button>
        </div>
      </div>
    </header>

    <main class="container py-4" style="max-width: 760px">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 mb-0">Tareas</h1>
        <button class="btn btn-primary" type="button" (click)="startCreate()">Nueva tarea</button>
      </div>

      <form *ngIf="editorOpen()" class="border rounded p-3 mb-4" [formGroup]="form" (ngSubmit)="saveTask()">
        <label class="form-label" for="task-title">Título</label>
        <input class="form-control mb-3" id="task-title" formControlName="title" maxlength="100" required>
        <label class="form-label" for="task-description">Descripción</label>
        <textarea class="form-control mb-3" id="task-description" formControlName="description" rows="2" maxlength="500"></textarea>
        <p class="text-danger small" *ngIf="error()">{{ error() }}</p>
        <button class="btn btn-primary me-2" type="submit" [disabled]="form.invalid || busy()">{{ busy() ? 'Guardando...' : 'Guardar' }}</button>
        <button class="btn btn-outline-secondary" type="button" (click)="cancelEdit()">Cancelar</button>
      </form>

      <p class="text-danger" *ngIf="error() && !editorOpen()">{{ error() }}</p>
      <ul class="list-group" *ngIf="tasks().length; else emptyTasks">
        <li class="list-group-item d-flex align-items-start gap-3" *ngFor="let task of tasks(); trackBy: trackTask">
          <input class="form-check-input mt-1" type="checkbox" [checked]="task.completed" (change)="toggleTask(task)" [attr.aria-label]="task.completed ? 'Marcar pendiente' : 'Marcar completada'">
          <div class="flex-grow-1">
            <div [class.text-decoration-line-through]="task.completed">{{ task.title }}</div>
            <small class="text-muted" *ngIf="task.description">{{ task.description }}</small>
          </div>
          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="startEdit(task)">Editar</button>
          <button class="btn btn-outline-danger btn-sm" type="button" (click)="deleteTask(task)">Eliminar</button>
        </li>
      </ul>
      <ng-template #emptyTasks><p class="text-muted">Aún no hay tareas.</p></ng-template>
    </main>
  `,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder).nonNullable;

  readonly user = toSignal(this.auth.user$, { initialValue: undefined });
  private readonly taskSource: Observable<Task[]> = this.auth.user$.pipe(
    switchMap((user) => user ? this.taskService.watchTasks(user.uid) : of([])),
  );
  readonly tasks = toSignal(this.taskSource, { initialValue: [] as Task[] });
  readonly editorOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly form = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)],
  });

  trackTask(_index: number, task: Task): string {
    return task.id;
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form.reset({ title: '', description: '' });
    this.error.set('');
    this.editorOpen.set(true);
  }

  startEdit(task: Task): void {
    this.editingId.set(task.id);
    this.form.reset({ title: task.title, description: task.description });
    this.error.set('');
    this.editorOpen.set(true);
  }

  cancelEdit(): void {
    this.editorOpen.set(false);
    this.editingId.set(null);
    this.form.reset({ title: '', description: '' });
    this.error.set('');
  }

  async saveTask(): Promise<void> {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    const task: NewTask = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
    };
    try {
      const id = this.editingId();
      if (id) await this.taskService.update(id, task);
      else await this.taskService.create(task);
      this.cancelEdit();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo guardar la tarea.');
    } finally {
      this.busy.set(false);
    }
  }

  async toggleTask(task: Task): Promise<void> {
    try {
      await this.taskService.setCompleted(task.id, !task.completed);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo actualizar la tarea.');
    }
  }

  async deleteTask(task: Task): Promise<void> {
    if (!window.confirm(`¿Eliminar "${task.title}"?`)) return;
    try {
      await this.taskService.delete(task.id);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo eliminar la tarea.');
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
