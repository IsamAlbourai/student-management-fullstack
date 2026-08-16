import { Component } from '@angular/core';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
