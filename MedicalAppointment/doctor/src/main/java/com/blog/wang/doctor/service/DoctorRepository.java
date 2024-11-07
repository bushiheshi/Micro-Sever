package com.blog.wang.doctor.service;

import com.blog.wang.doctor.pojo.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
}
