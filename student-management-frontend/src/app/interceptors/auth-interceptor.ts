import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const modifiedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'X-App-Name': 'Student Management System'
    }
  });

  return next(modifiedRequest);

};
