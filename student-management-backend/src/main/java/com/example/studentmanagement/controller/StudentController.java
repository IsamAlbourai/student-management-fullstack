package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentController(
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository) {

        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getStudents() {

        List<StudentResponseDto> students = studentRepository
                .findAll()
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(
            @PathVariable Integer id) {

        Student student = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student with ID " + id + " not found"
                        )
                );

        return ResponseEntity.ok(convertToDto(student));
    }

    @GetMapping("/course")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByCourse(
            @RequestParam String course) {

        List<StudentResponseDto> students = studentRepository
                .findByCourse(course)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/min-age")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByMinimumAge(
            @RequestParam int age) {

        List<StudentResponseDto> students = studentRepository
                .findStudentsByMinimumAge(age)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDto>> searchStudentsByName(
            @RequestParam String name) {

        List<StudentResponseDto> students = studentRepository
                .searchStudentsByName(name)
                .stream()
                .map(this::convertToDto)
                .toList();

        return ResponseEntity.ok(students);
    }

    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(
            @RequestBody StudentRequestDto request) {

        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department with ID "
                                        + request.getDepartmentId()
                                        + " not found"
                        )
                );

        Student student = new Student(
                null,
                request.getName(),
                request.getAge(),
                request.getCourse(),
                department
        );

        Student savedStudent =
                studentRepository.save(student);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(convertToDto(savedStudent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(
            @PathVariable Integer id,
            @RequestBody StudentRequestDto request) {

        Student existingStudent = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student with ID " + id + " not found"
                        )
                );

        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department with ID "
                                        + request.getDepartmentId()
                                        + " not found"
                        )
                );

        existingStudent.setName(request.getName());
        existingStudent.setAge(request.getAge());
        existingStudent.setCourse(request.getCourse());
        existingStudent.setDepartment(department);

        Student updatedStudent =
                studentRepository.save(existingStudent);

        return ResponseEntity.ok(
                convertToDto(updatedStudent)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Integer id) {

        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            );
        }

        studentRepository.deleteById(id);

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