package com.example.studentmanagement.service;

import com.example.studentmanagement.exception.StudentNotFoundException;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentService(
            StudentRepository studentRepository,
            DepartmentRepository departmentRepository) {

        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {

        return studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new StudentNotFoundException(
                                "Student with ID " + id + " not found"
                        )
                );
    }

    public List<Student> getStudentsByCourse(String course) {
        return studentRepository.findByCourse(course);
    }

    public List<Student> getStudentsByMinimumAge(int age) {
        return studentRepository.findStudentsByMinimumAge(age);
    }

    public List<Student> searchStudentsByName(String name) {
        return studentRepository.searchStudentsByName(name);
    }

    public Student createStudent(
            String name,
            int age,
            String course,
            Integer departmentId) {

        Department department = departmentRepository
                .findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department with ID "
                                        + departmentId
                                        + " not found"
                        )
                );

        Student student = new Student(
                null,
                name,
                age,
                course,
                department
        );

        return studentRepository.save(student);
    }

    public Student updateStudent(
            Integer id,
            String name,
            int age,
            String course,
            Integer departmentId) {

        Student existingStudent = getStudentById(id);

        Department department = departmentRepository
                .findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department with ID "
                                        + departmentId
                                        + " not found"
                        )
                );

        existingStudent.setName(name);
        existingStudent.setAge(age);
        existingStudent.setCourse(course);
        existingStudent.setDepartment(department);

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Integer id) {

        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            );
        }

        studentRepository.deleteById(id);
    }
}