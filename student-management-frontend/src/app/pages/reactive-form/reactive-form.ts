import { Component, ElementRef, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { nameValidator } from '../../validators/name.validator';

@Component({
  selector: 'app-reactive-form',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css',
})
export class ReactiveForm {
  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  studentForm;

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
  ) {
    this.studentForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), nameValidator]],
      age: [18, [Validators.required, Validators.min(18)]],
      course: ['', Validators.required],
      skills: this.formBuilder.array([]),
    });
  }

  get skills(): FormArray {
    return this.studentForm.get('skills') as FormArray;
  }

  focusNameInput(): void {
    this.nameInput.nativeElement.focus();
  }

  addSkill(): void {
    this.skills.push(this.formBuilder.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formValue = this.studentForm.value;
    const skills = (formValue.skills ?? []) as string[];

    const newStudent: Student = {
      id: '',
      name: formValue.name ?? '',
      age: Number(formValue.age),
      course: formValue.course ?? '',
      skills,
    };

    this.studentService.addStudent(newStudent).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: () => {
        alert('Failed to add the student.');
      },
    });
  }
}
