package com.example.studentmanagement.service;

import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void getStudentByIdShouldReturnStudent() {

        Department department = new Department();

        Student student = new Student(
                1,
                "Omar",
                23,
                "Software Engineering",
                department
        );

        when(studentRepository.findById(1))
                .thenReturn(Optional.of(student));

        Student result =
                studentService.getStudentById(1);

        assertEquals(1, result.getId());
        assertEquals("Omar", result.getName());
        assertEquals(23, result.getAge());
        assertEquals(
                "Software Engineering",
                result.getCourse()
        );
    }

    @Test
    void getStudentByIdShouldThrowExceptionWhenStudentDoesNotExist() {

        when(studentRepository.findById(99))
                .thenReturn(Optional.empty());

        StudentNotFoundException exception =
                assertThrows(
                        StudentNotFoundException.class,
                        () -> studentService.getStudentById(99)
                );

        assertEquals(
                "Student with ID 99 not found",
                exception.getMessage()
        );
    }

    @Test
    void createStudentShouldSaveStudent() {

        Department department = new Department();
        department.setId(1);
        department.setName("Computer Science");

        Student savedStudent = new Student(
                10,
                "Sara",
                24,
                "Computer Science",
                department
        );

        when(departmentRepository.findById(1))
                .thenReturn(Optional.of(department));

        when(studentRepository.save(any(Student.class)))
                .thenReturn(savedStudent);

        Student result =
                studentService.createStudent(
                        "Sara",
                        24,
                        "Computer Science",
                        1
                );

        assertEquals(10, result.getId());
        assertEquals("Sara", result.getName());
        assertEquals(24, result.getAge());

        verify(departmentRepository).findById(1);
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void updateStudentShouldUpdateAndSaveStudent() {

        Department oldDepartment = new Department();
        oldDepartment.setId(1);
        oldDepartment.setName("Computer Science");

        Department newDepartment = new Department();
        newDepartment.setId(2);
        newDepartment.setName("Information Technology");

        Student existingStudent = new Student(
                5,
                "Ali",
                21,
                "Computer Science",
                oldDepartment
        );

        when(studentRepository.findById(5))
                .thenReturn(Optional.of(existingStudent));

        when(departmentRepository.findById(2))
                .thenReturn(Optional.of(newDepartment));

        when(studentRepository.save(existingStudent))
                .thenReturn(existingStudent);

        Student result =
                studentService.updateStudent(
                        5,
                        "Ali Ahmed",
                        22,
                        "Information Technology",
                        2
                );

        assertEquals("Ali Ahmed", result.getName());
        assertEquals(22, result.getAge());
        assertEquals(
                "Information Technology",
                result.getCourse()
        );
        assertEquals(
                "Information Technology",
                result.getDepartment().getName()
        );

        verify(studentRepository).findById(5);
        verify(departmentRepository).findById(2);
        verify(studentRepository).save(existingStudent);
    }

    @Test
    void deleteStudentShouldDeleteExistingStudent() {

        when(studentRepository.existsById(5))
                .thenReturn(true);

        studentService.deleteStudent(5);

        verify(studentRepository).existsById(5);
        verify(studentRepository).deleteById(5);
    }

    @Test
    void deleteStudentShouldThrowExceptionWhenStudentDoesNotExist() {

        when(studentRepository.existsById(99))
                .thenReturn(false);

        StudentNotFoundException exception =
                assertThrows(
                        StudentNotFoundException.class,
                        () -> studentService.deleteStudent(99)
                );

        assertEquals(
                "Student with ID 99 not found",
                exception.getMessage()
        );

        verify(studentRepository).existsById(99);

        verify(
                studentRepository,
                never()
        ).deleteById(99);
    }
}