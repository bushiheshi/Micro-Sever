<template>
  <div class="container" id="app">
    <div class="forms-container">
      <div class="signin-signup">
        <!-- 左侧装饰图案 -->
        <div class="decoration-left">
          <img 
            src="https://cdn.jsdelivr.net/gh/microsoft/fluentui-system-icons/assets/Doctor/SVG/ic_fluent_doctor_24_regular.svg" 
            alt="医生插图" 
            class="doctor-image" 
          />
        </div>

        <!-- 登录表单部分 -->
        <el-form
          ref="loginRef"
          :model="loginForm"
          :rules="loginRules"
          class="sign-in-form"
        >
          <div class="form-header">
            <h2 class="title">医生工作站</h2>
            <p class="subtitle">欢迎回来，请登录您的账号</p>
          </div>

          <div class="input-field">
            <i class="fa-solid fa-envelope"></i>
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                @keyup.enter="Login(loginForm)"
              />
            </el-form-item>
          </div>

          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                autocomplete="off"
                show-password
                @keyup.enter="Login(loginForm)"
              />
            </el-form-item>
          </div>

          <div class="form-footer">
            <el-button
              type="primary"
              :loading="loginLoading"
              @click="Login(loginForm)"
              class="btn-login"
              round
            >
              {{ loginLoading ? '登录中...' : '登 录' }}
            </el-button>
            <div class="help-links">
              <a href="#" class="forgot-password">忘记密码？</a>
              <span class="divider">|</span>
              <a href="#" class="contact-admin">联系管理员</a>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'; 
import axios from 'axios';
// 表单引用
const loginRef = ref(null);

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: ''
});
const loginApi = "http://121.40.197.3:10010/doctor/login"
// 登录规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
};

// 登录状态
const loginLoading = ref(false);

const router = useRouter(); // 引入路由实例

const Login = async (formData) => {
  loginRef.value.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true;
      try {
        const response = await axios.post(loginApi, {
          email: loginForm.email,
          password: loginForm.password
        });
        console.log("trying to log in");

        if (response.status == 200) {
          console.log("成功登录");
          localStorage.setItem('microData', JSON.stringify(response.data));
          ElMessage.success("成功登录");
          await router.push('/doctor'); 
          location.reload();
        } else {
          ElMessage.error("登录失败，请检查邮箱和密码");
        }
      } catch (error) {
        console.error("登录失败", error);
        ElMessage.error("登录失败，请检查网络连接或稍后再试");
      } finally {
        loginLoading.value = false; 
      }
    }
  });
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.forms-container {
  display: flex;
  width: 1000px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.signin-signup {
  display: flex;
  width: 100%;
  padding: 2rem;
}

.decoration-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.doctor-image {
  width: 80%;
  max-width: 400px;
}

.sign-in-form {
  flex: 1;
  padding: 2rem;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
}

.input-field {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-field i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
  z-index: 1;
}

.el-input :deep(.el-input__wrapper) {
  padding-left: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 1px #409EFF !important;
}

.el-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(64, 158, 255, 0.5) !important;
}

.el-input :deep(.el-input__inner) {
  height: 45px;
}

.btn-login {
  width: 100%;
  height: 45px;
  font-size: 1.1rem;
  font-weight: 500;
  background: linear-gradient(135deg, #409EFF 0%, #3182CE 100%);
  border: none;
  margin-bottom: 1rem;
}

.btn-login:hover {
  background: linear-gradient(135deg, #3182CE 0%, #2C5282 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2);
}

.help-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.help-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.help-links a:hover {
  color: #409EFF;
}

.divider {
  color: #ddd;
}

@media (max-width: 768px) {
  .forms-container {
    width: 90%;
    margin: 1rem;
  }

  .decoration-left {
    display: none;
  }

  .sign-in-form {
    padding: 1.5rem;
  }
}
</style>