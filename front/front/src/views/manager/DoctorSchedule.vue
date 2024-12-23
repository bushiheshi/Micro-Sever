<template>
  <div class="doctor-schedule">
    <!-- 医生列表视图 -->
    <div v-if="!showingSchedule" class="doctor-grid">
      <el-input
        v-model="searchQuery"
        placeholder="搜索医生姓名"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="doctor-cards">
        <el-card 
          v-for="doctor in filteredDoctors" 
          :key="doctor.doctorId"
          class="doctor-card"
          @click="showSchedule(doctor)"
        >
          <div class="doctor-avatar">
            <el-avatar :size="80" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </div>
          <div class="doctor-info">
            <h3>{{ doctor.name }}</h3>
            <p>{{ getDepartmentName(doctor.departmentId) }}</p>
            <p>{{ getTitleName(doctor.titleId) }}</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 工作时间表视图 -->
    <div v-else class="schedule-view">
      <div class="schedule-header">
        <el-button @click="backToList" type="primary">
          <el-icon><Back /></el-icon> 返回医生列表
        </el-button>
        <div class="doctor-profile">
          <el-avatar :size="60" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <div class="doctor-title">
            <h2>{{ currentDoctor.name }}的工作时间表</h2>
            <span class="subtitle">{{ getDepartmentName(currentDoctor.departmentId) }} | {{ getTitleName(currentDoctor.titleId) }}</span>
          </div>
        </div>
      </div>

      <div class="schedule-container">
        <el-card v-for="day in workingHours" 
          :key="day.dayOfWeek" 
          class="schedule-card"
          :class="{ 'weekend': day.dayOfWeek === 0 || day.dayOfWeek === 6 }"
        >
          <template #header>
            <div class="schedule-card-header">
              <span class="day-label">{{ getWeekDay(day.dayOfWeek) }}</span>
              <el-button
                type="primary"
                size="small"
                @click="editSchedule(day)"
              >
                修改时间
              </el-button>
            </div>
          </template>
          <div class="time-slots">
            <div class="time-slot">
              <div class="slot-label">上午</div>
              <div class="slot-time">
                <el-icon><Sunrise /></el-icon>
                {{ day.startTimeMorning || '未设置' }} - {{ day.endTimeMorning || '未设置' }}
              </div>
            </div>
            <div class="time-slot">
              <div class="slot-label">下午</div>
              <div class="slot-time">
                <el-icon><Sunset /></el-icon>
                {{ day.startTimeAfternoon || '未设置' }} - {{ day.endTimeAfternoon || '未设置' }}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 编辑工作时间对话框 -->
    <el-dialog
      v-model="editScheduleVisible"
      title="修改工作时间"
      width="50%"
    >
      <el-form :model="editScheduleForm" label-width="100px">
        <el-form-item label="上午开始">
          <el-time-select
            v-model="editScheduleForm.startTimeMorning"
            start="08:00"
            step="00:15"
            end="12:00"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="上午结束">
          <el-time-select
            v-model="editScheduleForm.endTimeMorning"
            start="08:00"
            step="00:15"
            end="12:00"
            :min-time="editScheduleForm.startTimeMorning"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="下午开始">
          <el-time-select
            v-model="editScheduleForm.startTimeAfternoon"
            start="13:00"
            step="00:15"
            end="18:00"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="下午结束">
          <el-time-select
            v-model="editScheduleForm.endTimeAfternoon"
            start="13:00"
            step="00:15"
            end="18:00"
            :min-time="editScheduleForm.startTimeAfternoon"
            placeholder="选择时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editScheduleVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSchedule">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Back, Sunrise, Sunset } from '@element-plus/icons-vue';
import { getAllDoctorInfo, getDoctorWorkingHours, managerUpdateWorkingHour } from '@/api/doctorAPI';
import { getAllDepartments, getAllTitles } from '@/api/managerAPI';

const loading = ref(false);
const searchQuery = ref('');
const doctors = ref([]);
const departments = ref([]);
const titles = ref([]);
const scheduleVisible = ref(false);
const editScheduleVisible = ref(false);
const currentDoctor = ref({});
const workingHours = ref([]);
const editScheduleForm = ref({});
const showingSchedule = ref(false);

