import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private readonly tokenKey = 'student-management-token';

  private readonly usernameKey = 'student-management-username';

  private readonly roleKey = 'student-management-role';

  private readonly loggedInSignal = signal<boolean>(!!localStorage.getItem(this.tokenKey));

  private readonly usernameSignal = signal<string | null>(localStorage.getItem(this.usernameKey));

  private readonly roleSignal = signal<string | null>(localStorage.getItem(this.roleKey));

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);

        localStorage.setItem(this.usernameKey, response.username);

        localStorage.setItem(this.roleKey, response.role);

        this.loggedInSignal.set(true);

        this.usernameSignal.set(response.username);

        this.roleSignal.set(response.role);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);

    localStorage.removeItem(this.usernameKey);

    localStorage.removeItem(this.roleKey);

    this.loggedInSignal.set(false);
    this.usernameSignal.set(null);
    this.roleSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedInSignal();
  }

  getUsername(): string | null {
    return this.usernameSignal();
  }

  getRole(): string | null {
    return this.roleSignal();
  }

  isAdmin(): boolean {
    return this.roleSignal() === 'ADMIN';
  }
}
