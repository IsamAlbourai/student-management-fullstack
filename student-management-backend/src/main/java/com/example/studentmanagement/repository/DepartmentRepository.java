package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository
        extends JpaRepository<Department, Integer> {

    boolean existsByNameIgnoreCase(
            String name
    );
}