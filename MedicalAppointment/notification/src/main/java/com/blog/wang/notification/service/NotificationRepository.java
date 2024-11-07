package com.blog.wang.notification.service;

import com.blog.wang.notification.pojo.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer>{
}
