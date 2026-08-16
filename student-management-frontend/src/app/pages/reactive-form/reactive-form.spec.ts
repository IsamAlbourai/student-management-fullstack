import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { ReactiveForm } from './reactive-form';

import { StudentService } from '../../services/student.service';

import { DepartmentService } from '../../services/department.service';

describe('ReactiveForm', () => {
  let component: ReactiveForm;

  let fixture: ComponentFixture<ReactiveForm>;

  const mockStudentService = {
    addStudent: () =>
      of({
        id: 10,
        name: 'Ahmed Ali',
        age: 23,
        course: 'Software Engineering',
        departmentId: 1,
        departmentName: 'Computer Science',
      }),
  };

  const mockDepartmentService = {
    getDepartments: () =>
      of([
        {
          id: 1,
          name: 'Computer Science',
        },
        {
          id: 2,
          name: 'Information Technology',
        },
        {
          id: 3,
          name: 'Information Systems',
        },
      ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveForm],

      providers: [
        provideRouter([]),

        {
          provide: StudentService,

          useValue: mockStudentService,
        },

        {
          provide: DepartmentService,

          useValue: mockDepartmentService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveForm);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load departments', () => {
    expect(component.departments().length).toBe(3);

    expect(component.departments()[0].name).toBe('Computer Science');
  });

  it('should start without a selected department when multiple departments exist', () => {
    expect(component.studentForm.get('departmentId')?.value).toBeNull();
  });
});
