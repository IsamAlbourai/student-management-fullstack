package com.example.studentmanagement.controller;

import com.example.studentmanagement.util.AppInfo;
import com.example.studentmanagement.util.RequestTracker;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/app")
public class AppInfoController {

    private final AppInfo appInfo;
    private final ObjectProvider<RequestTracker> requestTrackerProvider;

    public AppInfoController(
            AppInfo appInfo,
            ObjectProvider<RequestTracker> requestTrackerProvider) {

        this.appInfo = appInfo;
        this.requestTrackerProvider = requestTrackerProvider;
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getAppInfo() {

        RequestTracker requestTracker =
                requestTrackerProvider.getObject();

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("name", appInfo.getApplicationName());
        response.put("version", appInfo.getVersion());
        response.put("currentTime", appInfo.getCurrentTime());

        // Singleton bean
        response.put("appInfoInstanceId", appInfo.getInstanceId());

        // Prototype bean
        response.put("requestTrackerInstanceId",
                requestTracker.getInstanceId());

        return ResponseEntity.ok(response);
    }
}