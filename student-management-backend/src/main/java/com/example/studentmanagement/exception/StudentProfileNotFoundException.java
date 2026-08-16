package com.example.studentmanagement.exception;

public class StudentProfileNotFoundException
        extends RuntimeException {

    public StudentProfileNotFoundException(
            Integer studentId) {

        super(
                "Profile for student ID "
                        + studentId
                        + " not found"
        );
    }
}