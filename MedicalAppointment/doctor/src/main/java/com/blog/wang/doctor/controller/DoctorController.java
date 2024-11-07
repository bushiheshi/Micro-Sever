package com.blog.wang.doctor.controller;

import com.blog.wang.doctor.service.DepartmentRepository;
import com.blog.wang.doctor.service.DoctorRepository;
import com.blog.wang.doctor.service.TitleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/doctor")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private TitleRepository titleRepository;
}
