<template>
  <div class="work-schedule-viewer">
    <el-card class="schedule-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <i class="fas fa-clock header-icon"></i>
            <h3>工作时间表</h3>
          </div>
          <div class="header-right">
            <el-button type="primary" size="small" @click="refreshSchedule">
              <i class="fas fa-sync-alt"></i> 刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 工作时间表格 -->
      <div class="table-container" v-loading="loading">
        <el-table 
          :data="scheduleData" 
          stripe 
          border
          style="width: 100%"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '14px',
            textAlign: 'center'
          }"
        >
          <el-table-column 
            prop="dayName" 
            label="工作日" 
            width="150"
            align="center"
          >
            <template #default="{ row }">
              <span class="day-name">{{ row.dayName }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="上午" 
            align="center"
            min-width="300"
          >
            <template #default="{ row }">
              <div class="time-slot" :class="{ 'has-time': row.startTimeMorning && row.endTimeMorning }">
                <span v-if="row.startTimeMorning && row.endTimeMorning">
                  <i class="fas fa-sun time-icon"></i>
                  {{ row.startTimeMorning }} - {{ row.endTimeMorning }}
                </span>
                <span v-else class="no-time">
                  <i class="fas fa-moon time-icon"></i>
                  休息
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column 
            label="下午" 
            align="center"
            min-width="300"
          >
            <template #default="{ row }">
              <div class="time-slot" :class="{ 'has-time': row.startTimeAfternoon && row.endTimeAfternoon }">
                <span v-if="row.startTimeAfternoon && row.endTimeAfternoon">
                  <i class="fas fa-sun time-icon"></i>
                  {{ row.startTimeAfternoon }} - {{ row.endTimeAfternoon }}
                </span>
                <span v-else class="no-time">
                  <i class="fas fa-moon time-icon"></i>
                  休息
                </span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 无数据时显示 -->
        <el-empty 
          v-if="!loading && (!scheduleData || scheduleData.length === 0)"
          description="暂无工作时间安排" 
          :image-size="200"
        >
          <template #description>
            <p class="empty-text">暂无工作时间安排</p>
          </template>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getDoctorWorkingHours } from '@/api/doctorAPI';

const props = defineProps({
  doctorId: {
    type: String,
    required: true
  }
});

const loading = ref(false);
const scheduleData = ref([]);

// 修改星期映射
const weekDayMap = {
  'MONDAY': { value: 'MONDAY', label: '周一' },
  'TUESDAY': { value: 'TUESDAY', label: '周二' },
  'WEDNESDAY': { value: 'WEDNESDAY', label: '周三' },
  'THURSDAY': { value: 'THURSDAY', label: '周四' },
  'FRIDAY': { value: 'FRIDAY', label: '周五' },
  'SATURDAY': { value: 'SATURDAY', label: '周六' },
  'SUNDAY': { value: 'SUNDAY', label: '周日' }
};

const weekDays = [
  { value: 'MONDAY', label: '周一' },
  { value: 'TUESDAY', label: '周二' },
  { value: 'WEDNESDAY', label: '周三' },
  { value: 'THURSDAY', label: '周四' },
  { value: 'FRIDAY', label: '周五' },
  { value: 'SATURDAY', label: '周六' },
  { value: 'SUNDAY', label: '周日' }
];

// 格式化时间函数（处理24小时制）
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  let hour = parseInt(hours);
  
  // 确保小时是24小时制
  if (hour > 23) {
    hour = hour % 24;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

// 获取工作时间表
const fetchSchedule = async () => {
  loading.value = true;
  try {
    // 确保 doctorId 是有效的
    if (!props.doctorId) {
      console.error('医生ID未提供');
      ElMessage.error('医生ID无效');
      return;
    }
    
    console.log('正在获取医生ID:', props.doctorId, '的工作时间');
    const result = await getDoctorWorkingHours(props.doctorId);
    if (result.data) {
      // 处理数据，确保每天都有记录
      scheduleData.value = weekDays.map(day => {
        // 查找对应星期的数据
        const daySchedule = result.data.find(item => 
          item.dayOfWeek === day.value
        ) || {};
        
        return {
          dayName: day.label,
          dayOfWeek: day.value,
          startTimeMorning: formatTime(daySchedule.startTimeMorning),
          endTimeMorning: formatTime(daySchedule.endTimeMorning),
          startTimeAfternoon: formatTime(daySchedule.startTimeAfternoon),
          endTimeAfternoon: formatTime(daySchedule.endTimeAfternoon)
        };
      });

      console.log('处理后的工作时间数据:', scheduleData.value);
    } else {
      ElMessage.error('获取工作时间失败');
    }
  } catch (error) {
    console.error('获取工作时间失败:', error);
    ElMessage.error('获取工作时间失败');
  } finally {
    loading.value = false;
  }
};

// 刷新时间表
const refreshSchedule = () => {
  fetchSchedule();
};

onMounted(() => {
  fetchSchedule();
});
</script>

<style scoped>
.work-schedule-viewer {
  margin: 20px 0;
  max-width: 1000px;
  margin: 20px auto;
}

.schedule-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 0 20px;
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409EFF;
}

.header-left h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.table-container {
  padding: 20px 0;
}

.day-name {
  font-weight: 600;
  color: #2c3e50;
}

.time-slot {
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin: 2px 16px;
}

.time-slot.has-time {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
  font-size: 14px;
}

.time-icon {
  margin-right: 8px;
}

.no-time {
  color: #909399;
  font-style: italic;
  font-size: 14px;
}

.empty-text {
  color: #909399;
  font-size: 14px;
  margin-top: 8px;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table__row:hover td) {
  background-color: #f5f7fa !important;
}

:deep(.el-button) {
  padding: 8px 16px;
  font-weight: 500;
}

:deep(.el-button i) {
  margin-right: 4px;
}

:deep(.el-empty) {
  padding: 40px 0;
}

:deep(.el-table th) {
  background: '#f5f7fa';
  color: '#2c3e50';
  font-weight: 600;
  font-size: '13px';
  text-align: 'center';
}
</style> 