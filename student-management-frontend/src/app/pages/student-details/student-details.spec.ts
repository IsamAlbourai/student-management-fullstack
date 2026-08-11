import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetails } from './student-details';
import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

describe('StudentDetails', () => {
  let component: StudentDetails;
  let fixture: ComponentFixture<StudentDetails>;
  let router: Router;

  const mockStudent: Student = {
    id: 1,
    name: 'Sam',
    age: 22,
    course: 'Information Technology',
    skills: ['Angular', 'Java'],
  };

  const mockStudentService = {
    getStudentById: () => of(mockStudent),
    deleteStudent: () => of(undefined),
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
      imports: [StudentDetails],
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

    fixture = TestBed.createComponent(StudentDetails);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the student using the route ID', () => {
    expect(component.student()?.id).toBe(1);
    expect(component.student()?.name).toBe('Sam');
    expect(component.student()?.course).toBe('Information Technology');
  });

  it('should display the student details', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Sam');
    expect(element.textContent).toContain('22');
    expect(element.textContent).toContain('Information Technology');
    expect(element.textContent).toContain('Angular, Java');
  });

  it('should delete the student and navigate back', () => {
    const deleteSpy = vi.spyOn(mockStudentService, 'deleteStudent');

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.deleteStudent(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);

    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
