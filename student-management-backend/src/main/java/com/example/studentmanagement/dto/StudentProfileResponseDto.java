package com.example.studentmanagement.dto;

public class StudentProfileResponseDto {

    private Integer id;
    private String email;
    private String phoneNumber;
    private Integer studentId;
    private String studentName;

    public StudentProfileResponseDto(
            Integer id,
            String email,
            String phoneNumber,
            Integer studentId,
            String studentName) {

        this.id = id;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.studentId = studentId;
        this.studentName = studentName;
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }
}