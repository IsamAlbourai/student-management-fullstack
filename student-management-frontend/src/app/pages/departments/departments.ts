import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { Department } from '../../models/department';

import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-departments',

  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],

  templateUrl: './departments.html',

  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  departments = signal<Department[]>([]);

  departmentName = '';

  loading = signal(false);

  saving = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);

    this.errorMessage.set('');

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);

        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);

        this.errorMessage.set('Failed to load departments.');
      },
    });
  }

  createDepartment(): void {
    const name = this.departmentName.trim();

    if (!name) {
      this.errorMessage.set('Department name is required.');

      return;
    }

    this.errorMessage.set('');

    this.successMessage.set('');

    this.saving.set(true);

    this.departmentService.createDepartment(name).subscribe({
      next: (department) => {
        this.departments.update((departments) => [...departments, department]);

        this.departmentName = '';

        this.saving.set(false);

        this.successMessage.set('Department created successfully.');
      },

      error: () => {
        this.saving.set(false);

        this.errorMessage.set('Failed to create department.');
      },
    });
  }
}
