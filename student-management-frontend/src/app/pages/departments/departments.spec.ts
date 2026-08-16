import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Departments } from './departments';

import { DepartmentService } from '../../services/department.service';

describe('Departments', () => {
  let component: Departments;

  let fixture: ComponentFixture<Departments>;

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

    createDepartment: (name: string) =>
      of({
        id: 4,
        name,
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departments],

      providers: [
        {
          provide: DepartmentService,

          useValue: mockDepartmentService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Departments);

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

  it('should display existing departments', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Computer Science');

    expect(element.textContent).toContain('Information Technology');

    expect(element.textContent).toContain('Information Systems');
  });

  it('should create a department', () => {
    const createSpy = vi.spyOn(mockDepartmentService, 'createDepartment');

    component.departmentName = 'Data Science';

    component.createDepartment();

    expect(createSpy).toHaveBeenCalledWith('Data Science');

    expect(component.departments().length).toBe(4);

    expect(component.departments()[3].name).toBe('Data Science');

    expect(component.successMessage()).toBe('Department created successfully.');
  });
});
