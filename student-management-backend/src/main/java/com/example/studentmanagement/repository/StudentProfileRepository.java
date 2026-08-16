package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Integer> {

    Optional<StudentProfile> findByStudentId(
            Integer studentId
    );
}