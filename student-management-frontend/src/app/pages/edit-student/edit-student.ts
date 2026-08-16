import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { Department } from '../../models/department';

import { Student, StudentRequest } from '../../models/student';

import { DepartmentService } from '../../services/department.service';

import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-edit-student',

  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],

  templateUrl: './edit-student.html',

  styleUrl: './edit-student.css',
})
export class EditStudent implements OnInit {
  student = signal<Student>({
    id: 0,
    name: '',
    age: 18,
    course: '',
    departmentId: null,
    departmentName: null,
  });

  departments = signal<Department[]>([]);

  loadingStudent = signal(true);

  loadingDepartments = signal(true);

  studentLoadError = signal('');

  departmentError = signal('');

  errorMessage = signal('');

  saving = signal(false);

  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private studentService: StudentService,

    private departmentService: DepartmentService,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();

    this.loadStudent();
  }

  loadDepartments(): void {
    this.loadingDepartments.set(true);

    this.departmentError.set('');

    this.departments.set([]);

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        const sortedDepartments = [...departments].sort((first, second) =>
          first.name.localeCompare(second.name),
        );

        this.departments.set(sortedDepartments);

        this.loadingDepartments.set(false);

        if (sortedDepartments.length === 0) {
          this.departmentError.set(
            'No departments are available. Create a department before editing this student.',
          );
        }
      },

      error: (error) => {
        this.loadingDepartments.set(false);

        if (error.status === 0) {
          this.departmentError.set(
            'Unable to connect to the server. Please make sure the backend is running.',
          );

          return;
        }

        this.departmentError.set('Failed to load departments. Please try again.');
      },
    });
  }

  loadStudent(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.studentLoadError.set('Invalid student ID.');

      this.loadingStudent.set(false);

      return;
    }

    this.studentLoadError.set('');

    this.loadingStudent.set(true);

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student.set(data);

        this.loadingStudent.set(false);
      },

      error: (error) => {
        this.loadingStudent.set(false);

        if (error.status === 404) {
          this.studentLoadError.set('Student could not be found.');

          return;
        }

        if (error.status === 0) {
          this.studentLoadError.set(
            'Unable to connect to the server. Please make sure the backend is running.',
          );

          return;
        }

        this.studentLoadError.set('Failed to load the student. Please try again.');
      },
    });
  }

  updateStudent(): void {
    const currentStudent = this.student();

    const name = currentStudent.name.trim();

    const course = currentStudent.course.trim();

    if (!name) {
      this.errorMessage.set('Student name is required.');

      return;
    }

    if (currentStudent.age < 18 || currentStudent.age > 120) {
      this.errorMessage.set('Age must be between 18 and 120.');

      return;
    }

    if (!course) {
      this.errorMessage.set('Course is required.');

      return;
    }

    if (currentStudent.departmentId === null) {
      this.errorMessage.set('Department is required.');

      return;
    }

    const request: StudentRequest = {
      name,

      age: Number(currentStudent.age),

      course,

      departmentId: Number(currentStudent.departmentId),
    };

    this.errorMessage.set('');

    this.saving.set(true);

    this.studentService.updateStudent(currentStudent.id, request).subscribe({
      next: () => {
        this.saving.set(false);

        this.router.navigate(['/students']);
      },

      error: (error) => {
        this.saving.set(false);

        if (error.status === 0) {
          this.errorMessage.set(
            'Unable to connect to the server. Please try again when the backend is available.',
          );

          return;
        }

        if (error.status === 400 && error.error?.errors) {
          const messages = Object.values(error.error.errors);

          this.errorMessage.set(messages.join(' '));

          return;
        }

        if (error.status === 404) {
          this.errorMessage.set('The student or selected department could not be found.');

          return;
        }

        this.errorMessage.set('Failed to update the student. Please try again.');
      },
    });
  }
}
