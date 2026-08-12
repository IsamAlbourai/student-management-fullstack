package com.example.studentmanagement.util;

import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class AppInfo {

    private final Clock clock;

    private final String instanceId = UUID.randomUUID().toString();

    public AppInfo(Clock clock) {
        this.clock = clock;
    }

    public String getApplicationName() {
        return "Student Management System";
    }

    public String getVersion() {
        return "1.0";
    }

    public LocalDateTime getCurrentTime() {
        return LocalDateTime.now(clock);
    }

    public String getInstanceId() {
        return instanceId;
    }
}