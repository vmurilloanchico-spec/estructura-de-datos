import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config';
import { Task, TaskDraft } from './task.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient | null =
    supabaseConfig.url && supabaseConfig.anonKey
      ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
      : null;

  get isConfigured(): boolean {
    return this.client !== null;
  }

  async signUp(name: string, email: string, password: string): Promise<void> {
    const client = this.requireClient();
    const { error } = await client.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.requireClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.requireClient().auth.signOut();
    if (error) throw error;
  }

  async listTasks(userId: string): Promise<Task[]> {
    const { data, error } = await this.requireClient()
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Task[];
  }

  async createTask(userId: string, task: TaskDraft): Promise<void> {
    const { error } = await this.requireClient()
      .from('tasks')
      .insert({ user_id: userId, title: task.title, description: task.description });
    if (error) throw error;
  }

  async updateTask(taskId: string, userId: string, task: TaskDraft): Promise<void> {
    const { error } = await this.requireClient()
      .from('tasks')
      .update({ title: task.title, description: task.description })
      .eq('id', taskId)
      .eq('user_id', userId);
    if (error) throw error;
  }

  async setTaskCompleted(taskId: string, userId: string, completed: boolean): Promise<void> {
    const { error } = await this.requireClient()
      .from('tasks')
      .update({ is_completed: completed })
      .eq('id', taskId)
      .eq('user_id', userId);
    if (error) throw error;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const { error } = await this.requireClient()
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);
    if (error) throw error;
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const path = `${userId}/${Date.now()}.${extension}`;
    const client = this.requireClient();
    const { error: uploadError } = await client.storage.from('avatars').upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });
    if (uploadError) throw uploadError;

    const { data } = client.storage.from('avatars').getPublicUrl(path);
    const { error: metadataError } = await client.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    if (metadataError) throw metadataError;
    return data.publicUrl;
  }

  private requireClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Configura el URL y la clave pública de Supabase en supabase.config.ts.');
    }
    return this.client;
  }
}
