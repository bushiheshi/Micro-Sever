-- 创建患者表
CREATE TABLE patients (
                          patientId INT PRIMARY KEY,
                          email VARCHAR(255) NOT NULL,
                          password VARCHAR(255) NOT NULL,
                          IDCardWord VARCHAR(20) NOT NULL,
                          name VARCHAR(100) NOT NULL,
                          gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female'))
);

-- 创建医生表
CREATE TABLE doctors (
                         doctorId INT PRIMARY KEY,
                         email VARCHAR(255) NOT NULL,
                         password VARCHAR(255) NOT NULL,
                         IDCardWord VARCHAR(20) NOT NULL,
                         name VARCHAR(100) NOT NULL,
                         gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
                         titleId INT NOT NULL,
                         introduction TEXT NOT NULL,
                         departmentId INT NOT NULL,
                         FOREIGN KEY (titleId) REFERENCES titles(titleId),
                         FOREIGN KEY (departmentId) REFERENCES departments(departmentId)
);

-- 创建科室表
CREATE TABLE departments (
                             departmentId INT PRIMARY KEY,
                             departmentName1 VARCHAR(100) NOT NULL,
                             departmentName2 VARCHAR(100) NOT NULL
);

-- 创建工作时间表
CREATE TABLE workingHours (
                               doctorId INT NOT NULL,
                               dayOfWeek VARCHAR(10) NOT NULL,
                               startTimeMorning TIME NOT NULL,
                               endTimeMorning TIME NOT NULL,
                               startTimeAfternoon TIME NOT NULL,
                               endTimeAfternoon TIME NOT NULL,
                               PRIMARY KEY (doctorId, dayOfWeek),
                               FOREIGN KEY (doctorId) REFERENCES doctors(doctorId)
);

-- 创建预约表
CREATE TABLE appointments (
                              orderId INT PRIMARY KEY,
                              patientId INT NOT NULL,
                              doctorId INT NOT NULL,
                              appointmentDate DATE NOT NULL,
                              appointmentTime TIME NOT NULL,
                              status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed')),
                              FOREIGN KEY (patientId) REFERENCES patients(patientId),
                              FOREIGN KEY (doctorId) REFERENCES doctors(doctorId)
);

-- 创建通知表
CREATE TABLE notifications (
                               notificationId INT PRIMARY KEY,
                               patientId INT NOT NULL,
                               doctorId INT NOT NULL,
                               message TEXT NOT NULL,
                               sentTime TIMESTAMP NOT NULL,
                               direction INT NOT NULL CHECK (direction IN (0, 1)),
                               status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
                               FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
                               FOREIGN KEY (patientId) REFERENCES patients(patientId)
);

-- 创建职称表
CREATE TABLE titles (
                        titleId INT PRIMARY KEY,
                        titleName VARCHAR(100) NOT NULL
);