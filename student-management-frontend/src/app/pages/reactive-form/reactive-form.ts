import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Department } from '../../models/department';
import { StudentRequest } from '../../models/student';

import { DepartmentService } from '../../services/department.service';
import { StudentService } from '../../services/student.service';

import { nameValidator } from '../../validators/name.validator';

@Component({
  selector: 'app-reactive-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],

  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
})
export class ReactiveForm implements OnInit {
  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  departments = signal<Department[]>([]);

  loadingDepartments = signal(true);

  departmentError = signal('');

  errorMessage = signal('');

  saving = signal(false);

  studentForm;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private router: Router,
  ) {
    this.studentForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100), nameValidator],
      ],

      age: [18, [Validators.required, Validators.min(18), Validators.max(120)]],

      course: ['', [Validators.required, Validators.maxLength(100)]],

      departmentId: [null as number | null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loadingDepartments.set(true);

    this.departmentError.set('');

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);

        this.loadingDepartments.set(false);

        if (departments.length === 1) {
          this.studentForm.patchValue({
            departmentId: departments[0].id,
          });
        }
      },

      error: () => {
        this.loadingDepartments.set(false);

        this.departmentError.set('Failed to load departments.');
      },
    });
  }

  focusNameInput(): void {
    this.nameInput.nativeElement.focus();
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();

      return;
    }

    this.errorMessage.set('');

    this.saving.set(true);

    const formValue = this.studentForm.getRawValue();

    const newStudent: StudentRequest = {
      name: (formValue.name ?? '').trim(),

      age: Number(formValue.age),

      course: (formValue.course ?? '').trim(),

      departmentId: Number(formValue.departmentId),
    };

    this.studentService.addStudent(newStudent).subscribe({
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

        if (error.status === 404) {
          this.errorMessage.set('The selected department could not be found.');

          return;
        }

        this.errorMessage.set('Failed to add the student.');
      },
    });
  }
}
