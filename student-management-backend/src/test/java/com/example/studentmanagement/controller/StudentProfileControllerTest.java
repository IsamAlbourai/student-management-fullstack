package com.example.studentmanagement.controller;

import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.StudentProfile;
import com.example.studentmanagement.repository.StudentProfileRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class StudentProfileControllerTest {

    private MockMvc mockMvc;

    private StudentProfileRepository
            studentProfileRepository;

    private StudentRepository
            studentRepository;

    @BeforeEach
    void setUp() {

        studentProfileRepository =
                mock(
                        StudentProfileRepository.class
                );

        studentRepository =
                mock(
                        StudentRepository.class
                );

        StudentProfileController controller =
                new StudentProfileController(
                        studentProfileRepository,
                        studentRepository
                );

        mockMvc =
                MockMvcBuilders
                        .standaloneSetup(controller)
                        .build();
    }

    @Test
    void getProfileByStudentIdShouldReturnProfile()
            throws Exception {

        Student student =
                new Student(
                        9,
                        "Yusuf",
                        21,
                        "Computer Science",
                        null
                );

        StudentProfile profile =
                new StudentProfile(
                        2,
                        "yusuf@example.com",
                        "+968 91234567",
                        student
                );

        when(
                studentProfileRepository
                        .findByStudentId(9)
        ).thenReturn(
                Optional.of(profile)
        );

        mockMvc.perform(
                        get(
                                "/api/profiles/student/9"
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$.email")
                                .value(
                                        "yusuf@example.com"
                                )
                )
                .andExpect(
                        jsonPath("$.phoneNumber")
                                .value(
                                        "+968 91234567"
                                )
                )
                .andExpect(
                        jsonPath("$.studentId")
                                .value(9)
                )
                .andExpect(
                        jsonPath("$.studentName")
                                .value("Yusuf")
                );
    }

    @Test
    void createProfileShouldReturnCreatedProfile()
            throws Exception {

        Student student =
                new Student(
                        9,
                        "Yusuf",
                        21,
                        "Computer Science",
                        null
                );

        StudentProfile savedProfile =
                new StudentProfile(
                        2,
                        "yusuf@example.com",
                        "+968 91234567",
                        student
                );

        when(
                studentRepository.findById(9)
        ).thenReturn(
                Optional.of(student)
        );

        when(
                studentProfileRepository
                        .findByStudentId(9)
        ).thenReturn(
                Optional.empty()
        );

        when(
                studentProfileRepository
                        .save(any(StudentProfile.class))
        ).thenReturn(
                savedProfile
        );

        mockMvc.perform(
                        post(
                                "/api/profiles/student/9"
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                    {
                                      "email": "yusuf@example.com",
                                      "phoneNumber": "+968 91234567"
                                    }
                                    """)
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$.email")
                                .value(
                                        "yusuf@example.com"
                                )
                )
                .andExpect(
                        jsonPath("$.phoneNumber")
                                .value(
                                        "+968 91234567"
                                )
                )
                .andExpect(
                        jsonPath("$.studentId")
                                .value(9)
                )
                .andExpect(
                        jsonPath("$.studentName")
                                .value("Yusuf")
                );
    }

    @Test
    void updateProfileShouldReturnUpdatedProfile()
            throws Exception {

        Student student =
                new Student(
                        9,
                        "Yusuf",
                        21,
                        "Computer Science",
                        null
                );

        StudentProfile existingProfile =
                new StudentProfile(
                        2,
                        "yusuf@example.com",
                        "+968 91234567",
                        student
                );

        StudentProfile updatedProfile =
                new StudentProfile(
                        2,
                        "yusuf.updated@example.com",
                        "+968 99887766",
                        student
                );

        when(
                studentProfileRepository
                        .findByStudentId(9)
        ).thenReturn(
                Optional.of(existingProfile)
        );

        when(
                studentProfileRepository
                        .save(any(StudentProfile.class))
        ).thenReturn(
                updatedProfile
        );

        mockMvc.perform(
                        put(
                                "/api/profiles/student/9"
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                    {
                                      "email": "yusuf.updated@example.com",
                                      "phoneNumber": "+968 99887766"
                                    }
                                    """)
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(2)
                )
                .andExpect(
                        jsonPath("$.email")
                                .value(
                                        "yusuf.updated@example.com"
                                )
                )
                .andExpect(
                        jsonPath("$.phoneNumber")
                                .value(
                                        "+968 99887766"
                                )
                )
                .andExpect(
                        jsonPath("$.studentId")
                                .value(9)
                )
                .andExpect(
                        jsonPath("$.studentName")
                                .value("Yusuf")
                );
    }
}