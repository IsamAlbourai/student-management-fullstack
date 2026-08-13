package com.example.studentmanagement.controller;

import com.example.studentmanagement.exception.GlobalExceptionHandler;
import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class StudentControllerTest {

    private MockMvc mockMvc;
    private StudentService studentService;

    @BeforeEach
    void setUp() {

        studentService = mock(StudentService.class);

        StudentController studentController =
                new StudentController(studentService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(studentController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .build();
    }

    @Test
    void getStudentsShouldReturnStudents() throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student student1 = new Student(
                1,
                "Omar",
                23,
                "Software Engineering",
                department
        );

        Student student2 = new Student(
                2,
                "Sara",
                24,
                "Computer Science",
                department
        );

        when(studentService.getAllStudents())
                .thenReturn(
                        List.of(
                                student1,
                                student2
                        )
                );

        mockMvc.perform(
                        get("/api/students")
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
                                .value("Omar")
                )
                .andExpect(
                        jsonPath("$[0].departmentName")
                                .value("Computer Science")
                )
                .andExpect(
                        jsonPath("$[1].id")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$[1].name")
                                .value("Sara")
                );
    }

    @Test
    void getStudentByIdShouldReturnStudent() throws Exception {

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

        when(studentService.getStudentById(1))
                .thenReturn(student);

        mockMvc.perform(
                        get("/api/students/1")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(1)
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
                        jsonPath("$.course")
                                .value("Software Engineering")
                )
                .andExpect(
                        jsonPath("$.departmentId")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$.departmentName")
                                .value("Computer Science")
                );
    }

    @Test
    void getStudentByIdShouldReturnNotFoundWhenStudentDoesNotExist()
            throws Exception {

        when(studentService.getStudentById(999))
                .thenThrow(
                        new StudentNotFoundException(
                                "Student with ID 999 not found"
                        )
                );

        mockMvc.perform(
                        get("/api/students/999")
                )
                .andExpect(
                        status().isNotFound()
                )
                .andExpect(
                        jsonPath("$.status")
                                .value(404)
                )
                .andExpect(
                        jsonPath("$.message")
                                .value(
                                        "Student with ID 999 not found"
                                )
                );
    }

    @Test
    void createStudentShouldReturnCreatedStudent() throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student createdStudent = new Student(
                3,
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
                                .contentType(MediaType.APPLICATION_JSON)
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
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(3)
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("Yusuf")
                )
                .andExpect(
                        jsonPath("$.age")
                                .value(21)
                )
                .andExpect(
                        jsonPath("$.course")
                                .value("Computer Science")
                )
                .andExpect(
                        jsonPath("$.departmentName")
                                .value("Computer Science")
                );
    }

    @Test
    void updateStudentShouldReturnUpdatedStudent() throws Exception {

        Department department = new Department();
        department.setId(2);
        department.setName("Information Technology");

        Student updatedStudent = new Student(
                1,
                "Omar Ahmed",
                24,
                "Information Technology",
                department
        );

        when(studentService.updateStudent(
                1,
                "Omar Ahmed",
                24,
                "Information Technology",
                2
        )).thenReturn(updatedStudent);

        mockMvc.perform(
                        put("/api/students/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                          "name": "Omar Ahmed",
                                          "age": 24,
                                          "course": "Information Technology",
                                          "departmentId": 2
                                        }
                                        """)
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("Omar Ahmed")
                )
                .andExpect(
                        jsonPath("$.age")
                                .value(24)
                )
                .andExpect(
                        jsonPath("$.course")
                                .value("Information Technology")
                )
                .andExpect(
                        jsonPath("$.departmentId")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$.departmentName")
                                .value("Information Technology")
                );
    }

    @Test
    void deleteStudentShouldReturnNoContent() throws Exception {

        mockMvc.perform(
                        delete("/api/students/1")
                )
                .andExpect(
                        status().isNoContent()
                );

        verify(studentService)
                .deleteStudent(1);
    }

    @Test
    void deleteStudentShouldReturnNotFoundWhenStudentDoesNotExist()
            throws Exception {

        org.mockito.Mockito.doThrow(
                        new StudentNotFoundException(
                                "Student with ID 999 not found"
                        )
                )
                .when(studentService)
                .deleteStudent(999);

        mockMvc.perform(
                        delete("/api/students/999")
                )
                .andExpect(
                        status().isNotFound()
                )
                .andExpect(
                        jsonPath("$.status")
                                .value(404)
                )
                .andExpect(
                        jsonPath("$.message")
                                .value(
                                        "Student with ID 999 not found"
                                )
                );
    }

    @Test
    void getStudentsByCourseShouldReturnMatchingStudents() throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student student = new Student(
                1,
                "Sara",
                24,
                "Computer Science",
                department
        );

        when(studentService.getStudentsByCourse(
                "Computer Science"
        )).thenReturn(
                List.of(student)
        );

        mockMvc.perform(
                        get("/api/students/course")
                                .param(
                                        "course",
                                        "Computer Science"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$[0].name")
                                .value("Sara")
                )
                .andExpect(
                        jsonPath("$[0].course")
                                .value("Computer Science")
                );
    }

    @Test
    void getStudentsByMinimumAgeShouldReturnMatchingStudents()
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

        when(studentService.getStudentsByMinimumAge(21))
                .thenReturn(
                        List.of(student)
                );

        mockMvc.perform(
                        get("/api/students/min-age")
                                .param(
                                        "age",
                                        "21"
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
                        jsonPath("$[0].age")
                                .value(23)
                );
    }

    @Test
    void searchStudentsByNameShouldReturnMatchingStudents()
            throws Exception {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student student = new Student(
                1,
                "Omar Ahmed",
                23,
                "Software Engineering",
                department
        );

        when(studentService.searchStudentsByName("Omar"))
                .thenReturn(
                        List.of(student)
                );

        mockMvc.perform(
                        get("/api/students/search")
                                .param(
                                        "name",
                                        "Omar"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$[0].name")
                                .value("Omar Ahmed")
                );
    }
}