package com.blog.wang.administrator.service;

import com.blog.wang.administrator.pojo.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministratorRepository extends JpaRepository<Administrator, Integer> {
}
