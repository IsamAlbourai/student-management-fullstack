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
          id: 2,
          name: 'Information Technology',
        },
        {
          id: 1,
          name: 'Computer Science',
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

    updateDepartment: (id: number, name: string) =>
      of({
        id,
        name,
      }),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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

  it('should load and alphabetically sort departments', () => {
    expect(component.departments().length).toBe(3);

    expect(component.departments()[0].name).toBe('Computer Science');

    expect(component.departments()[1].name).toBe('Information Systems');

    expect(component.departments()[2].name).toBe('Information Technology');
  });

  it('should display department table headings and departments', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('ID');

    expect(element.textContent).toContain('Department Name');

    expect(element.textContent).toContain('Actions');

    expect(element.textContent).toContain('Computer Science');

    expect(element.textContent).toContain('Information Technology');

    expect(element.textContent).toContain('Information Systems');
  });

  it('should create and alphabetically sort a new department', () => {
    const createSpy = vi.spyOn(mockDepartmentService, 'createDepartment');

    component.departmentName = 'Data Science';

    component.createDepartment();

    expect(createSpy).toHaveBeenCalledWith('Data Science');

    expect(component.departments().length).toBe(4);

    expect(component.departments()[0].name).toBe('Computer Science');

    expect(component.departments()[1].name).toBe('Data Science');

    expect(component.departments()[2].name).toBe('Information Systems');

    expect(component.departments()[3].name).toBe('Information Technology');

    expect(component.successMessage()).toBe('Department created successfully.');
  });

  it('should reject an empty department name', () => {
    const createSpy = vi.spyOn(mockDepartmentService, 'createDepartment');

    component.departmentName = '   ';

    component.createDepartment();

    expect(createSpy).not.toHaveBeenCalled();

    expect(component.createErrorMessage()).toBe('Department name is required.');
  });

  it('should enter edit mode for a department', () => {
    const department = component.departments()[0];

    component.startEdit(department);

    expect(component.editingDepartmentId()).toBe(department.id);

    expect(component.editingDepartmentName).toBe(department.name);
  });

  it('should cancel editing a department', () => {
    const department = component.departments()[0];

    component.startEdit(department);

    component.cancelEdit();

    expect(component.editingDepartmentId()).toBeNull();

    expect(component.editingDepartmentName).toBe('');
  });

  it('should update a department', () => {
    const updateSpy = vi.spyOn(mockDepartmentService, 'updateDepartment');

    const department = component.departments()[0];

    component.startEdit(department);

    component.editingDepartmentName = 'Computer Engineering';

    component.saveEdit(department);

    expect(updateSpy).toHaveBeenCalledWith(department.id, 'Computer Engineering');

    expect(
      component
        .departments()
        .some((currentDepartment) => currentDepartment.name === 'Computer Engineering'),
    ).toBe(true);

    expect(component.editingDepartmentId()).toBeNull();

    expect(component.successMessage()).toBe('Department updated successfully.');
  });

  it('should reject an empty edited department name', () => {
    const updateSpy = vi.spyOn(mockDepartmentService, 'updateDepartment');

    const department = component.departments()[0];

    component.startEdit(department);

    component.editingDepartmentName = '   ';

    component.saveEdit(department);

    expect(updateSpy).not.toHaveBeenCalled();

    expect(component.editErrorMessage()).toBe('Department name is required.');
  });

  it('should leave edit mode without calling the API when the name is unchanged', () => {
    const updateSpy = vi.spyOn(mockDepartmentService, 'updateDepartment');

    const department = component.departments()[0];

    component.startEdit(department);

    component.saveEdit(department);

    expect(updateSpy).not.toHaveBeenCalled();

    expect(component.editingDepartmentId()).toBeNull();
  });
});
