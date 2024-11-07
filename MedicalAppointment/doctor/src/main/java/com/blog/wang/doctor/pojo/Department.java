package com.blog.wang.doctor.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="departments")
public class Department {

    @Id
    @Column(name="departmentId")
    private Integer departmentId;

    @Column(name="departmentName1",nullable = false)
    private String departmentName1;

    @Column(name="departmentName2",nullable = false)
    private String departmentName2;

    // Getters and Setters
    public int getDepartmentId() {
        return departmentId;
    }
    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }
    public String getDepartmentName1() {
        return departmentName1;
    }
    public void setDepartmentName1(String departmentName1) {
        this.departmentName1 = departmentName1;
    }
    public String getDepartmentName2() {
        return departmentName2;
    }
    public void setDepartmentName2(String departmentName2) {
        this.departmentName2 = departmentName2;
    }

}
