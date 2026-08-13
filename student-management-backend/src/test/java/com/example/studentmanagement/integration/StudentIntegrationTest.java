package com.example.studentmanagement.integration;

import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
        properties = {
                "spring.datasource.url=jdbc:h2:mem:integrationdb",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "spring.jpa.hibernate.ddl-auto=create-drop",
                "jwt.secret=student-management-integration-test-secret-key-2026",
                "jwt.expiration=3600000"
        }
)
@AutoConfigureMockMvc
public class StudentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department department;

    private String studentToken;
    private String adminToken;

    @BeforeEach
    void setUp() {

        studentRepository.deleteAll();
        departmentRepository.deleteAll();

        department = new Department();
        department.setName("Computer Science");

        department =
                departmentRepository.save(department);

        UserDetails studentUser =
                userDetailsService.loadUserByUsername(
                        "student"
                );

        UserDetails adminUser =
                userDetailsService.loadUserByUsername(
                        "admin"
                );

        studentToken =
                jwtService.generateToken(studentUser);

        adminToken =
                jwtService.generateToken(adminUser);
    }

    @Test
    void adminShouldCreateStudentAndStudentShouldReadIt()
            throws Exception {

        mockMvc.perform(
                        post("/api/students")
                                .header(
                                        "Authorization",
                                        "Bearer " + adminToken
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "name": "Omar",
                                          "age": 23,
                                          "course": "Software Engineering",
                                          "departmentId": %d
                                        }
                                        """.formatted(
                                        department.getId()
                                ))
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("Omar")
                )
                .andExpect(
                        jsonPath("$.age")
                                .value(23)
                )
                .andExpect(
                        jsonPath("$.departmentName")
                                .value("Computer Science")
                );

        mockMvc.perform(
                        get("/api/students")
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$[0].name")
                                .value("Omar")
                )
                .andExpect(
                        jsonPath("$[0].course")
                                .value("Software Engineering")
                );
    }

    @Test
    void studentShouldNotBeAllowedToCreateStudent()
            throws Exception {

        mockMvc.perform(
                        post("/api/students")
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "name": "Sara",
                                          "age": 22,
                                          "course": "Computer Science",
                                          "departmentId": %d
                                        }
                                        """.formatted(
                                        department.getId()
                                ))
                )
                .andExpect(
                        status().isForbidden()
                );
    }

    @Test
    void requestWithoutTokenShouldReturnUnauthorized()
            throws Exception {

        mockMvc.perform(
                        get("/api/students")
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    void adminShouldUpdateAndDeleteStudent()
            throws Exception {

        String response =
                mockMvc.perform(
                                post("/api/students")
                                        .header(
                                                "Authorization",
                                                "Bearer " + adminToken
                                        )
                                        .contentType(
                                                MediaType.APPLICATION_JSON
                                        )
                                        .content("""
                                                {
                                                  "name": "Yusuf",
                                                  "age": 21,
                                                  "course": "Computer Science",
                                                  "departmentId": %d
                                                }
                                                """.formatted(
                                                department.getId()
                                        ))
                        )
                        .andExpect(
                                status().isCreated()
                        )
                        .andReturn()
                        .getResponse()
                        .getContentAsString();

        Integer studentId =
                Integer.valueOf(
                        response.replaceAll(
                                ".*\"id\":(\\d+).*",
                                "$1"
                        )
                );

        mockMvc.perform(
                        put(
                                "/api/students/{id}",
                                studentId
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + adminToken
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "name": "Yusuf Ahmed",
                                          "age": 22,
                                          "course": "Software Engineering",
                                          "departmentId": %d
                                        }
                                        """.formatted(
                                        department.getId()
                                ))
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("Yusuf Ahmed")
                )
                .andExpect(
                        jsonPath("$.age")
                                .value(22)
                );

        mockMvc.perform(
                        delete(
                                "/api/students/{id}",
                                studentId
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + adminToken
                                )
                )
                .andExpect(
                        status().isNoContent()
                );

        mockMvc.perform(
                        get(
                                "/api/students/{id}",
                                studentId
                        )
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
                                )
                )
                .andExpect(
                        status().isNotFound()
                );
    }
}