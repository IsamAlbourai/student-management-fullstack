package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    private Department department;

    @BeforeEach
    void setUp() {

        department = new Department();
        department.setName("Computer Science");

        department =
                departmentRepository.save(department);

        Student student1 = new Student(
                null,
                "Omar",
                23,
                "Software Engineering",
                department
        );

        Student student2 = new Student(
                null,
                "Sara",
                20,
                "Computer Science",
                department
        );

        Student student3 = new Student(
                null,
                "Omar Ahmed",
                25,
                "Computer Science",
                department
        );

        studentRepository.save(student1);
        studentRepository.save(student2);
        studentRepository.save(student3);
    }

    @Test
    void findAllShouldReturnAllStudents() {

        List<Student> students =
                studentRepository.findAll();

        assertEquals(
                3,
                students.size()
        );
    }

    @Test
    void findByCourseShouldReturnMatchingStudents() {

        List<Student> students =
                studentRepository.findByCourse(
                        "Computer Science"
                );

        assertEquals(
                2,
                students.size()
        );

        assertTrue(
                students.stream()
                        .allMatch(student ->
                                student.getCourse()
                                        .equals(
                                                "Computer Science"
                                        )
                        )
        );
    }

    @Test
    void findStudentsByMinimumAgeShouldReturnMatchingStudents() {

        List<Student> students =
                studentRepository
                        .findStudentsByMinimumAge(23);

        assertEquals(
                2,
                students.size()
        );

        assertTrue(
                students.stream()
                        .allMatch(student ->
                                student.getAge() >= 23
                        )
        );
    }

    @Test
    void searchStudentsByNameShouldReturnPartialMatches() {

        List<Student> students =
                studentRepository
                        .searchStudentsByName("Omar");

        assertEquals(
                2,
                students.size()
        );

        assertTrue(
                students.stream()
                        .allMatch(student ->
                                student.getName()
                                        .contains("Omar")
                        )
        );
    }

    @Test
    void deleteByIdShouldRemoveStudent() {

        Student student =
                studentRepository.findAll()
                        .getFirst();

        Integer id = student.getId();

        studentRepository.deleteById(id);

        assertFalse(
                studentRepository.existsById(id)
        );
    }
}