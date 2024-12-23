import request from '@/utils/request.js'
import axios from 'axios';

const BASE_URL = 'http://121.40.197.3:10010'; // 确保包含协议 (http:// 或 https://)
//得到全部医生的id
export const getAllDoctorID = async () => {
    try {
        const response = await request.get('/doctor/getDoctorIds');
        return response;
    } catch (error) {
        console.error('Failed to fetch doctor IDs:', error);
        throw error;
    }
};

//得到指定医生的详细信息
export const getDoctorInfo = async(doctorId) => {
    try {
        const response = await request.get(`/doctor/getDoctor/${doctorId}`);
        return response;
    } catch(error) {
        console.error('Failed to get DoctorInfo:', error);
        throw error;
    }
}

//得到全部医生的信息
export const getAllDoctorInfo=async()=>{
    try{
        const response =await request.get(`${BASE_URL}/doctor/getAllDoctors`);
        return response;
    }catch(error){
        console.error('Failed to get all DoctorInfo:',error);
        throw error;
    }
}

//删除医生
export const deleteDoctor = async(doctorId)=>{
    try{
        console.log('正在删除医生:', {
            url: `${BASE_URL}/doctor/deleteDoctor/${doctorId}`,
            doctorId: doctorId
        });

        // 确保 doctorId 是数字类型
        const response = await request.delete(`${BASE_URL}/doctor/deleteDoctor/${parseInt(doctorId)}`);
        
        console.log('删除医生响应:', response);
        return response;
    }catch(error){
        console.error('删除医生失败:', {
            error: error,
            doctorId: doctorId,
            url: `${BASE_URL}/doctor/deleteDoctor/${doctorId}`,
            response: error.response?.data
        });
        throw error;
    }
}

//医生更新个人信息（管理员进行更新）
export const updateDoctorInfo = async (doctorId, updateData) => {
    try {
        console.log('发送更新请求:', {
            url: `${BASE_URL}/doctor/updateDoctor/${doctorId}`,
            data: updateData
        });
        
        const response = await request.put(`${BASE_URL}/doctor/updateDoctor/${doctorId}`, updateData);
        return response;
    } catch (error) {
        console.error('Failed to update doctorInfo:', {
            error: error,
            requestData: updateData,
            response: error.response?.data
        });
        throw error;
    }
}

//获取医生未完成预约
export const getUnFinishedByDoctor = async(doctorId) => {
    try {
        const response = await request.get(`/appointment/unFinishedByDoctor/${doctorId}`);
        return response;
    } catch (error) {
        console.error('Failed to get unfinished appointment:', error);
        if (error.response?.status === 400) {
            console.log('服务器返回的错误信息:', error.response.data);
        }
        return [];
    }
}

//获取医生已完成预约
export const getFinishedByDoctor = async(doctorId)=>{
    try{
        const response =await request.get(`${BASE_URL}/appointment/finishedByDoctor/${doctorId}`);
        return response;

    }catch(error){
        console.error('Failed to get finished appointment:',error);
        throw error;
    }
}

//获取医生过期预约
export const getExpiredByDoctor = async(doctorId)=>{
    try{
        const response=await request.get(`${BASE_URL}/appointment/expiredByDoctor/${doctorId}`);
        return response;
    }catch(error){
        console.error('Failed to get expired appointment:',error);
        throw error;
    }
}

//根据医生ID获取相关预约的预约ID以及患者ID
export const getPatientIDByDoctor=async(doctorId)=>{
    try{
        const response=await request.get(`${BASE_URL}/appointment/patientIdsByDoctor/${doctorId}`);
        return response;

    }catch(error){
        console.error('Failed to get patientID and appointmentID:',error);
        throw error;
    }
}
// 根据科室ID获取医生列表
export const getDoctorsByDepartment = async (departmentId) => {
    try {
      const response = await request.get(`${BASE_URL}/doctor/department/${departmentId}`);
      // 如果需要，直接获取每个生的详细信息
      if (Array.isArray(response)) {
        const doctorsWithDetails = await Promise.all(
          response.map(async (doctorId) => {
            const doctorInfo = await getDoctorInfo(doctorId);
            return doctorInfo;
          })
        );
        return { data: doctorsWithDetails };
      }
      return response;
    } catch (error) {
      console.error('Failed to get doctors by department:', error);
      throw error;
    }
  };
