import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import { EditStudent } from './edit-student';

import { Student, StudentRequest } from '../../models/student';

import { StudentService } from '../../services/student.service';

describe('EditStudent', () => {
  let component: EditStudent;

  let fixture: ComponentFixture<EditStudent>;

  let router: Router;

  const mockStudent: Student = {
    id: 1,
    name: 'Sam',
    age: 22,
    course: 'Information Technology',
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

    expect(component.student().age).toBe(22);

    expect(component.student().course).toBe('Information Technology');

    expect(component.student().departmentId).toBe(1);
  });

  it('should display the student information in the form', () => {
    const inputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');

    expect(inputs[0].value).toBe('Sam');

    expect(inputs[1].value).toBe('22');

    expect(inputs[2].value).toBe('Information Technology');

    expect(inputs[3].value).toBe('1');
  });

  it('should update the student and navigate to students', () => {
    const updateSpy = vi.spyOn(mockStudentService, 'updateStudent');

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.updateStudent();

    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: 'Sam',
      age: 22,
      course: 'Information Technology',
      departmentId: 1,
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
