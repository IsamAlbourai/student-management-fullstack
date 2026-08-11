import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AddStudent } from './add-student';
import { StudentService } from '../../services/student.service';

describe('AddStudent', () => {
  let component: AddStudent;
  let fixture: ComponentFixture<AddStudent>;
  let router: Router;

  const mockStudentService = {
    addStudent: () =>
      of({
        id: 1,
        name: 'Sam',
        age: 22,
        course: 'Information Technology',
        skills: [],
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudent],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddStudent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should begin with the expected default values', () => {
    expect(component.studentName).toBe('');
    expect(component.studentAge).toBe(18);
    expect(component.studentCourse).toBe('');
  });

  it('should add a student and navigate to students', () => {
    component.studentName = 'Sam';
    component.studentAge = 22;
    component.studentCourse = 'Information Technology';

    const addSpy = vi.spyOn(mockStudentService, 'addStudent');

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.saveStudent();

    expect(addSpy).toHaveBeenCalledWith({
      id: '',
      name: 'Sam',
      age: 22,
      course: 'Information Technology',
      skills: [],
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
