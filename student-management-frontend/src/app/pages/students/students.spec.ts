import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { Students } from './students';

import { Student } from '../../models/student';

import { StudentService } from '../../services/student.service';

import { AuthService } from '../../services/auth.service';

describe('Students', () => {
  let component: Students;

  let fixture: ComponentFixture<Students>;

  const mockStudents: Student[] = [
    {
      id: 1,
      name: 'Sam',
      age: 22,
      course: 'Software Engineering',
      departmentId: 1,
      departmentName: 'Computer Science',
    },

    {
      id: 2,
      name: 'John',
      age: 20,
      course: 'Cybersecurity',
      departmentId: 2,
      departmentName: 'Information Technology',
    },
  ];

  const mockStudentService = {
    getStudents: () => of(mockStudents),

    deleteStudent: () => of(undefined),
  };

  const mockDialog = {
    open: () => ({
      afterClosed: () => of(false),
    }),
  };

  const mockAuthService = {
    isAdmin: () => true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Students],

      providers: [
        provideRouter([]),

        {
          provide: StudentService,

          useValue: mockStudentService,
        },

        {
          provide: MatDialog,

          useValue: mockDialog,
        },

        {
          provide: AuthService,

          useValue: mockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Students);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students from the service', () => {
    expect(component.students().length).toBe(2);

    expect(component.students()[0].name).toBe('Sam');
  });

  it('should display student and department information', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Sam');

    expect(element.textContent).toContain('John');

    expect(element.textContent).toContain('Software Engineering');

    expect(element.textContent).toContain('Cybersecurity');

    expect(element.textContent).toContain('Computer Science');

    expect(element.textContent).toContain('Information Technology');

    expect(element.textContent).toContain('Department');

    expect(element.textContent).toContain('Edit');

    expect(element.textContent).toContain('Delete');
  });

  it('should filter students by name', () => {
    component.searchText = 'Sam';

    const filteredStudents = component.getFilteredStudents();

    expect(filteredStudents.length).toBe(1);

    expect(filteredStudents[0].name).toBe('Sam');
  });

  it('should filter students by course', () => {
    component.searchText = 'Cybersecurity';

    const filteredStudents = component.getFilteredStudents();

    expect(filteredStudents.length).toBe(1);

    expect(filteredStudents[0].name).toBe('John');
  });

  it('should filter students by department', () => {
    component.searchText = 'Information Technology';

    const filteredStudents = component.getFilteredStudents();

    expect(filteredStudents.length).toBe(1);

    expect(filteredStudents[0].name).toBe('John');
  });
});
