package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.StudentProfileResponseDto;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.exception.StudentProfileNotFoundException;
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

    private final StudentProfileRepository
            studentProfileRepository;

    private final StudentRepository
            studentRepository;

    public StudentProfileController(
            StudentProfileRepository studentProfileRepository,
            StudentRepository studentRepository) {

        this.studentProfileRepository =
                studentProfileRepository;

        this.studentRepository =
                studentRepository;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentProfileResponseDto>
    getProfileByStudentId(
            @PathVariable Integer studentId) {

        StudentProfile profile =
                studentProfileRepository
                        .findByStudentId(studentId)
                        .orElseThrow(() ->
                                new StudentProfileNotFoundException(
                                        studentId
                                )
                        );

        return ResponseEntity.ok(
                convertToDto(profile)
        );
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<StudentProfileResponseDto>
    createProfile(
            @PathVariable Integer studentId,
            @RequestBody StudentProfile profile) {

        Student student =
                studentRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new StudentNotFoundException(
                                        "Student with ID "
                                                + studentId
                                                + " not found"
                                )
                        );

        if (
                studentProfileRepository
                        .findByStudentId(studentId)
                        .isPresent()
        ) {

            throw new IllegalStateException(
                    "Student already has a profile"
            );
        }

        profile.setId(null);

        profile.setStudent(student);

        StudentProfile savedProfile =
                studentProfileRepository
                        .save(profile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        convertToDto(
                                savedProfile
                        )
                );
    }

    @PutMapping("/student/{studentId}")
    public ResponseEntity<StudentProfileResponseDto>
    updateProfile(
            @PathVariable Integer studentId,
            @RequestBody StudentProfile updatedProfile) {

        StudentProfile existingProfile =
                studentProfileRepository
                        .findByStudentId(studentId)
                        .orElseThrow(() ->
                                new StudentProfileNotFoundException(
                                        studentId
                                )
                        );

        existingProfile.setEmail(
                updatedProfile.getEmail()
        );

        existingProfile.setPhoneNumber(
                updatedProfile.getPhoneNumber()
        );

        StudentProfile savedProfile =
                studentProfileRepository
                        .save(existingProfile);

        return ResponseEntity.ok(
                convertToDto(
                        savedProfile
                )
        );
    }

    private StudentProfileResponseDto
    convertToDto(
            StudentProfile profile) {

        Student student =
                profile.getStudent();

        return new StudentProfileResponseDto(
                profile.getId(),
                profile.getEmail(),
                profile.getPhoneNumber(),
                student.getId(),
                student.getName()
        );
    }
}