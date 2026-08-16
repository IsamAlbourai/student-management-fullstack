import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DepartmentService } from './department.service';

describe('DepartmentService', () => {
  let service: DepartmentService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartmentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DepartmentService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve departments using GET', () => {
    const mockDepartments = [
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
    ];

    service.getDepartments().subscribe((departments) => {
      expect(departments).toEqual(mockDepartments);

      expect(departments.length).toBe(3);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/departments');

    expect(request.request.method).toBe('GET');

    request.flush(mockDepartments);
  });

  it('should create a department using POST', () => {
    const newDepartment = {
      id: 4,
      name: 'Data Science',
    };

    service.createDepartment('Data Science').subscribe((department) => {
      expect(department).toEqual(newDepartment);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/departments');

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual({
      name: 'Data Science',
    });

    request.flush(newDepartment);
  });
});
