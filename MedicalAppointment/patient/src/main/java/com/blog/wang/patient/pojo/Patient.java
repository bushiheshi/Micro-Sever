package com.blog.wang.patient.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="patientId")
    private Integer patientId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name="IDCardWord", nullable = false, length = 20)
    private String IDCardWord;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 10)
    private int gender;

    // Getters and Setters
    public int getPatientId() {
        return patientId;
    }
    public void setPatientId(int patient_id) {
        this.patientId = patientId;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getIDCardWord() {
        return IDCardWord;
    }
    public void setIDCardWord(String IDCardWord) {
        this.IDCardWord = IDCardWord;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getGender() {
        return gender;
    }
    public void setGender(int gender) {
        if (gender < 0 || gender > 1) {
            throw new IllegalArgumentException("Gender must be 0 (male) or 1 (female)");
        }
        this.gender = gender;
    }
}