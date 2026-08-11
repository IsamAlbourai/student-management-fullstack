import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { PageCard } from '../../components/page-card/page-card';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, RouterLink, MatButtonModule, PageCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  students$: Observable<Student[]>;

  constructor(private studentService: StudentService) {
    this.students$ = this.studentService.getStudents();
  }
}
