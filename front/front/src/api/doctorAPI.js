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
export const getUnFinishedByDoctor = async(doctorId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/appointment/unFinishedByDoctor/${doctorId}`);
        return response.data;
    }catch (error){
        console.error('Failed to get unfinished appointment:',error);
        throw error;
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