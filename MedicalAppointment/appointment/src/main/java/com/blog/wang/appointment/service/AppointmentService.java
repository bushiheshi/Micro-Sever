package com.blog.wang.appointment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private RestTemplate restTemplate;

    private final String PATIENT_SERVICE_URL = "http://localhost:8081/patient/getPatientIds"; // 假设患者服务运行在8080端口

    public List<Integer> fetchPatientIds() {
        // 调用患者服务的接口并获取患者 ID 列表
        List<Integer> patientIds = restTemplate.getForObject(PATIENT_SERVICE_URL, List.class);
        return patientIds;
    }
}
