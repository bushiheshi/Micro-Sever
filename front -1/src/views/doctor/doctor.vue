<template>
  <div class="clinic-system">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="logo">
          <i class="fas fa-hospital-user"></i>
          医生工作站
        </div>
        <el-menu
          mode="horizontal"
          class="menu"
          background-color="#2d2d2d"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="schedule">
            <i class="fas fa-calendar-alt"></i> 我的日程
          </el-menu-item>
          <el-menu-item index="workingHours" @click="showWorkingHours">
            <i class="fas fa-clock"></i> 工作时间
          </el-menu-item>
          <el-menu-item index="consultation">
            <i class="fas fa-comments"></i> 在线咨询
          </el-menu-item>
        </el-menu>
        <div class="user-info">
          <span class="username" v-if="doctorData">
            <i class="fas fa-user-md"></i> {{ doctorData.name }}（医生）
          </span>
          <span class="username" v-else>
            <i class="fas fa-user-circle"></i> 请先登录
          </span>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleLogout"
            v-if="doctorData"
          >
            <i class="fas fa-sign-out-alt"></i> 退出登录
          </el-button>
        </div>
      </el-header>

      <!-- 主要内容区 -->
      <el-main class="main-content">
        <el-card class="calendar-card">
          <template #header>
            <div class="card-header">
              <h3><i class="fas fa-calendar-check"></i> 预约日历</h3>
              <el-button type="primary" size="small" @click="refreshAppointments">
                <i class="fas fa-sync"></i> 刷新
              </el-button>
            </div>
          </template>

          <!-- Calendar -->
          <el-calendar v-model="selectedDate">
            <template #dateCell="{ date, data }">
              <div class="date-content" :class="{ 'has-appointments': appointments[formatDate(data.day)] }">
                {{ formatDate(data.day) }}
                <span v-if="appointments[formatDate(data.day)]" class="badge">
                  {{ getUnFinishedNum(appointments[formatDate(data.day)]) }}
                </span>
              </div>
            </template>
          </el-calendar>
        </el-card>

        <!-- Appointments List -->
        <el-card class="appointments-card" v-if="appointments[selectedDateFormatted]?.length > 0">
          <template #header>
            <div class="card-header">
              <h3><i class="fas fa-list"></i> {{ selectedDateFormatted }} 的预约</h3>
            </div>
          </template>
          <el-collapse>
            <el-collapse-item 
              v-for="appointment in appointments[selectedDateFormatted]" 
              :key="appointment.appointmentId" 
              :title="`患者ID: ${appointment.patientId} - 预约时间: ${appointment.appointmentTime}`"
            >
              <div class="appointment-details">
                <p><i class="fas fa-hashtag"></i> <strong>预约ID:</strong> {{ appointment.appointmentId }}</p>
                <p><i class="fas fa-user"></i> <strong>患者ID:</strong> {{ appointment.patientId }}</p>
                <p><i class="fas fa-calendar"></i> <strong>预约日期:</strong> {{ appointment.appointmentDate }}</p>
                <p><i class="fas fa-clock"></i> <strong>预约时间:</strong> {{ appointment.appointmentTime }}</p>
                <p><i class="fas fa-info-circle"></i> <strong>状态:</strong> 
                  <el-tag :type="getStatusType(appointment.status)">
                    {{ getStatusText(appointment.status) }}
                  </el-tag>
                </p>
                <el-button 
                  type="success" 
                  size="small" 
                  @click="clickFinished(appointment)"
                  :disabled="appointment.status !== 0" 
                  v-if="appointment.status === 0"
                  style="text-align: center;"
                >
                  标记为完成
                </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
        <el-empty 
          v-else 
          description="当前日期没有预约" 
          :image-size="200"
        />
      </el-main>

      <!-- 在 el-main 结束标签前添加工作时间表弹窗 -->
      <el-dialog
        title="我的工作时间表"
        v-model="workingHoursVisible"
        width="60%"
      >
        <DoctorWorkingHours 
          :doctorId="doctorData?.doctorId"
          v-if="workingHoursVisible && doctorData?.doctorId"
        />
      </el-dialog>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, HomeFilled, Search, Delete } from '@element-plus/icons-vue';
import { getUnFinishedByDoctor,getFinishedByDoctor, getDoctorWorkingHours,markAsFinished } from '@/api/doctorAPI.js';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import DoctorWorkingHours from '@/components/DoctorWorkingHours.vue';

const router = useRouter();

// 修改 appointments 的类型定义
interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: number;
}

const appointments = ref<Record<string, Appointment[]>>({});

// 修改医生数据的类型定义
interface DoctorData {
  doctorId: number;
  email: string;
  password: string;
  name: string;
  gender: number;
  introduction: string;
  titleId: number;
  departmentId: number;
  idcardWord: string;
  IDCardWord: string;
}

