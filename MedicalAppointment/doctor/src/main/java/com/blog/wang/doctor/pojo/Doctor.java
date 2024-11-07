package com.blog.wang.doctor.pojo;

import jakarta.persistence.*;

@Entity
@Table(name="doctors")
public class Doctor {

    @Id
    @Column(name="doctorId")
    private int doctorId;

    @Column(nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(name="IDCardWord",nullable=false,length=20)
    private String IDCardWord;

    @Column(nullable=false)
    private String name;

    @Column(nullable=false)
    private int gender;

    @Column(nullable=false)
    private String introduction;

    @ManyToOne // 多对一关系
    @JoinColumn(name = "titleId", nullable = false) // 外键列
    private Title title; // 引用 Title 实体

    @ManyToOne // 多对一关系
    @JoinColumn(name = "departmentId", nullable = false) // 外键列
    private Department department; // 引用 Department 实体

    public Integer getDoctorId(){
        return doctorId;
    }
    public void setDoctorId(int doctorId){
        this.doctorId = doctorId;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public String getIDCardWord(){
        return IDCardWord;
    }
    public void setIDCardWord(String IDCardWord){
        this.IDCardWord = IDCardWord;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }
    public int getGender(){
        return gender;
    }
    public void setGender(int gender){
        if (gender < 0 || gender > 1) {
            throw new IllegalArgumentException("Gender must be 0 (male) or 1 (female)");
        }
        this.gender = gender;
    }
    public String getIntroduction(){
        return introduction;
    }
    public void setIntroduction(String introduction){
        this.introduction = introduction;
    }
    public Title getTitle(){
        return title;
    }
    public void setTitle(Title title){
        this.title = title;
    }
    public Department getDepartment(){
        return department;
    }
    public void setDepartment(Department department){
        this.department = department;
    }

}
