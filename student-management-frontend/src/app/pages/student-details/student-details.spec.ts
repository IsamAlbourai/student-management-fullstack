import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';

import { of } from 'rxjs';

import { StudentDetails } from './student-details';

import { Student } from '../../models/student';

import { StudentProfile } from '../../models/student-profile';

import { StudentService } from '../../services/student.service';

import { StudentProfileService } from '../../services/student-profile.service';

import { AuthService } from '../../services/auth.service';

describe('StudentDetails', () => {
  let component: StudentDetails;

  let fixture: ComponentFixture<StudentDetails>;

  let router: Router;

  const mockStudent: Student = {
    id: 1,

    name: 'Sam',

    age: 22,

    course: 'Software Engineering',

    departmentId: 1,

    departmentName: 'Computer Science',
  };

  const mockProfile: StudentProfile = {
    id: 5,

    email: 'sam@example.com',

    phoneNumber: '+968 91234567',

    studentId: 1,

    studentName: 'Sam',
  };

  const mockStudentService = {
    getStudentById: () => of(mockStudent),

    deleteStudent: () => of(undefined),
  };

  const mockStudentProfileService = {
    getProfileByStudentId: () => of(mockProfile),

    createProfile: () => of(mockProfile),

    updateProfile: () =>
      of({
        ...mockProfile,
        email: 'sam.updated@example.com',
      }),
  };

  const mockAuthService = {
    isAdmin: () => true,
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

        {
          provide: StudentProfileService,

          useValue: mockStudentProfileService,
        },

        {
          provide: AuthService,

          useValue: mockAuthService,
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

    expect(component.student()?.course).toBe('Software Engineering');
  });

  it('should load the student profile', () => {
    expect(component.profileExists()).toBe(true);

    expect(component.profile()?.email).toBe('sam@example.com');

    expect(component.profile()?.phoneNumber).toBe('+968 91234567');
  });

  it('should display the student and profile details', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Sam');

    expect(element.textContent).toContain('22');

    expect(element.textContent).toContain('Software Engineering');

    expect(element.textContent).toContain('Computer Science');

    expect(element.textContent).toContain('sam@example.com');

    expect(element.textContent).toContain('+968 91234567');

    expect(element.textContent).toContain('Edit Profile');

    expect(element.textContent).toContain('Delete Student');
  });

  it('should enter profile edit mode', () => {
    component.startProfileEdit();

    expect(component.profileEditMode()).toBe(true);

    expect(component.profileEmail).toBe('sam@example.com');

    expect(component.profilePhoneNumber).toBe('+968 91234567');
  });

  it('should update an existing profile', () => {
    const updateSpy = vi.spyOn(mockStudentProfileService, 'updateProfile');

    component.profileEmail = 'sam.updated@example.com';

    component.profilePhoneNumber = '+968 99887766';

    component.saveProfile();

    expect(updateSpy).toHaveBeenCalledWith(1, {
      email: 'sam.updated@example.com',

      phoneNumber: '+968 99887766',
    });

    expect(component.profile()?.email).toBe('sam.updated@example.com');

    expect(component.profileEditMode()).toBe(false);

    expect(component.profileSuccess()).toBe('Profile updated successfully.');
  });

  it('should delete the student and navigate back', () => {
    const deleteSpy = vi.spyOn(mockStudentService, 'deleteStudent');

    const navigateSpy = vi.spyOn(router, 'navigate');

    component.deleteStudent(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);

    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });
});
