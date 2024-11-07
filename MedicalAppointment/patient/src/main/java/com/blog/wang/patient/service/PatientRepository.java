package com.blog.wang.patient.service;

import com.blog.wang.patient.pojo.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
}
