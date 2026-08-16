# Student Management System

A full-stack Student Management System built with Angular and Spring Boot.

The application provides secure role-based access for managing students, departments, and student profiles. It includes JWT authentication, form validation, REST APIs, database persistence, automated testing, and a responsive Angular Material user interface.

## Features

### Authentication and Authorization

- JWT-based authentication
- Role-based authorization
- USER and ADMIN roles
- Protected Angular routes
- HTTP interceptor for JWT authentication
- Backend endpoint protection with Spring Security
- Login and logout functionality

### Student Management

- View all students
- Search students by name, course, or department
- View individual student details
- Add students
- Edit students
- Delete students with confirmation
- Assign students to departments
- Input validation and API error handling

### Department Management

- View available departments
- Create new departments
- Alphabetically sorted department list
- Department validation
- Students linked to departments through a database relationship

### Student Profiles

- View student profile information
- Create profiles
- Update profiles
- Email and phone number information
- One-to-one relationship between students and profiles
- Proper handling of missing profiles

### User Interface

- Angular Material components
- Responsive navigation
- Active-page navigation highlighting
- Loading states
- Error and success messages
- Confirmation dialogs
- Responsive student table
- Admin-only controls hidden from regular users

## Technology Stack

### Frontend

- Angular 22
- TypeScript 6
- Angular Material
- Angular CDK
- RxJS
- Reactive Forms
- Template-driven Forms
- Angular Router
- Vitest

### Backend

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- Hibernate
- Spring Security
- JWT authentication
- Jakarta Validation
- Maven

### Database

- Microsoft SQL Server
- H2 Database for automated backend tests

## Project Structure

```text
student-management-fullstack/
│
├── student-management-frontend/
│   ├── src/
│   ├── package.json
│   └── angular.json
│
├── student-management-backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
└── README.md
```

## Roles

The project currently contains two demonstration users.

| Username | Password | Role |
|---|---|---|
| `student` | `student123` | USER |
| `admin` | `admin123` | ADMIN |

### USER permissions

A regular user can:

- Sign in
- View students
- Search students
- View student details
- View departments
- View student profiles

### ADMIN permissions

An administrator can perform all USER actions and can also:

- Add students
- Edit students
- Delete students
- Create departments
- Create student profiles
- Update student profiles

Authorization is enforced by both the Angular frontend and the Spring Boot backend.

## Running the Project

### Requirements

Install the following before running the application:

- Java 21
- Node.js
- npm
- Microsoft SQL Server
- Git

## Database Setup

Create a SQL Server database named:

```text
student_management_db
```

The backend expects SQL Server on port:

```text
1433
```

The database configuration can be found in:

```text
student-management-backend/src/main/resources/application.properties
```

The application supports these environment variables:

```text
DB_HOST=localhost
DB_USERNAME=sa
DB_PASSWORD=your_sql_server_password
JWT_SECRET=your_secure_jwt_secret
```

`DB_HOST` defaults to:

```text
localhost
```

`DB_USERNAME` defaults to:

```text
sa
```

The database password and JWT signing secret do not have default values and must be supplied through environment variables.

Hibernate is configured to update the database schema automatically.

## Running the Backend

Open a terminal in:

```text
student-management-backend
```

### Windows PowerShell

Set the environment variables for the current terminal session:

```powershell
$env:DB_HOST="localhost"
$env:DB_USERNAME="sa"
$env:DB_PASSWORD="your_sql_server_password"
$env:JWT_SECRET="your_secure_jwt_secret"
```

Then start the backend:

```powershell
.\mvnw.cmd spring-boot:run
```

### macOS / Linux

Set the environment variables:

```bash
export DB_HOST=localhost
export DB_USERNAME=sa
export DB_PASSWORD=your_sql_server_password
export JWT_SECRET=your_secure_jwt_secret
```

Then start the backend:

```bash
./mvnw spring-boot:run
```

The backend runs at:

```text
http://localhost:8080
```

If your SQL Server is running on another machine or hostname, change `DB_HOST` instead of editing `application.properties`.

## Running the Frontend

Open another terminal in:

```text
student-management-frontend
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
npm start
```

The frontend runs at:

```text
http://localhost:4200
```

The frontend is configured to communicate with the backend at:

```text
http://localhost:8080
```

## REST API

The main API groups are:

```text
/api/auth
/api/students
/api/departments
/api/profiles
```

Authentication endpoints are public.

Student, department, and profile endpoints require a valid JWT.

Write operations are restricted to administrators.

## Authentication

Login requests are sent to:

```text
POST /api/auth/login
```

A successful login returns a JWT.

The Angular application stores and sends the token through its authentication service and HTTP interceptor.

The backend uses stateless authentication, so no server-side HTTP session is required.

## Testing

### Frontend Tests

From:

```text
student-management-frontend
```

Run:

```bash
npm test -- --watch=false
```

Current frontend test suite:

```text
57 tests
```

### Frontend Production Build

Run:

```bash
npm run build
```

The production build is generated in the Angular `dist` directory.

The current build may show Angular's default initial bundle-size budget warning. This does not prevent the build from completing successfully.

### Backend Tests

From:

```text
student-management-backend
```

On Windows:

```powershell
.\mvnw.cmd test
```

On macOS/Linux:

```bash
./mvnw test
```

Current backend test suite:

```text
45 tests
```

Backend tests use an H2 test database so they do not depend on the development SQL Server database.

## Security

The application uses Spring Security with stateless JWT authentication.

Passwords for the demonstration users are encoded with BCrypt inside the running backend.

API permissions are enforced server-side.

Hiding administrator controls in the Angular interface improves the user experience, but security does not depend on the frontend. The backend independently rejects unauthorized write requests.

Sensitive values such as the SQL Server password and JWT signing secret are supplied through environment variables rather than committed to the repository.

Environment files are excluded through `.gitignore`.

## Validation and Error Handling

The application includes validation and error handling on both the frontend and backend.

Examples include:

- Required student names
- Student age limits
- Required courses
- Required departments
- Missing students
- Missing student profiles
- Duplicate departments
- Invalid login credentials
- Unauthorized requests
- Forbidden operations
- Backend connection failures
- Loading failures
- Save and update failures

The backend uses appropriate HTTP status codes including:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

The Angular frontend presents user-friendly messages for these situations.

## Main Data Relationships

### Student and Department

Multiple students can belong to one department.

```text
Department
    1
    |
    |
    *
Student
```

### Student and Student Profile

Each student can have one student profile.

```text
Student
    1
    |
    |
    1
StudentProfile
```

## Development Highlights

This project includes practical implementations of:

- Angular standalone components
- Angular routing
- Route guards
- Reactive forms
- Template-driven forms
- Custom validation
- HTTP services
- HTTP interceptors
- Angular signals
- Angular Material
- Spring Boot REST controllers
- DTOs
- Spring Data JPA repositories
- Entity relationships
- Global exception handling
- Jakarta Bean Validation
- Spring Security
- JWT generation and validation
- Role-based access control
- SQL Server persistence
- H2 testing
- Unit and integration-style tests
- Git and GitHub workflow

## Future Version

A separate version of this project will add Docker support for containerized deployment.

The current repository intentionally represents the completed:

```text
Angular + Spring Boot + SQL Server
```

version without Docker.

## Purpose

This project was created as a practical full-stack development project covering:

- Frontend development with Angular
- Backend development with Spring Boot
- REST API design
- Relational database design
- JPA entity relationships
- Authentication and authorization
- JWT security
- Form validation
- Error handling
- Automated testing
- Frontend/backend integration
- Git and GitHub workflow