package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.Student;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {

    @GetMapping("/api/students")
    public ResponseEntity<List<StudentResponseDto>> getStudents() {

        Student student1 =
                new Student(1, "Ali", 22, "Computer Science");

        Student student2 =
                new Student(2, "Sara", 21, "Information Technology");

        StudentResponseDto studentDto1 =
                convertToDto(student1);

        StudentResponseDto studentDto2 =
                convertToDto(student2);

        List<StudentResponseDto> students =
                List.of(studentDto1, studentDto2);

        return ResponseEntity.ok(students);
    }

    @GetMapping("/api/students/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(
            @PathVariable int id) {

        if (id != 1 && id != 2) {
            throw new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            );
        }

        Student student;

        if (id == 1) {
            student = new Student(
                    1,
                    "Ali",
                    22,
                    "Computer Science"
            );
        } else {
            student = new Student(
                    2,
                    "Sara",
                    21,
                    "Information Technology"
            );
        }

        StudentResponseDto studentDto =
                convertToDto(student);

        return ResponseEntity.ok(studentDto);
    }

    @GetMapping("/api/students/search")
    public ResponseEntity<String> searchStudents(
            @RequestParam String course) {

        String message =
                "Searching for students in course: " + course;

        return ResponseEntity.ok(message);
    }

    @PostMapping("/api/students")
    public ResponseEntity<StudentResponseDto> createStudent(
            @RequestBody Student student) {

        StudentResponseDto studentDto =
                convertToDto(student);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentDto);
    }

    @PutMapping("/api/students/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(
            @PathVariable int id,
            @RequestBody Student student) {

        Student updatedStudent = new Student(
                id,
                student.getName(),
                student.getAge(),
                student.getCourse()
        );

        StudentResponseDto studentDto =
                convertToDto(updatedStudent);

        return ResponseEntity.ok(studentDto);
    }

    @DeleteMapping("/api/students/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable int id) {

        return ResponseEntity.noContent().build();
    }

    private StudentResponseDto convertToDto(Student student) {

        return new StudentResponseDto(
                student.getId(),
                student.getName(),
                student.getAge(),
                student.getCourse()
        );
    }
}