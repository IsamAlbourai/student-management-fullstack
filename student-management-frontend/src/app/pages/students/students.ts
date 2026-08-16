import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatDialog } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatTableModule } from '@angular/material/table';

import { Student } from '../../models/student';

import { StudentService } from '../../services/student.service';

import { AuthService } from '../../services/auth.service';

import { ConfirmDialog, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-students',

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],

  templateUrl: './students.html',

  styleUrl: './students.css',
})
export class Students implements OnInit {
  students = signal<Student[]>([]);

  searchText = '';

  isLoading = signal(false);

  deletingStudentId = signal<number | null>(null);

  errorMessage = signal('');

  displayedColumns: string[] = [];

  constructor(
    private studentService: StudentService,

    private route: ActivatedRoute,

    private dialog: MatDialog,

    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.authService.isAdmin()
      ? ['id', 'name', 'age', 'course', 'department', 'actions']
      : ['id', 'name', 'age', 'course', 'department'];

    const course = this.route.snapshot.queryParamMap.get('course');

    if (course) {
      this.searchText = course;
    }

    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);

    this.errorMessage.set('');

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);

        this.isLoading.set(false);
      },

      error: (error) => {
        this.isLoading.set(false);

        if (error.status === 0) {
          this.errorMessage.set(
            'Unable to connect to the server. Please make sure the backend is running.',
          );

          return;
        }

        this.errorMessage.set('Failed to load students. Please try again.');
      },
    });
  }

  getFilteredStudents(): Student[] {
    const text = this.searchText.toLowerCase().trim();

    return this.students().filter(
      (student) =>
        student.name.toLowerCase().includes(text) ||
        student.course.toLowerCase().includes(text) ||
        (student.departmentName ?? '').toLowerCase().includes(text),
    );
  }

  openDeleteDialog(student: Student): void {
    if (this.deletingStudentId() !== null) {
      return;
    }

    const dialogData: ConfirmDialogData = {
      studentName: student.name,
    };

    const dialogReference = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: dialogData,
    });

    dialogReference.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteStudent(student.id);
      }
    });
  }

  deleteStudent(id: number): void {
    this.deletingStudentId.set(id);

    this.errorMessage.set('');

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students.update((students) => students.filter((student) => student.id !== id));

        this.deletingStudentId.set(null);
      },

      error: (error) => {
        this.deletingStudentId.set(null);

        if (error.status === 404) {
          this.errorMessage.set('That student no longer exists. Refresh the list and try again.');

          return;
        }

        this.errorMessage.set('Failed to delete the student. Please try again.');
      },
    });
  }
}
