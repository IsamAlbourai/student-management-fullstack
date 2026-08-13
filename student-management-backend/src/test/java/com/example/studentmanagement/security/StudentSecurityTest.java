package com.example.studentmanagement.security;

import com.example.studentmanagement.controller.DepartmentController;
import com.example.studentmanagement.controller.StudentController;
import com.example.studentmanagement.controller.StudentProfileController;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.StudentProfile;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.StudentProfileRepository;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.service.StudentService;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = {
                StudentController.class,
                DepartmentController.class,
                StudentProfileController.class
        },
        properties = {
                "jwt.secret=student-management-super-secret-jwt-key-2026",
                "jwt.expiration=3600000"
        }
)
@AutoConfigureMockMvc(addFilters = false)
@Import({
        StudentSecurityTest.TestSecurityConfig.class,
        JwtService.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class
})
public class StudentSecurityTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @MockitoBean
    private StudentService studentService;

    @MockitoBean
    private DepartmentRepository departmentRepository;

    @MockitoBean
    private StudentRepository studentRepository;

    @MockitoBean
    private StudentProfileRepository studentProfileRepository;

    private MockMvc mockMvc;

    private String studentToken;
    private String adminToken;

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .addFilters(springSecurityFilterChain)
                .build();

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
    void getStudentsWithoutTokenShouldReturnUnauthorized()
            throws Exception {

        mockMvc.perform(
                        get("/api/students")
                )
                .andExpect(
                        status().isUnauthorized()
                );
    }

    @Test
    void studentTokenShouldAllowGetStudents()
            throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student student = new Student(
                1,
                "Omar",
                23,
                "Software Engineering",
                department
        );

        when(studentService.getAllStudents())
                .thenReturn(
                        List.of(student)
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
                );
    }

    @Test
    void studentTokenShouldNotAllowCreateStudent()
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
                                          "name": "Yusuf",
                                          "age": 21,
                                          "course": "Computer Science",
                                          "departmentId": 1
                                        }
                                        """)
                )
                .andExpect(
                        status().isForbidden()
                );
    }

    @Test
    void adminTokenShouldAllowCreateStudent()
            throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student createdStudent = new Student(
                10,
                "Yusuf",
                21,
                "Computer Science",
                department
        );

        when(studentService.createStudent(
                "Yusuf",
                21,
                "Computer Science",
                1
        )).thenReturn(createdStudent);

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
                                          "departmentId": 1
                                        }
                                        """)
                )
                .andExpect(
                        status().isCreated()
                );
    }

    @Test
    void studentTokenShouldAllowGetDepartments()
            throws Exception {

        Department department =
                new Department(
                        1,
                        "Computer Science"
                );

        when(departmentRepository.findAll())
                .thenReturn(
                        List.of(department)
                );

        mockMvc.perform(
                        get("/api/departments")
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
                                )
                )
                .andExpect(
                        status().isOk()
                );
    }

    @Test
    void studentTokenShouldNotAllowCreateDepartment()
            throws Exception {

        mockMvc.perform(
                        post("/api/departments")
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
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
                        status().isForbidden()
                );
    }

    @Test
    void adminTokenShouldAllowCreateDepartment()
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
                        post("/api/departments")
                                .header(
                                        "Authorization",
                                        "Bearer " + adminToken
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
                );
    }

    @Test
    void studentTokenShouldNotAllowCreateProfile()
            throws Exception {

        mockMvc.perform(
                        post("/api/profiles/student/1")
                                .header(
                                        "Authorization",
                                        "Bearer " + studentToken
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "email": "omar@example.com",
                                          "phoneNumber": "99999999"
                                        }
                                        """)
                )
                .andExpect(
                        status().isForbidden()
                );
    }

    @Test
    void adminTokenShouldAllowCreateProfile()
            throws Exception {

        Department department =
                new Department(
                        1,
                        "Computer Science"
                );

        Student student =
                new Student(
                        1,
                        "Omar",
                        23,
                        "Software Engineering",
                        department
                );

        when(studentRepository.findById(1))
                .thenReturn(
                        Optional.of(student)
                );

        when(
                studentProfileRepository.save(
                        any(StudentProfile.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );

        mockMvc.perform(
                        post("/api/profiles/student/1")
                                .header(
                                        "Authorization",
                                        "Bearer " + adminToken
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "email": "omar@example.com",
                                          "phoneNumber": "99999999"
                                        }
                                        """)
                )
                .andExpect(
                        status().isCreated()
                );
    }

    @TestConfiguration
    @EnableWebSecurity
    static class TestSecurityConfig {

        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        UserDetailsService userDetailsService(
                PasswordEncoder passwordEncoder) {

            UserDetails user = User.builder()
                    .username("student")
                    .password(
                            passwordEncoder.encode(
                                    "student123"
                            )
                    )
                    .roles("USER")
                    .build();

            UserDetails admin = User.builder()
                    .username("admin")
                    .password(
                            passwordEncoder.encode(
                                    "admin123"
                            )
                    )
                    .roles("ADMIN")
                    .build();

            return new InMemoryUserDetailsManager(
                    user,
                    admin
            );
        }

        @Bean
        SecurityFilterChain securityFilterChain(
                HttpSecurity http,
                JwtAuthenticationFilter jwtAuthenticationFilter,
                JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint)
                throws Exception {

            http
                    .csrf(csrf ->
                            csrf.disable()
                    )

                    .sessionManagement(session ->
                            session.sessionCreationPolicy(
                                    SessionCreationPolicy.STATELESS
                            )
                    )

                    .exceptionHandling(exception -> exception
                            .authenticationEntryPoint(
                                    jwtAuthenticationEntryPoint
                            )
                            .accessDeniedHandler(
                                    (
                                            request,
                                            response,
                                            accessDeniedException
                                    ) ->
                                            response.setStatus(
                                                    HttpServletResponse
                                                            .SC_FORBIDDEN
                                            )
                            )
                    )

                    .authorizeHttpRequests(auth -> auth

                            .dispatcherTypeMatchers(
                                    DispatcherType.ERROR
                            )
                            .permitAll()

                            .requestMatchers("/api/auth/**")
                            .permitAll()

                            .requestMatchers(
                                    HttpMethod.GET,
                                    "/api/students/**"
                            )
                            .hasAnyRole(
                                    "USER",
                                    "ADMIN"
                            )

                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/api/students/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.PUT,
                                    "/api/students/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.DELETE,
                                    "/api/students/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.GET,
                                    "/api/departments/**"
                            )
                            .hasAnyRole(
                                    "USER",
                                    "ADMIN"
                            )

                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/api/departments/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.PUT,
                                    "/api/departments/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.DELETE,
                                    "/api/departments/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.GET,
                                    "/api/profiles/**"
                            )
                            .hasAnyRole(
                                    "USER",
                                    "ADMIN"
                            )

                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/api/profiles/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.PUT,
                                    "/api/profiles/**"
                            )
                            .hasRole("ADMIN")

                            .requestMatchers(
                                    HttpMethod.DELETE,
                                    "/api/profiles/**"
                            )
                            .hasRole("ADMIN")

                            .anyRequest()
                            .authenticated()
                    )

                    .addFilterBefore(
                            jwtAuthenticationFilter,
                            UsernamePasswordAuthenticationFilter.class
                    );

            return http.build();
        }
    }
}