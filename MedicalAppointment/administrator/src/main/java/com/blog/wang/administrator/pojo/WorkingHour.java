package com.blog.wang.administrator.pojo;

import jakarta.persistence.*;

import java.sql.Time;

@Entity
@Table(name="workingHours")
@IdClass(WorkingHourId.class)
public class WorkingHour {

    @Id
    @Column(name="doctorId")
    private int doctorId;

    @Id
    @Column(name="dayOfWeek", nullable = false, length=10)
    private String dayOfWeek;

    @Column(name="startTimeMorning", nullable = false)
    private Time startTimeMorning;

    @Column(name="endTimeMorning", nullable = false)
    private Time endTimeMorning;

    @Column(name="startTimeAfternoon", nullable = false)
    private Time startTimeAfternoon;

    @Column(name="endTimeAfternoon", nullable = false)
    private Time endTimeAfternoon;

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
        // 定义允许的值
        String[] validDays = {"SUN", "SAT", "MON", "TUE", "WED", "THU", "FRI"};
        // 检查传入的值是否有效
        for (String validDay : validDays) {
            if (validDay.equals(dayOfWeek)) {
                this.dayOfWeek = dayOfWeek;
                return; // 如果有效，设置并返回
            }
        }
        // 如果无效，抛出异常
        throw new IllegalArgumentException("Invalid day of the week: " + dayOfWeek);
    }

    public Time getStartTimeMorning() {
        return startTimeMorning;
    }

    public void setStartTimeMorning(Time startTimeMorning) {
        this.startTimeMorning = startTimeMorning;
    }

    public Time getEndTimeMorning() {
        return endTimeMorning;
    }

    public void setEndTimeMorning(Time endTimeMorning) {
        this.endTimeMorning = endTimeMorning;
    }

    public Time getStartTimeAfternoon() {
        return startTimeAfternoon;
    }

    public void setStartTimeAfternoon(Time startTimeAfternoon) {
        this.startTimeAfternoon = startTimeAfternoon;
    }

    public Time getEndTimeAfternoon() {
        return endTimeAfternoon;
    }

    public void setEndTimeAfternoon(Time endTimeAfternoon) {
        this.endTimeAfternoon = endTimeAfternoon;
    }

}
