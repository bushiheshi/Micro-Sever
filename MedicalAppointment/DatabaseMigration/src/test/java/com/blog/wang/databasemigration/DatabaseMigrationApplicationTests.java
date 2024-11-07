package com.blog.wang.databasemigration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.PropertySource;

@PropertySource(value = "classpath:application.properties")
@SpringBootTest
class DatabaseMigrationApplicationTests {

    @Test
    void contextLoads() {
    }

}
