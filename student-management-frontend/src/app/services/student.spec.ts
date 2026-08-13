import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Student } from '../models/student';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StudentService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve students using GET', () => {
    const mockStudents: Student[] = [
      {
        id: 1,
        name: 'Sam',
        age: 22,
        course: 'Information Technology',
        departmentId: 1,
        departmentName: 'Computer Science',
      },

      {
        id: 2,
        name: 'John',
        age: 20,
        course: 'Computer Science',
        departmentId: 1,
        departmentName: 'Computer Science',
      },
    ];

    service.getStudents().subscribe((students) => {
      expect(students).toEqual(mockStudents);

      expect(students.length).toBe(2);

      expect(students[0].name).toBe('Sam');
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/students');

    expect(request.request.method).toBe('GET');

    request.flush(mockStudents);
  });
});
