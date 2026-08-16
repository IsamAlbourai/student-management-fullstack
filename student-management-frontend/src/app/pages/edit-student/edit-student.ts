import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  Department
} from '../../models/department';

import {
  Student,
  StudentRequest
} from '../../models/student';

import {
  DepartmentService
} from '../../services/department.service';

import {
  StudentService
} from '../../services/student.service';

@Component({
  selector: 'app-edit-student',

  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],

  templateUrl: './edit-student.html',

  styleUrl: './edit-student.css',
})
export class EditStudent
  implements OnInit {

  student =
    signal<Student>({

      id: 0,

      name: '',

      age: 18,

      course: '',

      departmentId: null,

      departmentName: null,
    });

  departments =
    signal<Department[]>([]);

  loadingStudent =
    signal(true);

  loadingDepartments =
    signal(true);

  departmentError =
    signal('');

  errorMessage =
    signal('');

  saving =
    signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private departmentService: DepartmentService,
  ) {
  }

  ngOnInit(): void {

    this.loadDepartments();

    this.loadStudent();
  }

  loadDepartments(): void {

    this.loadingDepartments.set(true);

    this.departmentError.set('');

    this.departmentService
      .getDepartments()
      .subscribe({

        next: departments => {

          this.departments.set(
            departments
          );

          this.loadingDepartments.set(
            false
          );
        },

        error: () => {

          this.loadingDepartments.set(
            false
          );

          this.departmentError.set(
            'Failed to load departments.'
          );
        }

      });
  }

  loadStudent(): void {

    const id =
      this.route.snapshot
        .paramMap
        .get('id');

    if (!id) {

      this.errorMessage.set(
        'Invalid student ID.'
      );

      this.loadingStudent.set(
        false
      );

      return;
    }

    this.studentService
      .getStudentById(id)
      .subscribe({

        next: data => {

          this.student.set(data);

          this.loadingStudent.set(
            false
          );
        },

        error: () => {

          this.errorMessage.set(
            'Student could not be loaded.'
          );

          this.loadingStudent.set(
            false
          );
        }

      });
  }

  updateStudent(): void {

    const currentStudent =
      this.student();

    if (
      currentStudent.departmentId === null
    ) {

      this.errorMessage.set(
        'Department is required.'
      );

      return;
    }

    const request:
      StudentRequest = {

      name:
        currentStudent
          .name
          .trim(),

      age:
        Number(
          currentStudent.age
        ),

      course:
        currentStudent
          .course
          .trim(),

      departmentId:
        Number(
          currentStudent
            .departmentId
        )
    };

    this.errorMessage.set('');

    this.saving.set(true);

    this.studentService
      .updateStudent(
        currentStudent.id,
        request
      )
      .subscribe({

        next: () => {

          this.saving.set(false);

          this.router.navigate([
            '/students'
          ]);
        },

        error: error => {

          this.saving.set(false);

          if (
            error.status === 400
            &&
            error.error?.errors
          ) {

            const messages =
              Object.values(
                error.error.errors
              );

            this.errorMessage.set(
              messages.join(' ')
            );

            return;
          }

          if (
            error.status === 404
          ) {

            this.errorMessage.set(
              'The selected department could not be found.'
            );

            return;
          }

          this.errorMessage.set(
            'Failed to update the student.'
          );
        }

      });
  }
}
