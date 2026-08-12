package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Integer> {
}