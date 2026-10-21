import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Observable, of, startWith } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly configured = Object.values(environment.firebase).every(Boolean);

  readonly user$: Observable<User | null | undefined> = this.configured
    ? authState(this.auth).pipe(startWith(undefined))
    : of(null).pipe(startWith(undefined));

  get isConfigured(): boolean {
    return this.configured;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    this.ensureConfigured();
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    return credential.user;
  }

  async login(email: string, password: string): Promise<User> {
    this.ensureConfigured();
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async logout(): Promise<void> {
    this.ensureConfigured();
    await signOut(this.auth);
  }

  private ensureConfigured(): void {
    if (!this.configured) {
      throw new Error('Configura Firebase en src/environments/environment.ts para continuar.');
    }
  }
}