//标记为预约完成
export const markAsFinished = async(appointmentId)=>{
    try{
        await request.get(`${BASE_URL}/appointment/markAsFinished/${appointmentId}`);

    }catch (error){
        console.error('Failed to mark this appointment as finished:',error);
        throw error;
    }
}

//提醒预约

export const remindAppointment = async()=>{
    try{
        await request.get(`${BASE_URL}/appointment/remindAppointment/${doctorId}`);
    }catch (error){
        console.error('Failed to get unfinished appointment:',error);
        throw error;
    }
}

export const updateWorkingHour = async (doctorId, workingHourData) => {
    try {
        const response = await request.post(`${BASE_URL}/administrator/updateWorkingHour/${doctorId}`, {
            dayOfWeek: workingHourData.dayOfWeek,
            startTimeMorning: workingHourData.startTimeMorning,
            endTimeMorning: workingHourData.endTimeMorning,
            startTimeAfternoon: workingHourData.startTimeAfternoon,
            endTimeAfternoon: workingHourData.endTimeAfternoon
        });
        
        if (response.status === 200) {
            return {
                success: true,
                message: '工作时间更新成功',
                data: response
            };
        } else {
            throw new Error('更新工作时间失败');
        }
    } catch (error) {
        console.error('更新工作时间失败:', error);
        return {
            success: false,
            message: error.response?.data?.message || '更新工作时间失败，请稍后重试',
            error: error
        };
    }
};

// 获取医生工作时间的函数
export const getDoctorWorkingHours = async (doctorId) => {
    try {
        console.log('调用获取工作时间 API:', {
            url: `${BASE_URL}/administrator/getWorkingHoursByDoctor/${doctorId}`,
            doctorId: doctorId
        });
        
        const response = await request.get(`${BASE_URL}/administrator/getWorkingHoursByDoctor/${doctorId}`);
        console.log('API 响应:', response);
        
        return {
            data: response
        };
    } catch (error) {
        console.error('获取工作时间失败:', {
            error: error,
            doctorId: doctorId,
            response: error.response?.data
        });
        if (error.response?.status === 404) {
            console.log('找不到工作时间数据');
        }
        return {
            data: [] // 错误时返回空数组
        };
    }
};

//编辑医生工作时间表
export const editDoctorWorkingHours = async (workingHourData) => {
    try {
        const response = await request.put(`${BASE_URL}/administrator/updateWorkingHour`, workingHourData);
        return response;
    } catch (error) {
        console.error('Failed to edit doctor working hours:', error);
        throw error;
    }
};

//删除医生某天工作时间表
export const deleteDoctorWorkingHours = async (doctorId,dayOfWeek) => {
    try {
        const response = await request.delete(`${BASE_URL}/administrator/deleteWorkingHour/${doctorId}/${dayOfWeek}`);
        return response;
    } catch (error) {
        console.error('Failed to delete doctor working hours:', error);
        throw error;
    }
};  

//删除医生所有工作时间表
export const deleteDoctorAllWorkingHours = async (doctorId) => {
    try {
        const response = await request.delete(`${BASE_URL}/administrator/deleteWorkingHoursByDoctor/${doctorId}`);
        return response;
    } catch (error) {
        console.error('Failed to delete doctor all working hours:', error);
        throw error;
    }
};

//创建医生工作时间表
export const createDoctorWorkingHours = async (workingHourData) => {
    try {
        const response = await request.post(`${BASE_URL}/administrator/createWorkingHour`, workingHourData);
        return response;
    } catch (error) {
        console.error('Failed to create doctor working hours:', error);
        throw error;
    }
};  

//医生注册
export const doctorRegister = async (doctorData) => {
    try {
        const response = await request.post(`${BASE_URL}/doctor/createDoctor`, doctorData);
        return response;
    } catch (error) {
        console.error('Failed to register doctor:', error);
        throw error;
    }
};  
//创建预约
export const createAppointment = async(appointmentData)=>{
    try{
        const response = await request.post('/appointment/createAppointment',appointmentData);
        return response;
    }catch(error){
        console.error('Failed to create appointment:',error);
        throw error;
    }
}