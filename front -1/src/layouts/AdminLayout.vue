<template>
  <div class="admin-layout">
    <AdminHeader @logout="handleLogout" />
    <el-container class="main-container">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/AdminHeader.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();

const handleLogout = () => {
  // 清除管理员相关的存储信息
  localStorage.removeItem('managerInfo')
  localStorage.removeItem('managerToken')
  
  // 重定向到管理员登录页面
  router.push('/managerLogin')
  
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style> 