import request from '@/utils/request.js'
import axios from 'axios';

const BASE_URL = 'http://121.40.197.3:10010'; // 确保包含协议 (http:// 或 https://)

//获取所有职称
export const getAllTitles =async ()=>{
    try{
        const response = await axios.get(`${BASE_URL}/doctor/getAllTitles`);
        return response.data;
    }catch(error){
        console.error('Failed to get all titles:',error);
        throw error;
    }
}

//获取所有部门
export const getAllDepartments = async()=>{
    try{
        const response = await axios.get(`${BASE_URL}/doctor/getAllDepartments`);
        return response.data;
    }catch(error){
        console.error('Failed to get all departments:',error);
        throw error;
    }
}

//获取单个职称
export const getTitle = async(titleId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/doctor/getTitle/${titleId}`);
        return response.data;
    }catch(error){
        console.error('Failed to get title:',error);
        throw error;
    }
}

//获取单个部门
export const getDepartment = async(departmentId)=>{
    try{
        const response = await axios.get(`${BASE_URL}/doctor/getDepartment/${departmentId}`);
        return response.data;
    }catch(error){
        console.error('Failed to get department:',error);
        throw error;
    }
}

//创建通告
export const createAttention = async(attention)=>{
    try{
        const response = await axios.put(`${BASE_URL}/administrator/createAttention`,attention);
        return response.data;
    }catch(error){
        console.error('Failed to createAttention:',error);
        throw error;
    }
}

//获取所有通告信息
export const getAllAttention=async ()=>{
    try{
        const response = await axios.get(`${BASE_URL}/administrator/getAllAttentions`);
        return response.data;
    }catch(error){
        console.error('Failed to get all attentions:',error);
        throw error;
    }
}

//删除通告
export const deleteAttention = async(attentionId)=>{
    try{
        const response = await axios.delete(`${BASE_URL}/administrator/deleteAttention/${attentionId}`);
        return response.data;
    }catch(error){
        console.error('Failed to delete attention:',error);
        throw error;
    }
}

//编辑通告
export const updateAttention = async(attentionId,updateDate)=>{
    try{
        const response =await axios.put(`${BASE_URL}/administrator/updateAttention/${attentionId}`);
        return response.data;
    }catch(error){
        console.error('Failed to update attention:',error);
        throw error;
    }
}