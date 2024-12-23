<template>
  <div class="role-select-container">
    <div class="animated-background">
      <div class="particle" v-for="n in 20" :key="n"></div>
    </div>
    
    <el-card class="role-card">
      <div class="header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>医生办公室预约系统</h2>
        <p class="subtitle">请选择您的身份</p>
      </div>

      <div class="role-buttons">
        <el-button
          type="primary"
          class="role-button"
          @click="selectRole('patient')"
        >
          <div class="button-inner">
            <el-icon><User /></el-icon>
            <div class="label">患者</div>
          </div>
        </el-button>

        <el-button
          type="success"
          class="role-button"
          @click="selectRole('doctor')"
        >
          <div class="button-inner">
            <el-icon><Stethoscope /></el-icon>
            <div class="label">医生</div>
          </div>
        </el-button>

        <el-button
          type="warning"
          class="role-button"
          @click="selectRole('admin')"
        >
          <div class="button-inner">
            <el-icon><Management /></el-icon>
            <div class="label">管理员</div>
          </div>
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { User, Management } from '@element-plus/icons-vue';

const router = useRouter();

const selectRole = (role) => {
  // 清除所有可能的登录状态
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  localStorage.removeItem('userToken');
  localStorage.removeItem('doctorToken');
  localStorage.removeItem('microData');  // 清除其他登录状态

  // 根据角色跳转到对应的登录页面
  switch (role) {
    case 'patient':
      router.push('/login');
      break;
    case 'doctor':
      router.push('/doctorLogin');
      break;
    case 'admin':
      router.push('/admin/login');
      break;
  }
};
</script>

<style scoped>
.role-select-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%);
}

.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%);
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float 8s infinite ease-in-out;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 0.4s; }
.particle:nth-child(3) { left: 30%; animation-delay: 0.8s; }
.particle:nth-child(4) { left: 40%; animation-delay: 1.2s; }
.particle:nth-child(5) { left: 50%; animation-delay: 1.6s; }
.particle:nth-child(6) { left: 60%; animation-delay: 2.0s; }
.particle:nth-child(7) { left: 70%; animation-delay: 2.4s; }
.particle:nth-child(8) { left: 80%; animation-delay: 2.8s; }
.particle:nth-child(9) { left: 90%; animation-delay: 3.2s; }
.particle:nth-child(10) { left: 15%; animation-delay: 3.6s; }
.particle:nth-child(11) { left: 25%; animation-delay: 4.0s; }
.particle:nth-child(12) { left: 35%; animation-delay: 4.4s; }
.particle:nth-child(13) { left: 45%; animation-delay: 4.8s; }
.particle:nth-child(14) { left: 55%; animation-delay: 5.2s; }
.particle:nth-child(15) { left: 65%; animation-delay: 5.6s; }
.particle:nth-child(16) { left: 75%; animation-delay: 6.0s; }
.particle:nth-child(17) { left: 85%; animation-delay: 6.4s; }
.particle:nth-child(18) { left: 95%; animation-delay: 6.8s; }
.particle:nth-child(19) { left: 5%; animation-delay: 7.2s; }
.particle:nth-child(20) { left: 85%; animation-delay: 7.6s; }

@keyframes float {
  0%, 100% {
    transform: translateY(-100vh) scale(0.8);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(100vh) scale(1.2);
    opacity: 0.8;
  }
}

.role-card {
  width: 400px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
}

.header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.logo {
  width: 80px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.role-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.role-button {
  height: 60px;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.role-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.role-button:hover::after {
  left: 100%;
}

.button-inner {
  width: 120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  gap: 10px;
}

.button-inner .el-icon {
  font-size: 24px;
  display: flex;
  justify-content: center;
}

.label {
  text-align: left;
  font-size: 16px;
}

:deep(.el-button) {
  width: 100%;
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
}

/* 按钮颜色和悬停效果 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409EFF 0%, #3a8ee6 100%);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #67C23A 0%, #5daf34 100%);
}

:deep(.el-button--warning) {
  background: linear-gradient(135deg, #E6A23C 0%, #d48b1f 100%);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #409EFF 0%, #2b88fe 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #67C23A 0%, #4aa419 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

:deep(.el-button--warning:hover) {
  background: linear-gradient(135deg, #E6A23C 0%, #d48b1f 100%);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}
</style> 