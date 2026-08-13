package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getStudents() {

        List<StudentResponseDto> students = studentService
                .getAllStudents()
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(
            @PathVariable Integer id) {

        Student student =
                studentService.getStudentById(id);

        return ResponseEntity.ok(
                convertToDto(student)
        );
    }

    @GetMapping("/course")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByCourse(
            @RequestParam String course) {

        List<StudentResponseDto> students = studentService
                .getStudentsByCourse(course)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/min-age")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByMinimumAge(
            @RequestParam int age) {

        List<StudentResponseDto> students = studentService
                .getStudentsByMinimumAge(age)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDto>> searchStudentsByName(
            @RequestParam String name) {

        List<StudentResponseDto> students = studentService
                .searchStudentsByName(name)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(
            @Valid @RequestBody StudentRequestDto request) {

        Student savedStudent =
                studentService.createStudent(
                        request.getName(),
                        request.getAge(),
                        request.getCourse(),
                        request.getDepartmentId()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(convertToDto(savedStudent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(
            @PathVariable Integer id,
            @Valid @RequestBody StudentRequestDto request) {

        Student updatedStudent =
                studentService.updateStudent(
                        id,
                        request.getName(),
                        request.getAge(),
                        request.getCourse(),
                        request.getDepartmentId()
                );

        return ResponseEntity.ok(
                convertToDto(updatedStudent)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Integer id) {

        studentService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }

    private StudentResponseDto convertToDto(Student student) {

        Department department = student.getDepartment();

        return new StudentResponseDto(
                student.getId(),
                student.getName(),
                student.getAge(),
                student.getCourse(),
                department != null ? department.getId() : null,
                department != null ? department.getName() : null
        );
    }
}