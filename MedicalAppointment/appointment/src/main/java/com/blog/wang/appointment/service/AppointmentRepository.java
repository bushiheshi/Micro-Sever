package com.blog.wang.appointment.service;

import com.blog.wang.appointment.pojo.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
}
