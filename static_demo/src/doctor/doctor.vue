<template>
  <div class="clinic-system">
    <el-container>
      <el-header>
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
            <el-menu-item index="/prescription">医生开方</el-menu-item>
            <el-menu-item index="/consultation">在线咨询</el-menu-item>
          </el-menu>
          <div class="user-info">
            <span class="username">医生名称(医生)</span>
            <el-button type="danger" size="small">退出登录</el-button>
          </div>
        </el-header>
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
                {{ data.day.split('-').slice(1).join('-') }}
                <span v-if="appointments[data.day]" class="badge">
                  {{ appointments[data.day].length }}
                </span>
              </div>
            </template>
          </el-calendar>

          <!-- Appointments List -->
          <el-collapse v-if="appointments[selectedDateFormatted] && appointments[selectedDateFormatted].length > 0">
            <el-collapse-item v-for="(appointment, index) in appointments[selectedDateFormatted]" :key="index" :title="`${appointment.name} - ${appointment.visitType}`">
              <div>
                <p><strong>挂号编号:</strong> {{ appointment.registrationNo }}</p>
                <p><strong>诊号:</strong> {{ appointment.diagnosisNo }}</p>
                <p><strong>性别:</strong> {{ appointment.gender }}</p>
                <p><strong>年龄:</strong> {{ appointment.age }}</p>
                <p><strong>手机:</strong> {{ appointment.phone }}</p>
                <p><strong>挂号医生:</strong> {{ appointment.doctor }}</p>
                <p><strong>挂号时间:</strong> {{ appointment.registrationTime }}</p>
                <p><strong>状态:</strong>
                  <el-tag v-if="appointment.status === '待诊'" type="warning">待诊</el-tag>
                  <el-tag v-else-if="appointment.status === '已诊'" type="success">已诊</el-tag>
                  <el-tag v-else-if="appointment.status === '已取消'" type="info">已取消</el-tag>
                </p>
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
import { ref, computed } from 'vue';
import { Plus, HomeFilled, Search, Delete } from '@element-plus/icons-vue';

interface Appointment {
  registrationNo: string;
  diagnosisNo: string;
  name: string;
  gender: string;
  age: string;
  phone: string;
  doctor: string;
  registrationTime: string;
  visitType: string;
  status: '待诊' | '已诊' | '已取消';
}

const selectedDate = ref(new Date());

const appointments = ref<Record<string, Appointment[]>>({
  '2024-11-25': [
    {
      registrationNo: '1714313707',
      diagnosisNo: '1',
      name: '张三',
      gender: '男',
      age: '30岁',
      phone: '13112345678',
      doctor: '李四',
      registrationTime: '2024-04-28 22:15:02',
      visitType: '复诊',
      status: '待诊'
    }
  ]
});

const selectedDateFormatted = computed(() => {
  const date = new Date(selectedDate.value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
});
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