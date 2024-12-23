import instance from '@/utils/request';

// 管理员登录（不需要token）
export const adminLogin = async (loginData) => {
  return instance.post('/administrator/login', loginData);
};

// 获取所有预约信息
export const getAllAppointment = async () => {
  return instance.get('/appointment/allAppointments');
};

// 创建通告（需要token）
export const createAttention = async (attention) => {
  const token = localStorage.getItem('adminToken');
  return instance.post('/administrator/createAttention', attention, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// 获取所有职称
export const getAllTitles = async () => {
  return instance.get('/doctor/getAllTitles');
};

// 获取所有部门
export const getAllDepartments = async () => {
  return instance.get('/doctor/getAllDepartments');
};

// 获取单个职称
export const getTitle = async (titleId) => {
  return instance.get(`/doctor/getTitle/${titleId}`);
};

// 获取单个部门
export const getDepartment = async (departmentId) => {
  return instance.get(`/doctor/getDepartment/${departmentId}`);
};

// 获取所有通告信息
export const getAllAttention = async () => {
  return instance.get('/administrator/getAllAttentions');
};

// 删除通告
export const deleteAttention = async (attentionId) => {
  return instance.delete(`/administrator/deleteAttention/${attentionId}`);
};

// 编辑通告
export const updateAttention = async (attentionId, updateData) => {
  return instance.put(`/administrator/updateAttention/${attentionId}`, updateData);
};
