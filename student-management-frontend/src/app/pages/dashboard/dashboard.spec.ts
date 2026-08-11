import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Dashboard } from './dashboard';
import { StudentService } from '../../services/student.service';
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

  it('should display the dashboard action links', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('View Students');
    expect(element.textContent).toContain('Add Student');
    expect(element.textContent).toContain('Computer Science');
    expect(element.textContent).toContain('Information Technology');
  });
});
