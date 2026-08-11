import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { StudentCard } from '../../components/student-card/student-card';

@Component({
  selector: 'app-student-details',
  imports: [RouterLink, StudentCard],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit {
  student = signal<Student | undefined>(undefined);

  isLoading = signal(true);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Invalid student ID.');
      this.isLoading.set(false);
      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Student could not be found.');
        this.isLoading.set(false);
      },
    });
  }

  deleteStudent(id: number | string): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: () => {
        this.errorMessage.set('Failed to delete the student.');
      },
    });
  }
}