const doctorData = ref<DoctorData | null>(null);

// 修改状态文本映射函数
function getStatusText(status: number): string {
  switch (status) {
    case 0:
      return '待诊';
    case 1:
      return '已完成';
    case 2:
      return '已过期';
    default:
      return '未知';
  }
}

// 修改获取预约的函数
const fetchAppointments = async () => {
  try {
    if (!doctorData.value?.doctorId) {
      console.error('医生ID未找到');
      return;
    }
    
    console.log("正在获取医生ID为", doctorData.value.doctorId, "的未完成预约");
    var unFinishedData = await getUnFinishedByDoctor(doctorData.value.doctorId);
    var finishedData = await getFinishedByDoctor(doctorData.value.doctorId);
    const data = unFinishedData.concat(finishedData)
    console.log(data)
    // 重置预约数���
    appointments.value = {};
    
    // 处理每个预约
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((appointment: Appointment) => {
        const date = appointment.appointmentDate;
        if (!appointments.value[date]) {
          appointments.value[date] = [];
        }
        appointments.value[date].push(appointment);
      });
      console.log('成功获取预约数据:', appointments.value);
    } else {
      console.log('没有预约');
    }
  } catch (error) {
    console.error("获取预约失败:", error);
    ElMessage.error('获取预约数据失败');
  }
};

onMounted(async () => {
  const savedDoctorInfo = localStorage.getItem('doctorInfo');
  if (savedDoctorInfo) {
    try {
      doctorData.value = JSON.parse(savedDoctorInfo);
      
      if (doctorData.value && doctorData.value.doctorId) {
        currentDoctorId.value = doctorData.value.doctorId.toString();
        setTimeout(() => {
          fetchAppointments();
        }, 100);
      } else {
        throw new Error('医生ID不存在');
      }
    } catch (error) {
      console.error('解析医生数据失败:', error);
      ElMessage.error('加载医生数据失败');
      router.push('/doctorLogin');
    }
  } else {
    console.error('未找到医生数据');
    ElMessage.warning('请先登录');
    router.push('/doctorLogin');
  }
});

// 添加刷新预约数据的方法
const refreshAppointments = async () => {
  await fetchAppointments();
};

const selectedDate = ref(new Date());

// 日期格式化函数
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const selectedDateFormatted = computed(() => {
  const date = new Date(selectedDate.value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});

// 退出登录处理
const handleLogout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('doctorInfo');
  doctorData.value = null;
  currentDoctorId.value = '';
  router.push('/doctorLogin');
};

const currentDoctorId = ref(''); // 需要设置实际的医生ID

// 添加状态类型判断函数
const getStatusType = (status: number): string => {
  switch (status) {
    case 0:
      return 'warning';  // 待诊
    case 1:
      return 'success';  // 已完成
    case 2:
      return 'info';     // 已过期
    default:
      return 'danger';   // 未知
  }
};

// 在 import 语句下添加
import { getDoctorWorkingHours } from '@/api/doctorAPI.js';

// 在 interface 定义区域添加
interface WorkingHour {
  workingHourId: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

// 在 ref 定义区域添加
const workingHoursVisible = ref(false);
const workingHours = ref<WorkingHour[]>([]);

// 添加获取工作时间的函数
const fetchWorkingHours = async () => {
  try {
    if (!doctorData.value?.doctorId) return;
    const response = await getDoctorWorkingHours(doctorData.value.doctorId);
    workingHours.value = response;
  } catch (error) {
    console.error('获取工作时间失败:', error);
    ElMessage.error('获取工作时间失败');
  }
};

// 添加显示工作时间表的函数
const showWorkingHours = async () => {
  await fetchWorkingHours();
  workingHoursVisible.value = true;
};

// 修改 el-menu-item 的点击事件
const clickFinished = (appointment) => {
  markAsFinished(appointment.appointmentId);
}

const getUnFinishedNum = (appointments): number => {
  return appointments.filter(appointment => appointment.status === 0).length;
}
</script>

<style scoped>
.clinic-system {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: #409EFF;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu {
  flex: 1;
  border: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-card, .appointments-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-content {
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.date-content.has-appointments {
  background-color: rgba(64, 158, 255, 0.1);
}

.badge {
  display: inline-block;
  background-color: #409EFF;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-left: 5px;
}

.appointment-details {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 10px;
}

.appointment-details p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.appointment-details i {
  color: #409EFF;
  width: 16px;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  font-size: 14px;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 2px solid #409EFF;
  color: #409EFF;
}

:deep(.el-calendar) {
  background-color: transparent;
}

:deep(.el-calendar-table .el-calendar-day) {
  height: 80px;
  padding: 8px;
}

:deep(.el-collapse-item__header) {
  font-size: 14px;
  color: #409EFF;
}

:deep(.el-tag) {
  border-radius: 4px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-table) {
  margin-top: 10px;
}
</style>