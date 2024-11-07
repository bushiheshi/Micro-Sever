package com.blog.wang.doctor.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="titles")
public class Title {

    @Id
    @Column(name="titleId")
    private Integer titleId;

    @Column(name="titleName",nullable = false)
    private String titleName;

    public Integer getTitleId() {
        return titleId;
    }
    public void setTitleId(Integer titleId) {
        this.titleId = titleId;
    }
    public String getTitleName() {
        return titleName;
    }
    public void setTitleName(String titleName) {
        this.titleName = titleName;
    }

}
