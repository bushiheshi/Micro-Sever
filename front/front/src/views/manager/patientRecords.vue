<template>
  <div class="patient-records">
    <!-- 患者列表表格 -->
    <el-table
      :data="patientList"
      border
      v-loading="loading"
      @row-click="handlePatientClick"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="patientId" label="患者ID" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="age" label="年龄" width="80" />
      <el-table-column prop="phone" label="联系电话" width="150" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click.stop="showDetails(scope.row)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 患者详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="患者详细信息"
      width="80%"
      destroy-on-close
    >
      <div v-loading="detailsLoading">
        <!-- 基本信息 -->
        <h3>基本信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="姓名">{{ currentPatient.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentPatient.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ currentPatient.age }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentPatient.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ currentPatient.idCard }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ currentPatient.address }}</el-descriptions-item>
        </el-descriptions>

        <!-- 预约信息标签页 -->
        <div class="appointment-tabs">
          <h3>预约记录</h3>
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
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllPatientID,
  getPatientInfo,
  getUnFinishedByPatient,
  getFinishedByPatient,
  getExpiredByPatient
} from '@/api/patientAPI';
import { getDoctorInfo } from '@/api/doctorAPI';
import { useRouter } from 'vue-router';

const router = useRouter();

// 组件状态
const loading = ref(false);
const detailsLoading = ref(false);
const dialogVisible = ref(false);
const activeTab = ref('unfinished');
const patientList = ref([]);
const currentPatient = ref({});
const unfinishedAppointments = ref([]);
const finishedAppointments = ref([]);
const expiredAppointments = ref([]);

// 获取所有患者列表
const fetchPatients = async () => {
  loading.value = true;
  try {
    const patientIds = await getAllPatientID();
    const patientsData = await Promise.all(
      patientIds.map(async (id) => {
        const info = await getPatientInfo(id);
        return {
          ...info,
          age: calculateAge(info.birthDate)
        };
      })
    );
    patientList.value = patientsData;
  } catch (error) {
    console.error('Error fetching patients:', error);
    ElMessage.error('获取患者列表失败');
  } finally {
    loading.value = false;
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

// 查看患者详情
const showDetails = (patient) => {
  router.push(`/manager/patient/${patient.patientId}`);
};

// 处理预约信息，添加医生和科室信息
const processAppointments = async (appointments) => {
  if (!Array.isArray(appointments)) {
    console.warn('Appointments is not an array:', appointments);
    return [];
  }

  try {
    const processedAppointments = await Promise.all(appointments.map(async (appointment) => {
      console.log('Processing appointment:', appointment);
      
      if (!appointment) {
        console.warn('Invalid appointment data:', appointment);
        return null;
      }

      try {
        // 确保 doctorId 存在，如果不存在使用默认值
        const doctorId = appointment.doctorId || appointment.doctor?.id || appointment.doctor;
        if (!doctorId) {
          console.warn('No doctor ID found in appointment:', appointment);
          return {
            ...appointment,
            doctorName: '未知医生',
            departmentName: '未知科室'
          };
        }

        const doctorInfo = await getDoctorInfo(doctorId);
        console.log('Doctor info for appointment:', doctorInfo);
        
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
        console.error(`Error processing appointment with doctor ID ${appointment.doctorId}:`, error);
        return {
          ...appointment,
          doctorName: '未知医生',
          departmentName: '未知科室'
        };
      }
    }));

    const validAppointments = processedAppointments.filter(item => item !== null);
    console.log('Processed appointments:', validAppointments);
    return validAppointments;
  } catch (error) {
    console.error('Error processing appointments:', error);
    return [];
  }
};

// 行点击事件
const handlePatientClick = (row) => {
  showDetails(row);
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPatients();
});
</script>

<style scoped>
.patient-records {
  padding: 20px;
}

.appointment-tabs {
  margin-top: 20px;
}

h3 {
  margin: 20px 0;
  color: #333;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style> 