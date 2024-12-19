<template>
  <div class="admin-layout">
    <AdminHeader />
    <el-container class="main-container">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/AdminHeader.vue';
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