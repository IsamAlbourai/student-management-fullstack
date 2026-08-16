import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Department } from '../../models/department';

import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-departments',

  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './departments.html',

  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  departments = signal<Department[]>([]);

  departmentName = '';

  loading = signal(false);

  saving = signal(false);

  editingDepartmentId = signal<number | null>(null);

  editingDepartmentName = '';

  updating = signal(false);

  loadErrorMessage = signal('');

  createErrorMessage = signal('');

  editErrorMessage = signal('');

  successMessage = signal('');

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);

    this.loadErrorMessage.set('');

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(this.sortDepartments(departments));

        this.loading.set(false);
      },

      error: (error) => {
        this.loading.set(false);

        if (error.status === 0) {
          this.loadErrorMessage.set(
            'Unable to connect to the server. Please make sure the backend is running.',
          );

          return;
        }

        this.loadErrorMessage.set('Failed to load departments. Please try again.');
      },
    });
  }

  createDepartment(): void {
    const name = this.departmentName.trim();

    if (!name) {
      this.createErrorMessage.set('Department name is required.');

      this.successMessage.set('');

      return;
    }

    this.createErrorMessage.set('');

    this.successMessage.set('');

    this.saving.set(true);

    this.departmentService.createDepartment(name).subscribe({
      next: (department) => {
        this.departments.update((departments) =>
          this.sortDepartments([...departments, department]),
        );

        this.departmentName = '';

        this.saving.set(false);

        this.successMessage.set('Department created successfully.');
      },

      error: (error) => {
        this.saving.set(false);

        if (error.status === 409) {
          this.createErrorMessage.set('A department with this name already exists.');

          return;
        }

        if (error.status === 0) {
          this.createErrorMessage.set(
            'Unable to connect to the server. Please try again when the backend is available.',
          );

          return;
        }

        this.createErrorMessage.set('Failed to create department. Please try again.');
      },
    });
  }

  startEdit(department: Department): void {
    this.editingDepartmentId.set(department.id);

    this.editingDepartmentName = department.name;

    this.editErrorMessage.set('');

    this.successMessage.set('');
  }

  cancelEdit(): void {
    this.editingDepartmentId.set(null);

    this.editingDepartmentName = '';

    this.editErrorMessage.set('');
  }

  saveEdit(department: Department): void {
    const name = this.editingDepartmentName.trim();

    if (!name) {
      this.editErrorMessage.set('Department name is required.');

      return;
    }

    if (name.toLowerCase() === department.name.trim().toLowerCase()) {
      this.cancelEdit();

      return;
    }

    this.updating.set(true);

    this.editErrorMessage.set('');

    this.successMessage.set('');

    this.departmentService.updateDepartment(department.id, name).subscribe({
      next: (updatedDepartment) => {
        this.departments.update((departments) =>
          this.sortDepartments(
            departments.map((currentDepartment) =>
              currentDepartment.id === updatedDepartment.id ? updatedDepartment : currentDepartment,
            ),
          ),
        );

        this.updating.set(false);

        this.editingDepartmentId.set(null);

        this.editingDepartmentName = '';

        this.successMessage.set('Department updated successfully.');
      },

      error: (error) => {
        this.updating.set(false);

        if (error.status === 409) {
          this.editErrorMessage.set('A department with this name already exists.');

          return;
        }

        if (error.status === 404) {
          this.editErrorMessage.set('The department could not be found.');

          return;
        }

        if (error.status === 400) {
          this.editErrorMessage.set('Department name is invalid.');

          return;
        }

        if (error.status === 0) {
          this.editErrorMessage.set('Unable to connect to the server. Please try again.');

          return;
        }

        this.editErrorMessage.set('Failed to update department. Please try again.');
      },
    });
  }

  private sortDepartments(departments: Department[]): Department[] {
    return [...departments].sort((first, second) => first.name.localeCompare(second.name));
  }
}
