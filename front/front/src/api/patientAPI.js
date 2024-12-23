import instance from '@/utils/request';

// 患者登录（不需要token）
export const patientLogin = async (loginData) => {
  return instance.post('/patient/login', {
    email: loginData.mail,
    password: loginData.password
  });
};

// 获取所有患者ID
export const getAllPatientID = async () => {
  return instance.get('/patient/getPatientIds');
};

// 获取患者信息
export const getPatientInfo = async (patientId) => {
  return instance.get(`/patient/getPatient/${patientId}`);
};

// 更新患者信息
export const updatePatientInfo = async (patientId, updateData) => {
  return instance.put(`/patient/updatePatient/${patientId}`, updateData);
};

// 获取患者接收的消息
export const getPatientMessage = async (patientId) => {
  return instance.get(`/notification/readByPatient/${patientId}`);
};

// 获取患者发送的消息
export const getPatientSendMessage = async (patientId) => {
  return instance.get(`/notification/sentByPatient/${patientId}`);
};

// 获取患者未完成预约
export const getUnFinishedByPatient = async (patientId) => {
  try {
    const response = await instance.get(`/appointment/unfinishedAppointmentsByPatient/${patientId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404 || 
        error.response?.data === "没有找到未完成的预约") {
      return [];
    }
    throw error;
  }
};

// 获取患者已完成预约
export const getFinishedByPatient = async (patientId) => {
  try {
    const response = await instance.get(`/appointment/finishedByPatient/${patientId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404 || 
        error.response?.data === "没有找到已完成的预约") {
      return [];
    }
    throw error;
  }
};

// 获取患者过期预约
export const getExpiredByPatient = async (patientId) => {
  try {
    const response = await instance.get(`/appointment/expiredByPatient/${patientId}`);
    return response;
  } catch (error) {
    if (error.response?.status === 404 || 
        error.response?.data === "没有找到过期的预约") {
      return [];
    }
    throw error;
  }
};

// 创建预约
export const createAppointment = async (appointmentData) => {
  return instance.post('/appointment/create', appointmentData);
};

// ... 其他函数类似修改

