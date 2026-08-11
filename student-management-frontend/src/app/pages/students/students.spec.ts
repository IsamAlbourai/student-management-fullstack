import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { Students } from './students';
import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';

describe('Students', () => {
  let component: Students;
  let fixture: ComponentFixture<Students>;

  const mockStudents: Student[] = [
    {
      id: 1,
      name: 'Sam',
      age: 22,
      course: 'Information Technology',
      skills: ['Angular', 'Java'],
    },
    {
      id: 2,
      name: 'John',
      age: 20,
      course: 'Computer Science',
      skills: ['Python'],
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

  it('should display the students in the table', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Sam');
    expect(element.textContent).toContain('John');
    expect(element.textContent).toContain('Information Technology');
    expect(element.textContent).toContain('Computer Science');
  });

  it('should filter students by name', () => {
    component.searchText = 'Sam';

    const filteredStudents = component.getFilteredStudents();

    expect(filteredStudents.length).toBe(1);
    expect(filteredStudents[0].name).toBe('Sam');
  });

  it('should filter students by course', () => {
    component.searchText = 'Computer Science';

    const filteredStudents = component.getFilteredStudents();

    expect(filteredStudents.length).toBe(1);
    expect(filteredStudents[0].name).toBe('John');
  });
});
