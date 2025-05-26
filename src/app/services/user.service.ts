import { Injectable } from '@angular/core';

export interface AppUser {
  fullName: string;
  email: string;
  password: string;
  profilePicUrl?: string;
  likedPosts?: number[];
  likedComments?: number[];
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localKey = 'users';

  constructor() {
    // Ensure users key exists
    if (!localStorage.getItem(this.localKey)) {
      localStorage.setItem(this.localKey, JSON.stringify([]));
    }
  }

  getAllUsers(): AppUser[] {
    return JSON.parse(localStorage.getItem(this.localKey) || '[]');
  }

  addUser(user: AppUser): boolean {
    const users = this.getAllUsers();
    const exists = users.find(u => u.email === user.email);
    if (exists) return false;

    users.push(user);
    localStorage.setItem(this.localKey, JSON.stringify(users));
    return true;
  }

  updateUserRole(email: string, role: 'user' | 'admin') {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      user.role = role;
      localStorage.setItem(this.localKey, JSON.stringify(users));
    }
  }

  getUserByEmail(email: string): AppUser | undefined {
    return this.getAllUsers().find(user => user.email === email);
  }

  validateUser(email: string, password: string): AppUser | null {
    const user = this.getAllUsers().find(
      u => u.email === email && u.password === password
    );
    return user || null;
  }

  deleteUser(email: string) {
  const users = this.getAllUsers();
  const updatedUsers = users.filter(u => u.email !== email);
  localStorage.setItem('users', JSON.stringify(updatedUsers));
}

}
