import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-edit-student',
  imports: [FormsModule],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css'
})
export class EditStudent implements OnInit {

  student = signal<Student>({
    id: 0,
    name: '',
    age: 18,
    course: '',
    skills: []
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentService.getStudentById(id).subscribe(data => {
        this.student.set(data);
      });
    }
  }

  updateStudent() {
    this.studentService.updateStudent(this.student()).subscribe(() => {
      this.router.navigate(['/students']);
    });
  }

}
