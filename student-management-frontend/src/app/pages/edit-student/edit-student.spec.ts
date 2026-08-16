import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import { EditStudent } from './edit-student';

import { Student, StudentRequest } from '../../models/student';

import { StudentService } from '../../services/student.service';

import { DepartmentService } from '../../services/department.service';

describe('EditStudent', () => {
  let component: EditStudent;

  let fixture: ComponentFixture<EditStudent>;

  let router: Router;

  const mockStudent: Student = {
    id: 1,
    name: 'Sam',
    age: 22,
    course: 'Software Engineering',
    departmentId: 1,
    departmentName: 'Computer Science',
  };

  const mockStudentService = {
    getStudentById: () => of(mockStudent),

    updateStudent: (id: number, request: StudentRequest) =>
      of({
        ...mockStudent,
        id,
        ...request,
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

  const mockActivatedRoute = {
    snapshot: {
      paramMap: convertToParamMap({
        id: '1',
      }),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStudent],

      providers: [
        provideRouter([]),

        {
          provide: ActivatedRoute,

          useValue: mockActivatedRoute,
        },

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

    fixture = TestBed.createComponent(EditStudent);

    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the student using the route ID', () => {
    expect(component.student().id).toBe(1);

    expect(component.student().name).toBe('Sam');

    expect(component.student().departmentId).toBe(1);
  });

  it('should load the departments', () => {
    expect(component.departments().length).toBe(3);

    expect(component.departments()[1].name).toBe('Information Technology');
  });

  it('should keep the current student department selected', () => {
    expect(component.student().departmentId).toBe(1);
  });

  it('should update the student and navigate to students', () => {
    const updateSpy = vi.spyOn(mockStudentService, 'updateStudent');

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.updateStudent();

    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: 'Sam',
      age: 22,
      course: 'Software Engineering',
      departmentId: 1,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
