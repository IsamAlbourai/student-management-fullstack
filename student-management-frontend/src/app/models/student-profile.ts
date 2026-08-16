export interface StudentProfile {
  id: number;
  email: string;
  phoneNumber: string;
  studentId: number;
  studentName: string;
}

export interface StudentProfileRequest {
  email: string;
  phoneNumber: string;
}
