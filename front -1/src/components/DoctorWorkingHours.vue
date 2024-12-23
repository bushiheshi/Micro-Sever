<template>
  <div class="working-hours-component">
    <el-table :data="workingHours" stripe border>
      <el-table-column prop="dayOfWeek" label="工作日" align="center">
        <template #default="{ row }">
          {{ translateDayOfWeek(row.dayOfWeek) }}
        </template>
      </el-table-column>
      <el-table-column label="上午" align="center">
        <template #default="{ row }">
          {{ row.startTimeMorning }} - {{ row.endTimeMorning }}
        </template>
      </el-table-column>
      <el-table-column label="下午" align="center">
        <template #default="{ row }">
          {{ row.startTimeAfternoon }} - {{ row.endTimeAfternoon }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getDoctorWorkingHours } from '@/api/doctorAPI.js';

const props = defineProps<{
  doctorId: number
}>();

interface WorkingHour {
  doctorId: number;
  dayOfWeek: string;
  startTimeMorning: string;
  endTimeMorning: string;
  startTimeAfternoon: string;
  endTimeAfternoon: string;
}

const workingHours = ref<WorkingHour[]>([]);

// 转换星期几的显示
const translateDayOfWeek = (day: string): string => {
  const dayMap: { [key: string]: string } = {
    'MONDAY': '周一',
    'TUESDAY': '周二',
    'WEDNESDAY': '周三',
    'THURSDAY': '周四',
    'FRIDAY': '周五',
    'SATURDAY': '周六',
    'SUNDAY': '周日'
  };
  return dayMap[day] || day;
};

const fetchWorkingHours = async () => {
  try {
    console.log('正在获取医生工作时间，医生ID:', props.doctorId);
    const response = await getDoctorWorkingHours(props.doctorId);
    console.log('获取到的工作时间数据:', response);
    
    if (response && response.data && Array.isArray(response.data)) {
      workingHours.value = response.data;
      console.log('工作时间详情:');
      response.data.forEach((hour, index) => {
        console.log(`时间段 ${index + 1}:`, {
          '医生ID': hour.doctorId,
          '工作日': translateDayOfWeek(hour.dayOfWeek),
          '上午开始时间': hour.startTimeMorning,
          '上午结束时间': hour.endTimeMorning,
          '下午开始时间': hour.startTimeAfternoon,
          '下午结束时间': hour.endTimeAfternoon
        });
      });
    } else {
      console.warn('获取到的数据格式不正确:', response);
    }
  } catch (error) {
    console.error('获取工作时间失败:', error);
  }
};

onMounted(() => {
  fetchWorkingHours();
});
</script>

<style scoped>
.working-hours-component {
  padding: 20px;
}

:deep(.el-table) {
  margin-top: 10px;
}

:deep(.el-table__header) {
  font-weight: bold;
  background-color: #f5f7fa;
}

:deep(.el-table__row) {
  height: 60px;
}
</style> 