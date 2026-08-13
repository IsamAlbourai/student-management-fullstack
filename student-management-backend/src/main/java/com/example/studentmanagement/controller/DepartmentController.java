package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.DepartmentResponseDto;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.repository.DepartmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(
            DepartmentRepository departmentRepository) {

        this.departmentRepository =
                departmentRepository;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponseDto>>
    getDepartments() {

        List<DepartmentResponseDto> departments =
                departmentRepository
                        .findAll()
                        .stream()
                        .map(this::convertToDto)
                        .toList();

        return ResponseEntity.ok(
                departments
        );
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDto>
    createDepartment(
            @RequestBody Department department) {

        department.setId(null);

        Department savedDepartment =
                departmentRepository.save(
                        department
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        convertToDto(
                                savedDepartment
                        )
                );
    }

    private DepartmentResponseDto convertToDto(
            Department department) {

        return new DepartmentResponseDto(
                department.getId(),
                department.getName()
        );
    }
}