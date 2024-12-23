import request from '@/utils/request.js'

//获取所有患者ID
export const getAllPatientID = async()=>{
    try{
        const response = await request.get('/patient/getPatientIds');
        return response;
    }catch(error){
        console.error('Failed to get all patient ID:',error);
        throw error;
    }
}
//查看患者个人信息
export const getPatientInfo = async(patientId)=>{
    try{
        const response = await request.get(`/patient/getPatient/${patientId}`);
        return response;
    }catch(error){
        console.error('Failed to get patient info:',error);
        throw error;
    }
}

//患者更新个人信息
export const updatePatientInfo = async(patientId,updateData)=>{
    try{
        const response = await request.put(`/patient/updatePatient/${patientId}`,updateData);
        return response;
    }catch(error){
        console.error('Failed to update patient info:',error);
        throw error;
    }
}

//获取患者接受的消息
export const getPatientMessage = async(patientId)=>{
    try{
        const response = await request.get(`/notification/readByPatient/${patientId}`);
        return response;
    }catch(error){
        console.error('Failed to get patient message:',error);
        throw error;
    }
}

//获取患者发送的消息
export const getPatientSendMessage = async(patientId)=>{
    try{
        const response = await request.get(`/notification/sentByPatient/${patientId}`);
        return response;
    }catch(error){
        console.error('Failed to get patient send message:',error);
        throw error;
    }
}

//获取患者未完成预约
export const getUnFinishedByPatient = async(patientId)=>{
    try{
        const response = await request.get(`/appointment/unfinishedAppointmentsByPatient/${patientId}`);
        return response;
    }catch(error){
        if (error.response?.status === 404 || 
            error.response?.data === "没有找到未完成的预约") {
            return [];
        }
        console.error('Failed to get patient unfinished appointment:',error);
        throw error;
    }
}

//获取患者已完成预约
export const getFinishedByPatient = async(patientId)=>{
    try{
        const response = await request.get(`/appointment/finishedByPatient/${patientId}`);
        return response;
    }catch(error){
        if (error.response?.status === 404 || 
            error.response?.data === "没有找到已完成的预约") {
            return [];
        }
        console.error('Failed to get patient finished appointment:',error);
        throw error;
    }
}

//获取患者过期预约
export const getExpiredByPatient = async(patientId)=>{
    try{
        const response = await request.get(`/appointment/expiredByPatient/${patientId}`);
        return response;
    }catch(error){
        if (error.response?.status === 404 || 
            error.response?.data === "没有找到过期的预约") {
            return [];
        }
        console.error('Failed to get patient expired appointment:',error);
        throw error;
    }
}
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