import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Department } from '../models/department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly apiUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  createDepartment(name: string): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, {
      name,
    });
  }

  updateDepartment(id: number, name: string): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, {
      name,
    });
  }
}
