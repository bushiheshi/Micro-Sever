<template>
  <div class="clinic-system">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="logo">
          <i class="fas fa-hospital-user"></i>
          医生工作站
        </div>
        <el-menu
          mode="horizontal"
          :router="true"
          class="menu"
          background-color="#2d2d2d"
          text-color="#fff"
          active-text-color="#409EFF"
          default-active="/doctor/timeTable"
        >
          <el-menu-item index="/doctor">
            <i class="fas fa-calendar-alt"></i> 我的日程
          </el-menu-item>
          <el-menu-item index="/doctor/timeTable">
            <i class="fas fa-clock"></i> 工作时间
          </el-menu-item>
          <el-menu-item index="/doctor/consultation">
            <i class="fas fa-comments"></i> 在线咨询
          </el-menu-item>
        </el-menu>
        <div class="user-info">
          <span class="username" v-if="doctorData">
            <i class="fas fa-user-md"></i> {{ doctorData.name }}（医生）
          </span>
          <span class="username" v-else>
            <i class="fas fa-user-circle"></i> 请先登录
          </span>
          <el-button 
            type="danger" 
            size="small" 
            @click="handleLogout"
            v-if="doctorData"
          >
            <i class="fas fa-sign-out-alt"></i> 退出登录
          </el-button>
        </div>
      </el-header>

      <!-- 主要内容区 -->
      <el-main class="main-content">
        <working-schedule-viewer 
          v-if="doctorData && doctorData.doctorId" 
          :doctor-id="doctorData.doctorId.toString()" 
        />
        <el-empty 
          v-else
          description="正在加载医生数据..." 
          :image-size="200"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import WorkingScheduleViewer from './components/WorkScheduleViewer.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const doctorData = ref(null);

// 加载医生数据
const loadDoctorData = async () => {
  const savedDoctorData = localStorage.getItem('microData');
  if (savedDoctorData) {
    try {
      const parsedData = JSON.parse(savedDoctorData);
      doctorData.value = parsedData.data || parsedData;
      
      console.log('加载到的医生数据:', doctorData.value);
      
      if (!doctorData.value?.doctorId) {
        throw new Error('医生ID不存在');
      }
    } catch (error) {
      console.error('解析医生数据失败:', error);
      ElMessage.error('加载医生数据失败');
      router.push('/doctorLogin');
    }
  } else {
    console.error('未找到医生数据');
    ElMessage.warning('请先登录');
    router.push('/doctorLogin');
  }
};

// 退出登录处理
const handleLogout = () => {
  localStorage.removeItem('microData');
  doctorData.value = null;
  router.push('/doctorLogin');
};

onMounted(async () => {
  await loadDoctorData();
});
</script>

<style scoped>
.clinic-system {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: #409EFF;
  display: flex;
  align-items: center;
  gap: 8px;
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
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  font-size: 14px;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: 2px solid #409EFF;
  color: #409EFF;
}
</style> 