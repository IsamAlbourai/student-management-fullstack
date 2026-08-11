package com.example.studentmanagement.dto;

public class StudentResponseDto {

    private Integer id;
    private String name;
    private int age;
    private String course;

    public StudentResponseDto(
            Integer id,
            String name,
            int age,
            String course) {

        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public String getCourse() {
        return course;
    }
}