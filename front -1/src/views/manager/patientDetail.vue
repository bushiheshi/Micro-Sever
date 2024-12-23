<template>
  <div class="patient-detail">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" type="primary" plain>
        <el-icon><ArrowLeft /></el-icon> 返回列表
      </el-button>
    </div>

    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <h3>患者基本信息</h3>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="姓名">{{ patientInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ patientInfo.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ patientInfo.age }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ patientInfo.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ patientInfo.idCard }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ patientInfo.address }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 预约记录卡片 -->
    <el-card class="appointment-card">
      <template #header>
        <div class="card-header">
          <h3>预约记录</h3>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="未完成预约" name="unfinished">
          <appointment-table :appointments="unfinishedAppointments" type="unfinished" />
        </el-tab-pane>
        <el-tab-pane label="已完成预约" name="finished">
          <appointment-table :appointments="finishedAppointments" type="finished" />
        </el-tab-pane>
        <el-tab-pane label="已过期预约" name="expired">
          <appointment-table :appointments="expiredAppointments" type="expired" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import {
  getPatientInfo,
  getUnFinishedByPatient,
  getFinishedByPatient,
  getExpiredByPatient
} from '@/api/patientAPI';
import { getDoctorInfo } from '@/api/doctorAPI';
import AppointmentTable from '@/components/AppointmentTable.vue';

const route = useRoute();
const router = useRouter();
const patientId = route.params.id;

// 组件状态
const loading = ref(false);
const activeTab = ref('unfinished');
const patientInfo = ref({});
const unfinishedAppointments = ref([]);
const finishedAppointments = ref([]);
const expiredAppointments = ref([]);

// 返回列表页
const goBack = () => {
  router.back();
};

// 获取患者信息
const fetchPatientInfo = async () => {
  loading.value = true;
  try {
    const info = await getPatientInfo(patientId);
    patientInfo.value = {
      ...info,
      age: calculateAge(info.birthDate)
    };
  } catch (error) {
    console.error('Error fetching patient info:', error);
    ElMessage.error('获取患者信息失败');
  } finally {
    loading.value = false;
  }
};

// 获取预约记录
const fetchAppointments = async () => {
  try {
    // 分别获取各类预约信息
    let [unfinished, finished, expired] = [[], [], []];

    try {
      unfinished = await getUnFinishedByPatient(patientId);
    } catch (error) {
      console.error('Error fetching unfinished appointments:', error);
      unfinished = [];
    }

    try {
      finished = await getFinishedByPatient(patientId);
    } catch (error) {
      console.error('Error fetching finished appointments:', error);
      finished = [];
    }

    try {
      expired = await getExpiredByPatient(patientId);
    } catch (error) {
      console.error('Error fetching expired appointments:', error);
      expired = [];
    }

    // 处理预约信息
    unfinishedAppointments.value = await processAppointments(unfinished);
    finishedAppointments.value = await processAppointments(finished);
    expiredAppointments.value = await processAppointments(expired);
  } catch (error) {
    console.error('Error processing appointments:', error);
    ElMessage.error('获取预约记录失败');
  }
};

// 处理预约信息
const processAppointments = async (appointments) => {
  if (!Array.isArray(appointments)) return [];

  try {
    const processedAppointments = await Promise.all(appointments.map(async (appointment) => {
      if (!appointment) return null;

      try {
        const doctorId = appointment.doctorId || appointment.doctor?.id || appointment.doctor;
        if (!doctorId) return null;

        const doctorInfo = await getDoctorInfo(doctorId);
        return {
          ...appointment,
          appointmentId: appointment.appointmentId || appointment.id,
          doctorId: doctorId,
          doctorName: doctorInfo?.name || '未知医生',
          departmentName: doctorInfo?.departmentName || '未知科室',
          status: appointment.status || 'UNKNOWN',
          appointmentDate: appointment.appointmentDate || appointment.date,
          appointmentTime: appointment.appointmentTime || appointment.time
        };
      } catch (error) {
        return null;
      }
    }));

    return processedAppointments.filter(item => item !== null);
  } catch (error) {
    console.error('Error processing appointments:', error);
    return [];
  }
};

// 计算年龄
const calculateAge = (birthDate) => {
  if (!birthDate) return '未知';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age}岁`;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPatientInfo();
  fetchAppointments();
});
</script>

<style scoped>
.patient-detail {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
}

.info-card,
.appointment-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

:deep(.el-descriptions) {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f8f9fa;
}
</style> 