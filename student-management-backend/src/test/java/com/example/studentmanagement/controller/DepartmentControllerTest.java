package com.example.studentmanagement.controller;

import com.example.studentmanagement.exception.GlobalExceptionHandler;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class DepartmentControllerTest {

    private MockMvc mockMvc;

    private DepartmentRepository
            departmentRepository;

    @BeforeEach
    void setUp() {

        departmentRepository =
                mock(
                        DepartmentRepository.class
                );

        DepartmentController controller =
                new DepartmentController(
                        departmentRepository
                );

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .build();
    }

    @Test
    void getDepartmentsShouldReturnDepartments()
            throws Exception {

        Department department1 =
                new Department(
                        1,
                        "Computer Science"
                );

        Department department2 =
                new Department(
                        2,
                        "Information Technology"
                );

        when(
                departmentRepository.findAll()
        ).thenReturn(
                List.of(
                        department1,
                        department2
                )
        );

        mockMvc.perform(
                        get(
                                "/api/departments"
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$[0].id")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$[0].name")
                                .value(
                                        "Computer Science"
                                )
                )
                .andExpect(
                        jsonPath("$[1].id")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$[1].name")
                                .value(
                                        "Information Technology"
                                )
                );
    }

    @Test
    void createDepartmentShouldReturnCreatedDepartment()
            throws Exception {

        Department savedDepartment =
                new Department(
                        3,
                        "Cybersecurity"
                );

        when(
                departmentRepository.save(
                        any(Department.class)
                )
        ).thenReturn(
                savedDepartment
        );

        mockMvc.perform(
                        post(
                                "/api/departments"
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "name": "Cybersecurity"
                                        }
                                        """)
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(3)
                )
                .andExpect(
                        jsonPath("$.name")
                                .value(
                                        "Cybersecurity"
                                )
                );
    }
}