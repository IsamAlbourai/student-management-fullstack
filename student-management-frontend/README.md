# Student Management System

A modern Student Management System built with Angular 22.

The application allows users to view, add, edit, search, inspect, and delete student records. It uses JSON Server as a temporary REST API and Angular Material for the user interface.

## Features

- View all students
- Search students by name or course
- View individual student details
- Add new students
- Edit existing students
- Delete students with a confirmation dialog
- Add multiple skills using a dynamic FormArray
- Form validation and custom validators
- Loading and error messages
- Route guards
- Route parameters and query parameters
- Lazy-loaded About page
- Responsive Angular Material interface
- Unit and HTTP testing

## Technologies Used

- Angular 22
- TypeScript
- Angular Material
- Reactive Forms
- Template-Driven Forms
- RxJS
- HttpClient
- JSON Server
- Vitest
- Git and GitHub

## Angular Concepts Demonstrated

- Standalone components
- Components and templates
- Data binding
- Built-in and custom directives
- Built-in pipes and async pipe
- Services and dependency injection
- RxJS Observables
- Lifecycle hooks
- Angular Router
- Route parameters
- Query parameters
- Lazy loading
- Route guards
- Template-driven forms
- Reactive forms
- FormGroup
- FormControl
- FormBuilder
- FormArray
- Built-in and custom validators
- HTTP GET, POST, PUT, and DELETE
- HTTP headers
- HTTP interceptors
- Error handling
- Signals
- Input and Output decorators
- EventEmitter
- ViewChild
- Template reference variables
- Content projection
- Angular Material components
- Component and service testing
- Mock HTTP testing

## Project Structure

```text
src/app
├── components
│   ├── confirm-dialog
│   ├── page-card
│   └── student-card
├── directives
│   └── invalid-field
├── guards
│   └── auth-guard
├── interceptors
│   └── auth-interceptor
├── models
│   └── student
├── pages
│   ├── about
│   ├── add-student
│   ├── dashboard
│   ├── edit-student
│   ├── reactive-form
│   ├── student-details
│   └── students
├── services
│   └── student.service
├── validators
│   └── name.validator
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.ts
