<template>
  <div class="back-button" @click="backToRoleSelect">
    <el-button link type="info">
      <el-icon><ArrowLeft /></el-icon>
      返回身份选择
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();

const backToRoleSelect = () => {
  router.push('/role-select');
};
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}

.back-button :deep(.el-button) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.back-button :deep(.el-button:hover) {
  transform: translateX(-4px);
}
</style> 