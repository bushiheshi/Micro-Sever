package com.blog.wang.administrator.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="administrators")
public class Administrator {

    @Id
    @Column(name="administratorId")
    private Integer administratorId;

    @Column(nullable = false)
    private String password;

    // Getters and Setters
    public int getAdministratorId() {
        return administratorId;
    }
    public void setAdministratorId(int administratorId) {
        this.administratorId = administratorId;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
