import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NewTask, Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly configured = Object.values(environment.firebase).every(Boolean);
  private readonly tasksCollection = collection(this.firestore, 'tasks');

  watchTasks(userId: string): Observable<Task[]> {
    const userTasks = query(this.tasksCollection, where('userId', '==', userId));
    return collectionData(userTasks, { idField: 'id' }) as Observable<Task[]>;
  }

  async create(task: NewTask): Promise<void> {
    const userId = this.requireOwner();
    const now = Date.now();
    await addDoc(this.tasksCollection, {
      ...task,
      userId,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(taskId: string, changes: Partial<NewTask>): Promise<void> {
    this.requireOwner();
    await updateDoc(doc(this.firestore, 'tasks', taskId), {
      ...changes,
      updatedAt: Date.now(),
    });
  }

  async setCompleted(taskId: string, completed: boolean): Promise<void> {
    this.requireOwner();
    await updateDoc(doc(this.firestore, 'tasks', taskId), {
      completed,
      updatedAt: Date.now(),
    });
  }

  async delete(taskId: string): Promise<void> {
    this.requireOwner();
    await deleteDoc(doc(this.firestore, 'tasks', taskId));
  }

  private requireOwner(): string {
    if (!this.configured) {
      throw new Error('Configura Firebase en src/environments/environment.ts para continuar.');
    }
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Debes iniciar sesión para modificar tareas.');
    }
    return userId;
  }
}
