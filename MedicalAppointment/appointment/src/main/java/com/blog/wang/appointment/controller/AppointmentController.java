package com.blog.wang.appointment.controller;
import com.blog.wang.appointment.service.AppointmentRepository;
import com.blog.wang.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping(value="/getPatientIds")
    public List<Integer> getPatientIds() {
        return appointmentService.fetchPatientIds();
    }
}
