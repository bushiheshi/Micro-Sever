import instance from '@/utils/request';

// 医生登录（不需要token）
export const doctorLogin = async (loginData) => {
  return instance.post('/doctor/login', loginData);
};

// 获取所有医生ID
export const getAllDoctorID = async () => {
  return instance.get('/doctor/getDoctorIds');
};

// 获取医生信息
export const getDoctorInfo = async (doctorId) => {
  return instance.get(`/doctor/getDoctor/${doctorId}`);
};

// 获取所有医生信息（需要管理员token）
export const getAllDoctorInfo = async () => {
  const token = localStorage.getItem('adminToken');
  return request('get', '/doctor/getAllDoctors', null, token);
};

// 获取科室的医生
export const getDoctorsByDepartment = async (departmentId) => {
  const token = localStorage.getItem('adminToken');
  return request('get', `/doctor/getDoctorsByDepartment/${departmentId}`, null, token);
};

// 更新医生信息
export const updateDoctorInfo = async (doctorId, updateData) => {
  const token = localStorage.getItem('adminToken');
  return request('put', `/doctor/updateDoctor/${doctorId}`, updateData, token);
};

// 删除医生
export const deleteDoctor = async (doctorId) => {
  const token = localStorage.getItem('adminToken');
  return request('delete', `/doctor/deleteDoctor/${doctorId}`, null, token);
};

// 获取医生工作时间
export const getDoctorWorkingHours = async (doctorId) => {
  const token = localStorage.getItem('adminToken');
  return request('get', `/administrator/getWorkingHoursByDoctor/${doctorId}`, null, token);
};

// 更新医生工作时间
export const managerUpdateWorkingHour = async (data) => {
  const token = localStorage.getItem('adminToken');
  return request('post', '/administrator/updateWorkingHour', data, token);
};

// ... 其他函数类似修改
