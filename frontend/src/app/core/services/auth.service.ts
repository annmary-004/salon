import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  private apiUrl = 'https://salon-backend-kxh1.onrender.com/api/auth';

  constructor(private router: Router, private http: HttpClient) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${this.apiUrl}/profile`).subscribe({
        next: (user: any) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          this.isAdmin.set(user.role === 'admin');
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res as any);
        this.isAuthenticated.set(true);
        this.isAdmin.set(res.role === 'admin');
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.isAdmin.set(false);
    this.router.navigate(['/auth']);
  }
}
