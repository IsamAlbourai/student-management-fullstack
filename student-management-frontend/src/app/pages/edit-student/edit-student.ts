import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Student, StudentRequest } from '../../models/student';

import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-edit-student',

  imports: [FormsModule],

  templateUrl: './edit-student.html',

  styleUrl: './edit-student.css',
})
export class EditStudent implements OnInit {
  student = signal<Student>({
    id: 0,

    name: '',

    age: 18,

    course: '',

    departmentId: 1,

    departmentName: null,
  });

  errorMessage = signal('');

  saving = signal(false);

  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Invalid student ID.');

      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student.set(data);
      },

      error: () => {
        this.errorMessage.set('Student could not be loaded.');
      },
    });
  }

  updateStudent(): void {
    const currentStudent = this.student();

    if (currentStudent.departmentId === null) {
      this.errorMessage.set('Department ID is required.');

      return;
    }

    const request: StudentRequest = {
      name: currentStudent.name.trim(),

      age: Number(currentStudent.age),

      course: currentStudent.course.trim(),

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

        if (error.status === 400 && error.error?.errors) {
          const messages = Object.values(error.error.errors);

          this.errorMessage.set(messages.join(' '));

          return;
        }

        this.errorMessage.set('Failed to update the student.');
      },
    });
  }
}
