import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const token = authService.getToken();

  const isBackendRequest = request.url.startsWith('http://localhost:8080/api');

  if (token && isBackendRequest) {
    const authenticatedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,

        'X-App-Name': 'Student Management System',
      },
    });

    return next(authenticatedRequest);
  }

  if (isBackendRequest) {
    const backendRequest = request.clone({
      setHeaders: {
        'X-App-Name': 'Student Management System',
      },
    });

    return next(backendRequest);
  }

  return next(request);
};
