import { Component, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = signal(false);

  errorMessage = signal('');

  loginForm;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],

      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    const username = (this.loginForm.value.username ?? '').trim();

    const password = this.loginForm.value.password ?? '';

    if (!username) {
      this.loginForm.get('username')?.setErrors({
        required: true,
      });

      this.loginForm.get('username')?.markAsTouched();

      return;
    }

    this.loginForm.patchValue({
      username,
    });

    this.loading.set(true);

    this.errorMessage.set('');

    this.authService
      .login({
        username,
        password,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);

          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.loading.set(false);

          this.errorMessage.set('Invalid username or password.');

          this.loginForm.patchValue({
            password: '',
          });

          this.loginForm.get('password')?.markAsUntouched();
        },
      });
  }
}
