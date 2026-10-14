import { Injectable, signal } from '@angular/core';

export type NodeType = 'folder' | 'file';

export interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  createdBy: string;
  createdAt: string;
  parentId: string | null;
  children: TreeNode[];
}

export interface RegisteredUser {
  email: string;
  password: string;
  name: string;
}

export interface FlatTreeNode extends TreeNode {
  depth: number;
}

@Injectable({ providedIn: 'root' })
export class FileSystemService {
  private readonly treeStorageKey = 'parcial2.tree';
  private readonly usersStorageKey = 'parcial2.users';
  private readonly currentUserStorageKey = 'parcial2.currentUser';

  readonly tree = signal<TreeNode[]>(this.loadTree());
  readonly currentUser = signal<RegisteredUser | null>(this.loadCurrentUser());

  constructor() {
    this.ensureBaseUsers();
  }

  registerUser(name: string, email: string, password: string): RegisteredUser {
    const cleanName = name.trim();
    const normalizedEmail = this.normalizeEmail(email);
    const cleanPassword = password.trim();

    if (!cleanName) {
      throw new Error('El nombre es obligatorio.');
    }

    if (!normalizedEmail) {
      throw new Error('El correo es obligatorio.');
    }

    if (!cleanPassword) {
      throw new Error('La contraseña es obligatoria.');
    }

    const users = this.loadUsers();
    const alreadyExists = users.some((user) => user.email === normalizedEmail);

    if (alreadyExists) {
      throw new Error('Este correo ya está registrado.');
    }

    const user: RegisteredUser = {
      name: cleanName,
      email: normalizedEmail,
      password: cleanPassword,
    };

    const updatedUsers = [...users, user];
    localStorage.setItem(this.usersStorageKey, JSON.stringify(updatedUsers));
    this.currentUser.set(user);
    localStorage.setItem(this.currentUserStorageKey, JSON.stringify(user));

    return user;
  }

  login(email: string, password: string): RegisteredUser | null {
    const normalizedEmail = this.normalizeEmail(email);
    const users = this.loadUsers();
    const user = users.find(
      (candidate) =>
        candidate.email === normalizedEmail && candidate.password === password.trim(),
    );

    if (!user) {
      this.currentUser.set(null);
      localStorage.removeItem(this.currentUserStorageKey);
      return null;
    }

    this.currentUser.set(user);
    localStorage.setItem(this.currentUserStorageKey, JSON.stringify(user));
    return user;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.currentUserStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  createFolder(parentId: string, name: string): TreeNode {
    return this.createNode(parentId, name, 'folder');
  }

  createFile(parentId: string, name: string): TreeNode {
    return this.createNode(parentId, name, 'file');
  }

  deleteNode(nodeId: string): void {
    if (!nodeId || nodeId === 'root') {
      return;
    }

    const nextTree = this.removeNodeById(this.tree(), nodeId);
    this.tree.set(nextTree);
    localStorage.setItem(this.treeStorageKey, JSON.stringify(nextTree));
  }

  findNodeById(nodes: TreeNode[], nodeId: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }

      if (node.children.length > 0) {
        const found = this.findNodeById(node.children, nodeId);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  flattenTree(nodes: TreeNode[], depth = 0): FlatTreeNode[] {
    return nodes.flatMap((node) => [
      { ...node, depth },
      ...this.flattenTree(node.children, depth + 1),
    ]);
  }

  private createNode(parentId: string, name: string, type: NodeType): TreeNode {
    const activeUser = this.currentUser();

    if (!activeUser) {
      throw new Error('Debes iniciar sesión antes de crear elementos.');
    }

    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error('El nombre del elemento no puede estar vacío.');
    }

    const parent = this.findNodeById(this.tree(), parentId);
    if (!parent) {
      throw new Error('No se encontró la carpeta padre.');
    }

    if (parent.type === 'file') {
      throw new Error('Un archivo no puede contener hijos.');
    }

    const node: TreeNode = {
      id: this.createId(),
      name: cleanName,
      type,
      createdBy: activeUser.email,
      createdAt: new Date().toISOString(),
      parentId,
      children: [],
    };

    const nextTree = this.insertNodeIntoTree(this.tree(), parentId, node);
    this.tree.set(nextTree);
    localStorage.setItem(this.treeStorageKey, JSON.stringify(nextTree));

    return node;
  }

  private loadTree(): TreeNode[] {
    const persisted = localStorage.getItem(this.treeStorageKey);

    if (persisted) {
      try {
        const parsed = JSON.parse(persisted) as TreeNode[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        localStorage.removeItem(this.treeStorageKey);
      }
    }

    const defaultTree = this.getDefaultTree();
    localStorage.setItem(this.treeStorageKey, JSON.stringify(defaultTree));
    return defaultTree;
  }

  private loadUsers(): RegisteredUser[] {
    const persisted = localStorage.getItem(this.usersStorageKey);

    if (persisted) {
      try {
        const parsed = JSON.parse(persisted) as RegisteredUser[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        localStorage.removeItem(this.usersStorageKey);
      }
    }

    return [];
  }

  private loadCurrentUser(): RegisteredUser | null {
    const persisted = localStorage.getItem(this.currentUserStorageKey);

    if (!persisted) {
      return null;
    }

    try {
      const parsed = JSON.parse(persisted) as RegisteredUser;
      return parsed?.email ? parsed : null;
    } catch {
      localStorage.removeItem(this.currentUserStorageKey);
      return null;
    }
  }

  private ensureBaseUsers(): void {
    const users = this.loadUsers();
    if (users.length === 0) {
      const baseUser: RegisteredUser = {
        name: 'Administrador',
        email: 'admin@parcial2.com',
        password: 'admin123',
      };

      localStorage.setItem(this.usersStorageKey, JSON.stringify([baseUser]));
    }
  }

  private getDefaultTree(): TreeNode[] {
    return [
      {
        id: 'root',
        name: 'Raíz del sistema',
        type: 'folder',
        createdBy: 'admin@parcial2.com',
        createdAt: new Date().toISOString(),
        parentId: null,
        children: [
          {
            id: 'folder-1',
            name: 'Documentos',
            type: 'folder',
            createdBy: 'admin@parcial2.com',
            createdAt: new Date().toISOString(),
            parentId: 'root',
            children: [
              {
                id: 'file-1',
                name: 'requisitos.pdf',
                type: 'file',
                createdBy: 'admin@parcial2.com',
                createdAt: new Date().toISOString(),
                parentId: 'folder-1',
                children: [],
              },
            ],
          },
          {
            id: 'folder-2',
            name: 'Imagenes',
            type: 'folder',
            createdBy: 'admin@parcial2.com',
            createdAt: new Date().toISOString(),
            parentId: 'root',
            children: [],
          },
        ],
      },
    ];
  }

  private insertNodeIntoTree(
    nodes: TreeNode[],
    parentId: string,
    newNode: TreeNode,
  ): TreeNode[] {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }

      if (node.children.length > 0) {
        return {
          ...node,
          children: this.insertNodeIntoTree(node.children, parentId, newNode),
        };
      }

      return node;
    });
  }

  private removeNodeById(nodes: TreeNode[], nodeId: string): TreeNode[] {
    return nodes
      .filter((node) => node.id !== nodeId)
      .map((node) => ({
        ...node,
        children: this.removeNodeById(node.children, nodeId),
      }));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `node-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
