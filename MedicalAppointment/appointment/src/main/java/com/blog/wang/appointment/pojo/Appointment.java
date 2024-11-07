package com.blog.wang.appointment.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name="appointments")
public class Appointment {

    @Id
    @Column(name="appointmentId")
    private int appointmentId;

    @Column(name="patientId", nullable = false)
    private int patientId;

    @Column(name="doctorId", nullable = false)
    private int doctorId;

    @Column(name="appointmentDate", nullable = false)
    private Date appointmentDate;

    @Column(name="appointmentTime", nullable = false)
    private Time appointmentTime;

    @Column(nullable = false)
    private int status;  //0表示未完成的预约，1表示已完成的预约

    public int getAppointmentId() {
        return appointmentId;
    }
    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }
    public int getPatientId() {
        return patientId;
    }
    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }
    public int getDoctorId() {
        return doctorId;
    }
    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }
    public Date getAppointmentDate() {
        return appointmentDate;
    }
    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }
    public Time getAppointmentTime() {
        return appointmentTime;
    }
    public void setAppointmentTime(Time appointmentTime) {
        this.appointmentTime = appointmentTime;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        if (status < 0 || status > 1) {
            throw new IllegalArgumentException("status must be 0 (male) or 1 (female)");
        }
        this.status = status;
    }


}
