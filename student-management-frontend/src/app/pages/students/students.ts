import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

import { ConfirmDialog, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-students',
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students implements OnInit {
  students = signal<Student[]>([]);

  searchText = '';

  isLoading = signal(false);

  errorMessage = signal('');

  displayedColumns: string[] = ['id', 'name', 'age', 'course', 'actions'];

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
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
      error: () => {
        this.errorMessage.set('Failed to load students. Please check if the API is running.');

        this.isLoading.set(false);
      },
    });
  }

  getFilteredStudents(): Student[] {
    const text = this.searchText.toLowerCase().trim();

    return this.students().filter(
      (student) =>
        student.name.toLowerCase().includes(text) || student.course.toLowerCase().includes(text),
    );
  }

  openDeleteDialog(student: Student): void {
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

  deleteStudent(id: number | string): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: () => {
        this.errorMessage.set('Failed to delete student.');
      },
    });
  }
}
