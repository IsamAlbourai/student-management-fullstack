import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { StudentDetails } from './pages/student-details/student-details';
import { EditStudent } from './pages/edit-student/edit-student';
import { ReactiveForm } from './pages/reactive-form/reactive-form';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'students',
    component: Students,
  },
  {
    path: 'students/:id/edit',
    component: EditStudent,
  },
  {
    path: 'students/:id',
    component: StudentDetails,
  },
  {
    path: 'add-student',
    component: ReactiveForm,
    canActivate: [authGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((module) => module.About),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
