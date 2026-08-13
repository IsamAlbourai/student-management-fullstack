import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { Dashboard } from './dashboard';

import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

import { Student } from '../../models/student';

describe('Dashboard', () => {
  let component: Dashboard;

  let fixture: ComponentFixture<Dashboard>;

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

  const mockStudentService = {
    getStudents: () => of(mockStudents),
  };

  const mockAuthService = {
    isAdmin: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],

      providers: [
        provideRouter([]),

        {
          provide: StudentService,
          useValue: mockStudentService,
        },

        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total number of students', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Total Students:');

    expect(element.textContent).toContain('2');
  });

  it('should display normal dashboard links for a user', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('View Students');

    expect(element.textContent).not.toContain('Add Student');

    expect(element.textContent).toContain('Computer Science');

    expect(element.textContent).toContain('Information Technology');
  });
});
