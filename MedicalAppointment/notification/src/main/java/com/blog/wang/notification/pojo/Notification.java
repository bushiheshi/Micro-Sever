package com.blog.wang.notification.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.security.Timestamp;

@Entity
@Table(name="notifications")
public class Notification {

    @Id
    @Column(name="notificationId")
    private int notificationId;

    @Column(name="patientId", nullable = false)
    private int patientId;

    @Column(name="doctorId", nullable = false)
    private int doctorId;

    @Column(nullable = false)
    private String message;

    @Column(name="sentTime", nullable = false)
    private Timestamp sentTime;

    @Column(nullable = false)
    private int direction;  //0为患者给医生，1为医生给患者

    @Column(nullable = false)
    private int status;  //0为未读，1为已读

    public int getNotificationId() {
        return notificationId;
    }
    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
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
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Timestamp getSentTime() {
        return sentTime;
    }
    public void setSentTime(Timestamp sentTime) {
        this.sentTime = sentTime;
    }
    public int getDirection() {
        return direction;
    }
    public void setDirection(int direction) {
        if (direction < 0 || direction > 1) {
            throw new IllegalArgumentException("direction must be 0 (male) or 1 (female)");
        }
        this.direction = direction;
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
