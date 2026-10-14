import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileSystemService, TreeNode } from './file-system.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly fileSystem = inject(FileSystemService);

  readonly tree = this.fileSystem.tree;
  readonly currentUser = this.fileSystem.currentUser;
  readonly selectedNodeId = signal('root');
  readonly selectedNode = computed(() =>
    this.fileSystem.findNodeById(this.tree(), this.selectedNodeId()),
  );
  readonly treeRows = computed(() => this.fileSystem.flattenTree(this.tree()));

  readonly loginForm = {
    email: 'admin@parcial2.com',
    password: 'admin123',
  };

  readonly registerForm = {
    name: '',
    email: '',
    password: '',
  };

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>('Sistema listo. Inicia sesión con el usuario administrador para crear elementos.');
  newItemName = '';

  selectNode(nodeId: string): void {
    this.selectedNodeId.set(nodeId);
    this.errorMessage.set(null);
  }

  canCreate(): boolean {
    return this.fileSystem.isAuthenticated();
  }

  loginUser(): void {
    const user = this.fileSystem.login(this.loginForm.email, this.loginForm.password);

    if (!user) {
      this.errorMessage.set('Credenciales inválidas. Verifica que el usuario esté registrado.');
      this.successMessage.set(null);
      return;
    }

    this.successMessage.set(`Bienvenido ${user.name}. Ya puedes crear carpetas y archivos.`);
    this.errorMessage.set(null);
  }

  registerUser(): void {
    try {
      const user = this.fileSystem.registerUser(
        this.registerForm.name,
        this.registerForm.email,
        this.registerForm.password,
      );

      this.loginForm.email = user.email;
      this.loginForm.password = user.password;
      this.successMessage.set(`Usuario registrado correctamente: ${user.email}`);
      this.errorMessage.set(null);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'No se pudo registrar el usuario.',
      );
      this.successMessage.set(null);
    }
  }

  logout(): void {
    this.fileSystem.logout();
    this.successMessage.set('Sesión cerrada. Debes volver a iniciar sesión para crear elementos.');
    this.errorMessage.set(null);
  }

  createFolder(): void {
    this.createNode('folder');
  }

  createFile(): void {
    this.createNode('file');
  }

  deleteNode(nodeId: string): void {
    if (!this.fileSystem.isAuthenticated()) {
      this.errorMessage.set('Necesitas iniciar sesión para eliminar elementos.');
      this.successMessage.set(null);
      return;
    }

    this.fileSystem.deleteNode(nodeId);
    this.successMessage.set('Elemento eliminado correctamente.');
    this.errorMessage.set(null);
  }

  private createNode(type: 'folder' | 'file'): void {
    const parentId = this.selectedNodeId();

    if (!this.fileSystem.isAuthenticated()) {
      this.errorMessage.set('No puedes crear elementos porque aún no hay una sesión activa.');
      this.successMessage.set(null);
      return;
    }

    try {
      if (type === 'folder') {
        this.fileSystem.createFolder(parentId, this.newItemName);
      } else {
        this.fileSystem.createFile(parentId, this.newItemName);
      }

      this.newItemName = '';
      this.successMessage.set(
        type === 'folder'
          ? 'Carpeta creada correctamente.'
          : 'Archivo creado correctamente.',
      );
      this.errorMessage.set(null);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'No se pudo crear el elemento.',
      );
      this.successMessage.set(null);
    }
  }
}
