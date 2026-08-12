package com.example.studentmanagement.repository;

import com.example.studentmanagement.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {

    List<Student> findByCourse(String course);

    @Query("SELECT s FROM Student s WHERE s.age >= :age")
    List<Student> findStudentsByMinimumAge(@Param("age") int age);

    @Query(
            value = "SELECT * FROM students WHERE name LIKE CONCAT('%', :name, '%')",
            nativeQuery = true
    )
    List<Student> searchStudentsByName(@Param("name") String name);
}