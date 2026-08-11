import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-add-student',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  studentName = '';

  studentAge = 18;

  studentCourse = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
  ) {}

  saveStudent(): void {
    const newStudent: Student = {
      id: '',
      name: this.studentName,
      age: this.studentAge,
      course: this.studentCourse,
      skills: [],
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
