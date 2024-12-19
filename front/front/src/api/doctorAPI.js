import request from '@/utils/request.js'
import axios from 'axios';

const BASE_URL = 'http://121.40.197.3:10010'; // 确保包含协议 (http:// 或 https://)
//得到全部医生的id
export const getAllDoctorID = async () => {
    try {
        // 发送 GET 请求并等待响应
        const response = await axios.get(`${BASE_URL}/doctor/getDoctorIds`);

        // 假设服务器返回的数据是 { data: [/* 医生 ID 列表 */] }
        // 返回医生 ID 列表
        return response.data; // 根据实际情况调整

    } catch (error) {
        // 处理错误
        console.error('Failed to fetch doctor IDs:', error);
        throw error; // 重新抛出错误以便调用者可以处理
    }
};

//得到指定医生的详细信息
export  const getDoctorInfo = async(doctorId)=>{
    try{
        const response=await  axios.get(`${BASE_URL}/doctor/getDoctor/${doctorId}`);
        return response.data;
    }catch(error){
        console.error('Failed to get DoctorInfo:',error);
        throw error;
    }
}

//得到全部医生的信息
export const getAllDoctorInfo=async()=>{
    try{
        const response =await axios.get(`${BASE_URL}/doctor/getAllDoctors`);
        return response.data;
    }catch(error){
        console.error('Failed to get all DoctorInfo:',error);
        throw error;
    }
}

//删除医生
export const deleteDoctor = async(doctorId)=>{
    try{
        const response =await axios.delete(`${BASE_URL}/doctor/deleteDoctor/${doctorId}`);
        return response.data;
    }catch(error){
        console.error('Failed to delete doctor:',error);
        throw error;
    }
}

//医生更新个人信息（管理员进行更新）
export const updateDoctorInfo=async(doctorId,updateData)=>{
    try{
        const response=await axios.patch(`${BASE_URL}/doctor/updateDoctor/${doctorId}`);
        return response.data;

    }catch(error){
        console.error('Failed to update doctorInfo:',error);
        throw error;
    }
}

//获取医生未完成预约
export const getUnFinishedByDoctor = async(doctorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/appointment/unFinishedByDoctor/${doctorId}`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error('获取未完成预约失败');
    } catch (error) {
        console.error('Failed to get unfinished appointment:', error);
        if (error.response?.status === 400) {
            console.log('服务器返回的错误信息:', error.response.data);
        }
        return []; // 返回空数组而不是抛出错误
    }
}

//获取医生已完成预约
export const getFinishedByDoctor = async(doctorId)=>{
    try{
        const response =await axios.get(`${BASE_URL}/appointment/finishedByDoctor/${doctorId}`);
        return response.data;

    }catch(error){
        console.error('Failed to get finished appointment:',error);
        throw error;
    }
}

//获取医生过期预约
export const getExpiredByDoctor = async(doctorId)=>{
    try{
        const response=await axios.get(`${BASE_URL}/appointment/expiredByDoctor/${doctorId}`);
        return response.data;
    }catch(error){
        console.error('Failed to get expired appointment:',error);
        throw error;
    }
}

//根据医生ID获取相关预约的预约ID以及患者ID
export const getPatientIDByDoctor=async(doctorId)=>{
    try{
        const response=await axios.get(`${BASE_URL}/appointment/patientIdsByDoctor/${doctorId}`);
        return response.data;

    }catch(error){
        console.error('Failed to get patientID and appointmentID:',error);
        throw error;
    }
}
// 根据科室ID获取医生列表
export const getDoctorsByDepartment = async (departmentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/doctor/department/${departmentId}`);
      // 如果需要，直接获取每个医生的详细信息
      if (Array.isArray(response.data)) {
        const doctorsWithDetails = await Promise.all(
          response.data.map(async (doctorId) => {
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
        await axios.get(`${BASE_URL}/appointment/markAsFinished/${appointmentId}`);

    }catch (error){
        console.error('Failed to mark this appointment as finished:',error);
        throw error;
    }
}

//提醒预约

export const remindAppointment = async()=>{
    try{
        await axios.get(`${BASE_URL}/appointment/remindAppointment/${doctorId}`);
    }catch (error){
        console.error('Failed to get unfinished appointment:',error);
        throw error;
    }
}

export const updateWorkingHour = async (doctorId, workingHourData) => {
    try {
        const response = await axios.post(`${BASE_URL}/administrator/updateWorkingHour/${doctorId}`, {
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
                data: response.data
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
        const response = await axios.get(`${BASE_URL}/administrator/getWorkingHoursByDoctor/${doctorId}`);
        console.log("done3");
        return {
            data: response.data
        };
    } catch (error) {
        console.error('获取工作时间失败:', error);
        if (error.response?.status === 404) {
            console.log('找不到工作时间数据');
        }
        return {
            data: [] // 错误时返回空数组
        };
    }
};