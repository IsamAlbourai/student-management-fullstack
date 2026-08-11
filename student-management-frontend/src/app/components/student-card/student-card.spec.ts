import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCard } from './student-card';
import { Student } from '../../models/student';

describe('StudentCard', () => {
  let component: StudentCard;
  let fixture: ComponentFixture<StudentCard>;

  const mockStudent: Student = {
    id: 1,
    name: 'Sam',
    age: 22,
    course: 'Information Technology',
    skills: ['Angular', 'Java'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCard);
    component = fixture.componentInstance;

    component.student = mockStudent;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the student information', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Sam');
    expect(element.textContent).toContain('22');
    expect(element.textContent).toContain('Information Technology');
    expect(element.textContent).toContain('Angular, Java');
  });

  it('should emit the student ID when delete is requested', () => {
    let emittedId: number | string | undefined;

    component.deleteRequested.subscribe((id) => {
      emittedId = id;
    });

    component.requestDelete();

    expect(emittedId).toBe(1);
  });
});
