package com.example.studentmanagement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StudentRequestDto {

    @NotBlank(message = "Name is required")
    @Size(
            min = 3,
            max = 100,
            message = "Name must be between 3 and 100 characters"
    )
    private String name;

    @Min(
            value = 18,
            message = "Age must be at least 18"
    )
    @Max(
            value = 120,
            message = "Age must not exceed 120"
    )
    private int age;

    @NotBlank(message = "Course is required")
    @Size(
            max = 100,
            message = "Course must not exceed 100 characters"
    )
    private String course;

    @NotNull(message = "Department ID is required")
    private Integer departmentId;

    public StudentRequestDto() {
    }

    public StudentRequestDto(
            String name,
            int age,
            String course,
            Integer departmentId) {

        this.name = name;
        this.age = age;
        this.course = course;
        this.departmentId = departmentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }
}