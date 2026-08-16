import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StudentProfile, StudentProfileRequest } from '../models/student-profile';

@Injectable({
  providedIn: 'root',
})
export class StudentProfileService {
  private readonly apiUrl = 'http://localhost:8080/api/profiles';

  constructor(private http: HttpClient) {}

  getProfileByStudentId(studentId: number): Observable<StudentProfile> {
    return this.http.get<StudentProfile>(`${this.apiUrl}/student/${studentId}`);
  }

  createProfile(studentId: number, request: StudentProfileRequest): Observable<StudentProfile> {
    return this.http.post<StudentProfile>(`${this.apiUrl}/student/${studentId}`, request);
  }

  updateProfile(studentId: number, request: StudentProfileRequest): Observable<StudentProfile> {
    return this.http.put<StudentProfile>(`${this.apiUrl}/student/${studentId}`, request);
  }
}
