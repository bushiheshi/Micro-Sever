<template>
  <el-header class="admin-header">
    <div class="logo">医生办公室预约系统管理员端</div>
    <el-menu
      mode="horizontal"
      :router="true"
      class="menu"
      background-color="#2d2d2d"
      text-color="#fff"
      active-text-color="#fff"
      :default-active="activeRoute"
    >
      <el-menu-item :index="'/managerHome'">预约信息</el-menu-item>
      <el-menu-item :index="'/prescription'">医生信息</el-menu-item>
      <el-menu-item :index="'/billing'">修改工作时间</el-menu-item>
      <el-menu-item :index="'/pharmacy'">通知管理</el-menu-item>
      <el-menu-item :index="'/finance'">公告管理</el-menu-item>
    </el-menu>
    <div class="user-info">
      <span class="username">济医(超级管理员)</span>
      <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const activeRoute = computed(() => route.path);

const handleLogout = () => {
  // 处理退出登录逻辑
  router.push('/login');
};
</script>

<style scoped>
.admin-header {
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
</style> 