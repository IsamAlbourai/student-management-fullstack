import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Student } from '../../models/student';

@Component({
  selector: 'app-student-card',
  imports: [],
  templateUrl: './student-card.html',
  styleUrl: './student-card.css',
})
export class StudentCard {
  @Input() student!: Student;

  @Output() deleteRequested = new EventEmitter<number | string>();

  requestDelete(): void {
    this.deleteRequested.emit(this.student.id);
  }
}
