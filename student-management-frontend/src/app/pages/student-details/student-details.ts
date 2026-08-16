import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { Student } from '../../models/student';

import { StudentProfile, StudentProfileRequest } from '../../models/student-profile';

import { StudentService } from '../../services/student.service';

import { StudentProfileService } from '../../services/student-profile.service';

import { AuthService } from '../../services/auth.service';

import { StudentCard } from '../../components/student-card/student-card';

@Component({
  selector: 'app-student-details',

  imports: [
    FormsModule,
    RouterLink,
    StudentCard,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],

  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit {
  student = signal<Student | undefined>(undefined);

  profile = signal<StudentProfile | undefined>(undefined);

  isLoading = signal(true);

  profileLoading = signal(false);

  profileExists = signal(false);

  profileEditMode = signal(false);

  profileSaving = signal(false);

  errorMessage = signal('');

  profileError = signal('');

  profileSuccess = signal('');

  profileEmail = '';

  profilePhoneNumber = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private studentProfileService: StudentProfileService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Invalid student ID.');

      this.isLoading.set(false);

      return;
    }

    const studentId = Number(id);

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student.set(data);

        this.isLoading.set(false);

        this.loadProfile(studentId);
      },

      error: (error) => {
        this.isLoading.set(false);

        if (error.status === 404) {
          this.errorMessage.set('Student could not be found.');

          return;
        }

        this.errorMessage.set('Failed to load student details.');
      },
    });
  }

  loadProfile(studentId: number): void {
    this.profileLoading.set(true);

    this.profileError.set('');

    this.profileSuccess.set('');

    this.profile.set(undefined);

    this.profileExists.set(false);

    this.studentProfileService.getProfileByStudentId(studentId).subscribe({
      next: (profile) => {
        this.profile.set(profile);

        this.profileExists.set(true);

        this.profileEmail = profile.email;

        this.profilePhoneNumber = profile.phoneNumber;

        this.profileLoading.set(false);
      },

      error: (error) => {
        this.profileLoading.set(false);

        if (error.status === 404) {
          this.profileExists.set(false);

          return;
        }

        this.profileError.set('Failed to load the student profile. Please try again.');
      },
    });
  }

  startProfileEdit(): void {
    const profile = this.profile();

    if (profile) {
      this.profileEmail = profile.email;

      this.profilePhoneNumber = profile.phoneNumber;
    } else {
      this.profileEmail = '';

      this.profilePhoneNumber = '';
    }

    this.profileError.set('');

    this.profileSuccess.set('');

    this.profileEditMode.set(true);
  }

  cancelProfileEdit(): void {
    const profile = this.profile();

    if (profile) {
      this.profileEmail = profile.email;

      this.profilePhoneNumber = profile.phoneNumber;
    } else {
      this.profileEmail = '';

      this.profilePhoneNumber = '';
    }

    this.profileEditMode.set(false);

    this.profileError.set('');

    this.profileSuccess.set('');
  }

  saveProfile(): void {
    const student = this.student();

    if (!student) {
      return;
    }

    const email = this.profileEmail.trim();

    const phoneNumber = this.profilePhoneNumber.trim();

    if (!email) {
      this.profileError.set('Email is required.');

      return;
    }

    const request: StudentProfileRequest = {
      email,
      phoneNumber,
    };

    this.profileSaving.set(true);

    this.profileError.set('');

    this.profileSuccess.set('');

    if (this.profileExists()) {
      this.studentProfileService.updateProfile(student.id, request).subscribe({
        next: (profile) => {
          this.profile.set(profile);

          this.profileExists.set(true);

          this.profileEditMode.set(false);

          this.profileSaving.set(false);

          this.profileSuccess.set('Profile updated successfully.');
        },

        error: (error) => {
          this.profileSaving.set(false);

          if (error.status === 404) {
            this.profileExists.set(false);

            this.profileEditMode.set(false);

            this.profileError.set('This profile no longer exists. You can create a new one.');

            return;
          }

          this.profileError.set('Failed to update profile. Please try again.');
        },
      });

      return;
    }

    this.studentProfileService.createProfile(student.id, request).subscribe({
      next: (profile) => {
        this.profile.set(profile);

        this.profileExists.set(true);

        this.profileEditMode.set(false);

        this.profileSaving.set(false);

        this.profileSuccess.set('Profile created successfully.');
      },

      error: (error) => {
        this.profileSaving.set(false);

        if (error.status === 409) {
          this.profileError.set(
            'This student already has a profile. Refresh the page and try again.',
          );

          return;
        }

        if (error.status === 404) {
          this.profileError.set('The student could not be found.');

          return;
        }

        this.profileError.set('Failed to create profile. Please try again.');
      },
    });
  }

  deleteStudent(id: number): void {
    if (!this.authService.isAdmin()) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },

      error: (error) => {
        if (error.status === 404) {
          this.errorMessage.set('Student could not be found.');

          return;
        }

        this.errorMessage.set('Failed to delete the student. Please try again.');
      },
    });
  }
}
