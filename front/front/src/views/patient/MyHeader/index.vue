<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  patientInfo: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('patientInfo');
  router.push('/role-select');
};
</script>

<template>
  <div class="header">
    <div class="logo-section">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1>医生办公室预约系统</h1>
    </div>

    <div class="user-section" v-if="patientInfo">
      <el-dropdown>
        <span class="user-info">
          <el-avatar :size="32" icon="UserFilled" />
          <span class="username">{{ patientInfo.name }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>我的预约</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding: 0 20px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
}

h1 {
  font-size: 20px;
  color: #303133;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
}
</style>