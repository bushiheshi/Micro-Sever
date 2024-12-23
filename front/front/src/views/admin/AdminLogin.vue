<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>医生办公室预约系统</h2>
        <p class="subtitle">管理员登录</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="administratorId">
          <el-input
            v-model.trim="loginForm.administratorId"
            placeholder="管理员ID"
            :maxlength="20"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="密码"
            show-password
            :maxlength="20"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            link
            type="info"
            class="back-button"
            @click="backToRoleSelect"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回身份选择
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue';
import { adminLogin } from '@/api/managerAPI';
import BackToRole from '@/components/BackToRole.vue';

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);

const loginForm = reactive({
  administratorId: '',
  password: ''
});

// 延迟验证规则
const rules = {
  administratorId: [
    { 
      required: true, 
      message: '请输入管理员ID', 
      trigger: 'blur' 
    }
  ],
  password: [
    { 
      required: true, 
      message: '请输入密码', 
      trigger: 'blur' 
    }
  ]
};

const handleLogin = async () => {
  if (loading.value) return;
  
  try {
    await loginFormRef.value.validate();
    
    loading.value = true;
    const loginData = {
      administratorId: loginForm.administratorId,
      password: loginForm.password
    };
    
    console.log('登录请求数据:', loginData);
    
    const response = await adminLogin(loginData);
    console.log('服务器响应:', response);
    
    // 检查响应是否成功
    if (response && response.administratorId) {  // 如果返回了管理员ID，说明登录成功
      // 存储登录信息
      localStorage.setItem('adminToken', 'admin-token'); // 临时token
      localStorage.setItem('adminInfo', JSON.stringify({
        administratorId: response.administratorId,
        // 其他需要保存的信息
      }));
      
      ElMessage.success('登录成功');
      router.push('/managerHome');
    } else {
      console.log('登录失败，响应数据:', response);
      ElMessage.error('登录失败，请检查账号密码');
    }
  } catch (error) {
    if (error === false) {
      return;
    }
    console.error('登录失败详细信息:', {
      error: error,
      message: error.message,
      response: error.response?.data
    });
    
    // 根据错误类型显示不同的错误信息
    if (error.response?.status === 401) {
      ElMessage.error('账号或密码错误');
    } else if (error.response?.status === 404) {
      ElMessage.error('账号不存在');
    } else {
      ElMessage.error('登录失败，请稍后重试');
    }
  } finally {
    loading.value = false;
  }
};

const backToRoleSelect = () => {
  router.push('/role-select');
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  margin-bottom: 8px;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 30px;
}

.login-button {
  width: 100%;
  padding: 12px 0;
}

:deep(.el-input__wrapper) {
  padding: 12px;
}

:deep(.el-input__prefix) {
  margin-right: 8px;
}

:deep(.el-input__inner) {
  box-shadow: none !important;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}

.back-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
}

.back-button:hover {
  transform: translateX(-4px);
  transition: transform 0.2s;
}
</style> 