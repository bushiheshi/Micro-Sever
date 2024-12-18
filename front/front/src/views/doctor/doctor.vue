<template>
  <div class="clinic-system">
    <el-container>
      <el-header class="header">
        <div class="logo">医生端</div>
        <el-menu
          mode="horizontal"
          :router="true"
          class="menu"
          background-color="#2d2d2d"
          text-color="#fff"
          active-text-color="#fff"
          default-active="/doctor"
        >
          <el-menu-item index="/doctor">我的日程</el-menu-item>
          <el-menu-item index="/doctor/timeTable">工作时间表</el-menu-item>
          <el-menu-item index="/doctor/consultation">在线咨询</el-menu-item>
        </el-menu>
        <div class="user-info">
          <span class="username">医生名称(医生)</span>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            class="el-menu-vertical-demo"
            default-active="1"
          >
            <el-menu-item index="1">
              <span>我的日程</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span>患者列表</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/doctor' }">
              <el-icon><HomeFilled /></el-icon> 我的日程
            </el-breadcrumb-item>
            <el-breadcrumb-item>预约情况</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- Calendar -->
          <el-calendar v-model="selectedDate">
            <template #dateCell="{ date, data }">
              <div class="date-content">
                {{ formatDate(data.day) }}
                <span v-if="appointments[formatDate(data.day)]" class="badge">
                  {{ appointments[formatDate(data.day)].length }}
                </span>
              </div>
            </template>
          </el-calendar>

          <!-- Appointments List -->
          <el-collapse v-if="appointments[selectedDateFormatted] && appointments[selectedDateFormatted].length > 0">
            <el-collapse-item v-for="(appointment, index) in appointments[selectedDateFormatted]" :key="index" :title="`${appointment.patientId} - ${appointment.appointmentDate}`">
              <div>
                预约ID: {{ appointment.appointmentId }}<br/>
                患者ID: {{ appointment.patientId }}<br/>
                医生ID: {{ appointment.doctorId }}<br/>
                预约日期: {{ appointment.appointmentDate }}<br/>
                预约时间: {{ appointment.appointmentTime }}<br/>
                状态: {{ getStatusText(appointment.status) }}
              </div>
            </el-collapse-item>
          </el-collapse>
          <div v-else class="no-appointments">没有预约记录。</div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, HomeFilled, Search, Delete } from '@element-plus/icons-vue';
import { getUnFinishedByDoctor } from '@/api/doctorAPI.js';
const doctorData = ref(null);

// 使用 onMounted 钩子来加载本地存储的数据
onMounted(() => {
  const savedDoctorData = localStorage.getItem('doctorData');
  if (savedDoctorData) {
    doctorData.value = JSON.parse(savedDoctorData);
    console.log("Loaded doctor data:", doctorData.value);
    // 这里可以根据 doctorData 更新组件的状态或其他逻辑
  }
});

const selectedDate = ref(new Date());

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: number;
}

// 动态数据变量
const appointments = ref<Record<string, Appointment[]>>({});

// 状态文本映射函数
function getStatusText(status: number): string {
  switch (status) {
    case 1:
      return '待诊';
    case 2:
      return '已完成';
    default:
      return '未知';
  }
}

// 日期格式化函数
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

onMounted(async () => {
  try {
    // 动态获取医生 ID
    const doctorId = 1; 
    const data = await getUnFinishedByDoctor(doctorId);
    
    // 初始化 appointments 对象
    data.forEach(appointment => {
      const date = appointment.appointmentDate;
      if (!appointments.value[date]) {
        appointments.value[date] = [];
      }
      appointments.value[date].push(appointment);
    });
  } catch (error) {
    console.error("Failed to fetch unfinished appointments:", error);
  }
});

const selectedDateFormatted = computed(() => {
  const date = new Date(selectedDate.value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});

// 退出登录处理
function handleLogout() {
  // 实现退出逻辑，例如清除用户信息并重定向到登录页面
  console.log('Logout clicked');
}
</script>

<style scoped>
.clinic-system {
  height: 100vh;
  display: flex;
}

.el-header {
  padding: 0;
}
.header {
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: rgb(237,226,192);
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
  color: rgb(237,226,192);
}

.el-breadcrumb {
  margin: 16px 0;
  font-size: 14px;
}

.date-content {
  padding: 8px;
  text-align: center;
}

.badge {
  display: inline-block;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  margin-left: 5px;
}

.no-appointments {
  text-align: center;
  padding: 20px;
  color: #666;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
  border-bottom: 4px solid transparent;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background-color: #1e1e1e !important;
  border-bottom: none;
  position: relative;
  border-bottom: 4px solid var(--el-color-primary) !important;
}

.el-menu-vertical-demo {
  height: calc(100vh - 60px);
}
</style>