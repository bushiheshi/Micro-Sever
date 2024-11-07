package com.blog.wang.administrator.pojo;

import java.io.Serializable;
import java.util.Objects;

public class WorkingHourId implements Serializable {
    private int doctorId;
    private String dayOfWeek;

    // Default constructor
    public WorkingHourId() {}

    // Parameterized constructor
    public WorkingHourId(int doctorId, String dayOfWeek) {
        this.doctorId = doctorId;
        this.dayOfWeek = dayOfWeek;
    }

    // Getters and Setters
    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    // equals() and hashCode() methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WorkingHourId)) return false;
        WorkingHourId that = (WorkingHourId) o;
        return doctorId == that.doctorId && dayOfWeek.equals(that.dayOfWeek);
    }

    @Override
    public int hashCode() {
        return Objects.hash(doctorId, dayOfWeek);
    }
}