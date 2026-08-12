package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentProfileResponseDto;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.StudentProfile;
import com.example.studentmanagement.repository.StudentProfileRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class StudentProfileController {

    private final StudentProfileRepository studentProfileRepository;
    private final StudentRepository studentRepository;

    public StudentProfileController(
            StudentProfileRepository studentProfileRepository,
            StudentRepository studentRepository) {

        this.studentProfileRepository = studentProfileRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<StudentProfileResponseDto> createProfile(
            @PathVariable Integer studentId,
            @RequestBody StudentProfile profile) {

        Student student = studentRepository
                .findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student with ID " + studentId + " not found"
                        )
                );

        profile.setId(null);
        profile.setStudent(student);

        StudentProfile savedProfile =
                studentProfileRepository.save(profile);

        StudentProfileResponseDto response =
                convertToDto(savedProfile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    private StudentProfileResponseDto convertToDto(
            StudentProfile profile) {

        Student student = profile.getStudent();

        return new StudentProfileResponseDto(
                profile.getId(),
                profile.getEmail(),
                profile.getPhoneNumber(),
                student.getId(),
                student.getName()
        );
    }
}