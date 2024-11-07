package com.blog.wang.administrator.controller;

import com.blog.wang.administrator.service.AdministratorRepository;
import com.blog.wang.administrator.service.WorkingHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/administrator")
public class AdministratorController {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private WorkingHourRepository workingHourRepository;

    @GetMapping(value="/test0")
    public String test0()
    {
        return "test0";
    }

}
