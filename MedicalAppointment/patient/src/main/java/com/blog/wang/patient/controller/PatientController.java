package com.blog.wang.patient.controller;

import com.blog.wang.patient.pojo.Patient;
import com.blog.wang.patient.service.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/patient")
public class PatientController {
    @Autowired
    private PatientRepository patientRepository;

    @GetMapping(value="/getPatients")
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @PostMapping(value="/createPatient")
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @GetMapping(value="/getPatientIds")
    public List<Integer> getPatientIds() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(Patient::getPatientId)
                .collect(Collectors.toList());
    }
    // 其他CRUD操作...
}