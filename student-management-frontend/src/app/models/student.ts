export interface Student {
  id: number;
  name: string;
  age: number;
  course: string;
  departmentId: number | null;
  departmentName: string | null;
}

export interface StudentRequest {
  name: string;
  age: number;
  course: string;
  departmentId: number;
}
