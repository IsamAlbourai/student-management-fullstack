package com.example.studentmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    public StudentProfile() {
    }

    public StudentProfile(
            Integer id,
            String email,
            String phoneNumber,
            Student student) {

        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.student = student;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}