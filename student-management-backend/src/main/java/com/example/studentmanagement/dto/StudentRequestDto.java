package com.example.studentmanagement.dto;

public class StudentRequestDto {

    private String name;
    private int age;
    private String course;
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