export interface Student {
  id: number | string;

  name: string;

  age: number;

  course: string;

  departmentId?: number | null;

  departmentName?: string | null;

  // Temporary compatibility with the older Angular forms.
  // We will remove this during Step 4.
  skills?: string[];
}
