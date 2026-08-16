import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentProfileService } from './student-profile.service';

describe('StudentProfileService', () => {
  let service: StudentProfileService;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentProfileService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StudentProfileService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a profile by student ID', () => {
    const mockProfile = {
      id: 2,

      email: 'yusuf@example.com',

      phoneNumber: '+968 91234567',

      studentId: 9,

      studentName: 'Yusuf',
    };

    service.getProfileByStudentId(9).subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/profiles/student/9');

    expect(request.request.method).toBe('GET');

    request.flush(mockProfile);
  });

  it('should create a profile using POST', () => {
    const requestBody = {
      email: 'yusuf@example.com',

      phoneNumber: '+968 91234567',
    };

    const mockProfile = {
      id: 2,

      ...requestBody,

      studentId: 9,

      studentName: 'Yusuf',
    };

    service.createProfile(9, requestBody).subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/profiles/student/9');

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(requestBody);

    request.flush(mockProfile);
  });

  it('should update a profile using PUT', () => {
    const requestBody = {
      email: 'yusuf.updated@example.com',

      phoneNumber: '+968 99887766',
    };

    const mockProfile = {
      id: 2,

      ...requestBody,

      studentId: 9,

      studentName: 'Yusuf',
    };

    service.updateProfile(9, requestBody).subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const request = httpTestingController.expectOne('http://localhost:8080/api/profiles/student/9');

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(requestBody);

    request.flush(mockProfile);
  });
});
