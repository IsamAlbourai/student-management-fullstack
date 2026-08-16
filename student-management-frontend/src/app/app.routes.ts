import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { StudentDetails } from './pages/student-details/student-details';
import { EditStudent } from './pages/edit-student/edit-student';
import { ReactiveForm } from './pages/reactive-form/reactive-form';
import { Departments } from './pages/departments/departments';
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
    canActivate: [authGuard],
  },

  {
    path: 'students',
    component: Students,
    canActivate: [authGuard],
  },

  {
    path: 'students/:id/edit',
    component: EditStudent,
    canActivate: [adminGuard],
  },

  {
    path: 'students/:id',
    component: StudentDetails,
    canActivate: [authGuard],
  },

  {
    path: 'add-student',
    component: ReactiveForm,
    canActivate: [adminGuard],
  },

  {
    path: 'departments',
    component: Departments,
    canActivate: [adminGuard],
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