// 过滤医生列表
const filteredDoctors = computed(() => {
  return doctors.value.filter(doctor => {
    return !searchQuery.value || 
      doctor.name.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// 获取所有医生信息
const fetchDoctors = async () => {
  loading.value = true;
  try {
    const response = await getAllDoctorInfo();
    doctors.value = response;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    ElMessage.error('获取医生列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取所有科室
const fetchDepartments = async () => {
  try {
    const response = await getAllDepartments();
    departments.value = response;
  } catch (error) {
    console.error('Error fetching departments:', error);
    ElMessage.error('获取科室列表失败');
  }
};

// 获取所有职称
const fetchTitles = async () => {
  try {
    const response = await getAllTitles();
    titles.value = response;
  } catch (error) {
    console.error('Error fetching titles:', error);
    ElMessage.error('获取职称列表失败');
  }
};

// 获取科室名称
const getDepartmentName = (departmentId) => {
  const department = departments.value.find(d => d.departmentId === departmentId);
  return department ? department.departmentName1 : '未知科室';
};

// 获取职称名称
const getTitleName = (titleId) => {
  const title = titles.value.find(t => t.titleId === titleId);
  return title ? title.titleName : '未知职称';
};

// 获取星期几
const getWeekDay = (day) => {
  console.log('当前处理的星期值:', day);
  const weekDaysMap = {
    'MONDAY': '周一',
    'TUESDAY': '周二',
    'WEDNESDAY': '周三',
    'THURSDAY': '周四',
    'FRIDAY': '周五',
    'SATURDAY': '周六',
    'SUNDAY': '周日'
  };
  return weekDaysMap[day] || '未知';
};

// 显示医生排班
const showSchedule = async (doctor) => {
  currentDoctor.value = doctor;
  try {
    const response = await getDoctorWorkingHours(doctor.doctorId);
    console.log('工作时间数据:', response);
    
    // 创建默认的工作时间表
    const defaultSchedule = [
      { dayOfWeek: 'MONDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'TUESDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'WEDNESDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'THURSDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'FRIDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'SATURDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' },
      { dayOfWeek: 'SUNDAY', startTimeMorning: '', endTimeMorning: '', startTimeAfternoon: '', endTimeAfternoon: '' }
    ];

    // 如果有数据，更新对应的工作时间
    if (response.data && response.data.length > 0) {
      response.data.forEach(schedule => {
        const index = defaultSchedule.findIndex(item => item.dayOfWeek === schedule.dayOfWeek);
        if (index !== -1) {
          defaultSchedule[index] = {
            ...schedule,
            // 只保留时分，去掉秒
            startTimeMorning: schedule.startTimeMorning?.substring(0, 5) || '',
            endTimeMorning: schedule.endTimeMorning?.substring(0, 5) || '',
            startTimeAfternoon: schedule.startTimeAfternoon?.substring(0, 5) || '',
            endTimeAfternoon: schedule.endTimeAfternoon?.substring(0, 5) || ''
          };
        }
      });
      
      console.log('处理后的工作时间表:', defaultSchedule);
      workingHours.value = defaultSchedule;
      showingSchedule.value = true;
      ElMessage.success('获取工作时间成功');
    } else {
      console.log('没有找到工作时间数据，显示默认时间表');
      workingHours.value = defaultSchedule;
      showingSchedule.value = true;
      ElMessage.info('暂无工作时间安排，您可以设置新的工作时间');
    }
  } catch (error) {
    console.error('Error fetching working hours:', error);
    ElMessage.error('获取工作时间失败');
    
    // 出错时显示默认的工作时间表
    workingHours.value = defaultSchedule;
    showingSchedule.value = true;
  }
};

// 返回医生列表
const backToList = () => {
  showingSchedule.value = false;
};

// 编辑排班
const editSchedule = (schedule) => {
  editScheduleForm.value = {
    dayOfWeek: schedule.dayOfWeek,
    startTimeMorning: schedule.startTimeMorning || '08:00',
    endTimeMorning: schedule.endTimeMorning || '12:00',
    startTimeAfternoon: schedule.startTimeAfternoon || '13:00',
    endTimeAfternoon: schedule.endTimeAfternoon || '17:00'
  };
  editScheduleVisible.value = true;
};

// 保存排班
const saveSchedule = async () => {
  try {
    // 验证时间是否合法
    if (!validateTimeRange()) {
      return;
    }

    // 构造请求数据
    const requestData = {
      doctorId: currentDoctor.value.doctorId,
      dayOfWeek: editScheduleForm.value.dayOfWeek,
      startTimeMorning: `${editScheduleForm.value.startTimeMorning}:00`,
      endTimeMorning: `${editScheduleForm.value.endTimeMorning}:00`,
      startTimeAfternoon: `${editScheduleForm.value.startTimeAfternoon}:00`,
      endTimeAfternoon: `${editScheduleForm.value.endTimeAfternoon}:00`
    };

    console.log('发送的数据:', requestData);

    const result = await managerUpdateWorkingHour(requestData);
    
    if (result.success) {
      ElMessage.success(result.message);
      editScheduleVisible.value = false;
      await showSchedule(currentDoctor.value); // 刷新工作时间
    } else {
      ElMessage.error(result.message);
    }
  } catch (error) {
    console.error('Error saving schedule:', error);
    ElMessage.error('保存失败');
  }
};

// 验证时间范围
const validateTimeRange = () => {
  const { startTimeMorning, endTimeMorning, startTimeAfternoon, endTimeAfternoon } = editScheduleForm.value;
  
  if (!startTimeMorning || !endTimeMorning || !startTimeAfternoon || !endTimeAfternoon) {
    ElMessage.warning('请填写完整的工作时间');
    return false;
  }

  if (startTimeMorning >= endTimeMorning) {
    ElMessage.warning('上午开始时间必须早于结束时间');
    return false;
  }

  if (startTimeAfternoon >= endTimeAfternoon) {
    ElMessage.warning('下午开始时间必须早于结束时间');
    return false;
  }

  return true;
};

// 组件挂载时获取数据
onMounted(async () => {
  await Promise.all([
    fetchDoctors(),
    fetchDepartments(),
    fetchTitles()
  ]);
});
</script>

<style scoped>
.doctor-schedule {
  padding: 20px;
  min-height: 100vh;
}

.search-input {
  width: 300px;
  margin-bottom: 20px;
}

.doctor-grid {
  width: 100%;
}

.doctor-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.doctor-card {
  flex: 0 0 auto;
  width: 250px;
  cursor: pointer;
  transition: all 0.3s;
}

.doctor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.doctor-info {
  text-align: center;
}

.doctor-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.doctor-info p {
  margin: 5px 0;
  color: #666;
}

.schedule-view {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.schedule-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.doctor-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.doctor-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.doctor-title h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.schedule-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.schedule-card {
  width: 300px;
  transition: all 0.3s;
}

.schedule-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.schedule-card.weekend {
  background-color: #fdf6ec;
}

.schedule-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-label {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-slot {
  padding: 10px;
  border-radius: 6px;
  background-color: #f5f7fa;
}

.slot-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.slot-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
  font-size: 16px;
}

.slot-time .el-icon {
  color: var(--el-color-primary);
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

.weekend :deep(.el-card__header) {
  background-color: #fdf6ec;
}
</style> 