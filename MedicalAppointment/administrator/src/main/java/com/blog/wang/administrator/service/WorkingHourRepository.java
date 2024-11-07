package com.blog.wang.administrator.service;

import com.blog.wang.administrator.pojo.WorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingHourRepository extends JpaRepository<WorkingHour, Integer> {
}
