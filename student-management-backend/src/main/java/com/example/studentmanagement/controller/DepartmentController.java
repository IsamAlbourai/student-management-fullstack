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

    private final DepartmentRepository
            departmentRepository;

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

        String name =
                department
                        .getName()
                        .trim();

        if (name.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        if (
                departmentRepository
                        .existsByNameIgnoreCase(name)
        ) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        department.setId(null);

        department.setName(name);

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

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDto>
    updateDepartment(
            @PathVariable Integer id,
            @RequestBody Department updatedDepartment) {

        Department existingDepartment =
                departmentRepository
                        .findById(id)
                        .orElse(null);

        if (
                existingDepartment
                        == null
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        String newName =
                updatedDepartment
                        .getName()
                        .trim();

        if (newName.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        boolean nameChanged =
                !existingDepartment
                        .getName()
                        .equalsIgnoreCase(
                                newName
                        );

        if (
                nameChanged
                        &&
                        departmentRepository
                                .existsByNameIgnoreCase(
                                        newName
                                )
        ) {

            return ResponseEntity
                    .status(
                            HttpStatus.CONFLICT
                    )
                    .build();
        }

        existingDepartment.setName(
                newName
        );

        Department savedDepartment =
                departmentRepository.save(
                        existingDepartment
                );

        return ResponseEntity.ok(
                convertToDto(
                        savedDepartment
                )
        );
    }

    private DepartmentResponseDto
    convertToDto(
            Department department) {

        return new DepartmentResponseDto(
                department.getId(),
                department.getName()
        );
    }
}