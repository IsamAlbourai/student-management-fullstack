package com.example.studentmanagement.dto;

public class DepartmentResponseDto {

    private Integer id;
    private String name;

    public DepartmentResponseDto(
            Integer id,
            String name) {

        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}