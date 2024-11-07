package com.blog.wang.administrator.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="attentions")
public class Attention {

    @Id
    @Column(name="attentionId")
    private Integer attentionId;

    @Column(name="attentionName", nullable=false)
    private String attentionName;

    @Column(name="releaseTime", nullable=false)
    private Timestamp releaseTime;

    @Column(nullable=false)
    private String content;

    public Integer getAttentionId() {
        return attentionId;
    }
    public void setAttentionId(Integer attentionId) {
        this.attentionId = attentionId;
    }
    public String getAttentionName() {
        return attentionName;
    }
    public void setAttentionName(String attentionName) {
        this.attentionName = attentionName;
    }
    public Timestamp getReleaseTime() {
        return releaseTime;
    }
    public void setReleaseTime(Timestamp releaseTime) {
        this.releaseTime = releaseTime;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }



}
