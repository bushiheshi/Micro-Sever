package com.blog.wang.doctor.service;

import com.blog.wang.doctor.pojo.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
}
