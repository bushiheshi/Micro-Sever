<template>
  <el-container class="layout-container">
    <el-aside width="240px">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
        <div class="logo-text">
          <div class="system-name">医生办公室预约系统</div>
          <div class="admin-info">管理员端</div>
        </div>
      </div>

      <div class="admin-profile">
        <el-avatar :size="50" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
        <div class="admin-details">
          <div class="admin-name">济医</div>
          <div class="admin-role">超级管理员</div>
        </div>
      </div>

      <el-menu
        :router="true"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/managerHome">
          <el-icon><HomeFilled /></el-icon>
          <span>预约管理</span>
        </el-menu-item>
        
        <el-menu-item index="/prescription">
          <el-icon><User /></el-icon>
          <span>医生管理</span>
        </el-menu-item>

        <el-menu-item index="/billing">
          <el-icon><Calendar /></el-icon>
          <span>排班管理</span>
        </el-menu-item>

        <el-menu-item index="/attention">
          <el-icon><Bell /></el-icon>
          <span>通告管理</span>
        </el-menu-item>

        <el-menu-item @click="handleLogout" class="logout-item">
          <el-icon><SwitchButton /></el-icon>
          <span>退出系统</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { HomeFilled, User, Calendar, Bell, SwitchButton } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  router.push('/admin/login');
};
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.el-aside {
  background-color: #304156;
  color: white;
  box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.logo {
  height: 80px;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #2b3648;
  border-bottom: 1px solid #1f2d3d;
}

.logo img {
  height: 40px;
  margin-right: 12px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.system-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  line-height: 1.2;
}

.admin-info {
  font-size: 12px;
  color: #a3b1cc;
}

.admin-profile {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #263445;
  border-bottom: 1px solid #1f2d3d;
}

.admin-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-name {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

.admin-role {
  font-size: 12px;
  color: #a3b1cc;
}

.el-menu {
  border-right: none;
  background-color: transparent;
}

.el-menu-item {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  transition: all 0.3s;
}

.el-menu-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}

.logout-item {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #1f2d3d;
  background-color: #263445;
}

:deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important;
  color: #fff !important;
}

:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
}

:deep(.logout-item:hover) {
  background-color: #1f2d3d !important;
  color: #ff4d4f !important;
}
</style> 