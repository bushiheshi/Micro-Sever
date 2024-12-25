<script setup lang="ts">
import {onMounted, ref,computed} from "vue";
import { ElMessage } from "element-plus";
import request from '@/utils/request.js';
import { getDoctorsByDepartment, getDoctorWorkingHours, createAppointment } from "@/api/doctorAPI";

defineOptions({
  name: 'FooTer'
})

const items = ["全部", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "S", "T", "W", "X", "Y", "Z"];
const activeIndex = ref(0);
const activeSet = ref(0);
const departmentName1=ref([]);
const departmentName2 = ref([]);
//表单数据
const formData=ref({
  cascader100785:[]//默认为空数组
})

// 表单验证规则
const rules = {
  cascader100785: [
    { required: true, message: '请选择科室', trigger: 'change' }
  ]
};
onMounted(async()=>{
  await getDepartment();
})
// 设置点击事件，更新 activeIndex
function setActive(index:number) {
  activeIndex.value = index;
}
// 设置点击事件
const setItem = (index: number) => {
  console.log('选中的索引:', index);
  activeSet.value = index; // 更新 activeSet 的值
};
// 初始化部门列表
const departments = ref([]);
const loading = ref(true);
const error = ref(null);
const contentList=ref();
// 获取并分组部门数据
const getDepartment = async () => {
  try {
    const response = await request.get('/doctor/getAllDepartments');
    console.log('Response:', response);

    if (Array.isArray(response)) {
      const groupedDepartments = response.reduce((acc, item) => {
        if (!item.departmentName1 || !item.departmentName2) {
          console.warn('Invalid department object:', item);
          return acc;
        }

        if (!acc[item.departmentName1]) {
          acc[item.departmentName1] = new Set(); // 使用 Set 去重
        }
        acc[item.departmentName1].add(item.departmentName2);

        return acc;
      }, {});

      // 将分组结果转换为数组格式，并排序
      const departmentGroups = Object.entries(groupedDepartments).map(([name1, name2Set]) => ({
        departmentName1: name1,
        departmentName2: Array.from(name2Set).sort() // 将 Set 转换为数组并排序
      }));

      contentList.value = departmentGroups;
      console.log('Grouped Departments:', departmentGroups);
    } else {
      console.error('Unexpected response format:', response);
    }
  } catch (error) {
    error.value = error.message;
    console.error('Error fetching departments:', error);
  }
  finally{
    loading.value = false;
  }
};
// 计算属性：根据分组后的部门数据生成 el-cascader 的选项
console.log(departments.value);
const cascaderOptions = computed(() => contentList.value);

// 添加新的响应式变量
const selectedDepartment1 = ref(''); // 用于存储选中的一级科室
const filteredDepartments = computed(() => {
  if (!selectedDepartment1.value || !contentList.value) return [];
  const found = contentList.value.find(item => item.departmentName1 === selectedDepartment1.value);
  return found ? found.departmentName2 : [];
});

// 获取所有一级科室的列表
const department1Options = computed(() => {
  if (!contentList.value) return [];
  return contentList.value.map(item => item.departmentName1);
});

// 添加表格加载效果
const tableLoading = ref(false);

// 修改表格视图和医生列表视图的切换逻辑
const showDoctors = ref(false);
const currentDepartment = ref(null);
const doctorsList = ref([]);
const doctorsLoading = ref(false);

// 处理科室点击事件
const handleRowClick = async (row) => {
  try {
    doctorsLoading.value = true;
    showDoctors.value = true;
    currentDepartment.value = {
      name: row,
      parent: selectedDepartment1.value
    };
    
    // 从原始数据中找到完整的科室信息
    const response = await request.get('/doctor/getAllDepartments');
    console.log('All departments:', response); // 添加日志

    const departmentInfo = response.find(
      dept => dept.departmentName1 === selectedDepartment1.value && 
              dept.departmentName2 === row
    );

    if (!departmentInfo) {
      console.error('Department not found:', {
        name1: selectedDepartment1.value,
        name2: row,
        allDepartments: response
      });
      throw new Error('未找到科室信息');
    }

    console.log('Found department:', departmentInfo); // 添加日志

    // 使用科室ID调用API
    const doctorsResponse = await getDoctorsByDepartment(departmentInfo.departmentId);
    console.log('Doctors response:', doctorsResponse); // 添加日志

    if (doctorsResponse && doctorsResponse.data) {
      doctorsList.value = doctorsResponse.data.map(doctor => ({
        id: doctor.doctorId,
        name: doctor.name,
        title: doctor.title,
        specialty: doctor.specialty,
        avatar: doctor.avatar
      }));
    } else {
      doctorsList.value = [];
    }

    console.log('Processed doctors list:', doctorsList.value); // 添加日志
  } catch (error) {
    ElMessage.error('获取医生列表失败');
    console.error('Error fetching doctors:', error);
    doctorsList.value = [];
  } finally {
    doctorsLoading.value = false;
  }
};

// 返回表格视图
const handleBack = () => {
  showDoctors.value = false;
  currentDepartment.value = null;
  doctorsList.value = [];
};

// 添加新的响应式变量
const scheduleDialogVisible = ref(false)
const currentDate = ref(new Date())
const selectedDoctor = ref(null)

// 修改排班数的存储
const scheduleData = ref({})

// 工作日映射
const dayOfWeekMap = {
  'MONDAY': '星期一',
  'TUESDAY': '星期二',
  'WEDNESDAY': '星期三',
  'THURSDAY': '星期四',
  'FRIDAY': '星期五',
  'SATURDAY': '星期六',
  'SUNDAY': '星期日'
};

// 添加一个获取星期几的辅助函数
const getDayOfWeek = (date) => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
};

// 修改医生点击处理函数
const handleDoctorClick = async (doctor) => {
  console.log('选中的医生:', doctor);
  selectedDoctor.value = doctor;
  scheduleDialogVisible.value = true;
  
  try {
    const response = await getDoctorWorkingHours(doctor.id);
    if (response && response.data) {
      const formattedSchedule = {};
      
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = getDayOfWeek(date);
        
        const schedule = response.data.find(s => s.dayOfWeek === dayName);
        if (schedule) {
          formattedSchedule[dateStr] = {
            type: schedule.startTimeAfternoon ? 'full' : 'morning',
            morning: `${schedule.startTimeMorning.substring(0, 5)}-${schedule.endTimeMorning.substring(0, 5)}`,
            afternoon: schedule.startTimeAfternoon ? 
              `${schedule.startTimeAfternoon.substring(0, 5)}-${schedule.endTimeAfternoon.substring(0, 5)}` : 
              null,
            dayOfWeek: dayOfWeekMap[dayName]
          };
        }
      }
      scheduleData.value = formattedSchedule;
    }
  } catch (error) {
    console.error('获取排班信息失败:', error);
    ElMessage.error('获取排班信息失败');
  }
};

// 处理日期单元格点击
const handleDateCellClick = (date, schedule) => {
  if (!schedule) return;
  selectedDate.value = date;
  selectedSchedule.value = schedule;
  showTimeDialog.value = true;
};

// 修改获取排班信息的函数
const getScheduleForDate = (date) => {
  return scheduleData.value[date]
}

// 获取排班类型对应的标签类型
const getScheduleType = (date) => {
  const schedule = scheduleData.value[date]
  if (!schedule) return ''
  const typeMap = {
    morning: 'success',
    afternoon: 'warning',
    full: 'primary'
  }
  return typeMap[schedule.type]
}

// 修改获取排班文本的函数
const getScheduleText = (date) => {
  const schedule = scheduleData.value[date];
  if (!schedule) return '';
  return schedule.afternoon ? '全天门诊' : '上午门诊';
};

// 添加新的响应式变量用于显示时间详情
const showTimeDialog = ref(false)
const selectedDate = ref(null)
const selectedSchedule = ref(null)

// 添加新的响应式变量
const appointmentIdDialogVisible = ref(false)
const appointmentIdForm = ref({
  appointmentId: ''
})
const appointmentPeriod = ref('')  // 存储选中的时段
const appointmentIdRules = {
  appointmentId: [
    { required: true, message: '请输入预约编号', trigger: 'blur' },
    { type: 'number', message: '预约编号必须为数字', trigger: 'blur', transform: (value) => Number(value) }
  ]
}
const appointmentIdFormRef = ref(null)

// 修改预约按钮点击处理
const handleMakeAppointment = (period) => {
  appointmentPeriod.value = period;
  appointmentIdDialogVisible.value = true;
};

// 修改确认预约函数
const confirmAppointment = async () => {
  if (!appointmentIdFormRef.value) return;
  
  await appointmentIdFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 从localStorage获取患者信息
        const patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
        if (!patientInfo) {
          ElMessage.error('请先登录');
          return;
        }

        // 获取选中时段的开始时间并加59秒
        const baseTime = appointmentPeriod.value === 'morning' ? 
          selectedSchedule.value.morning.split('-')[0] : 
          selectedSchedule.value.afternoon.split('-')[0];
        
        // 将时间字符串转换为数组以便处理
        const [hours, minutes] = baseTime.split(':').map(Number);
        
        // 创建一个日期对象来处理时间
        const timeObj = new Date();
        timeObj.setHours(hours, minutes, 59); // 设置小时、分钟，并将秒数设为59
        
        // 格式化时间，确保两位数格式
        const formattedTime = `${String(timeObj.getHours()).padStart(2, '0')}:${
          String(timeObj.getMinutes()).padStart(2, '0')}:${
          String(timeObj.getSeconds()).padStart(2, '0')}`;

        // 准备预约数据
        const appointmentData = {
          appointmentId: Number(appointmentIdForm.value.appointmentId),
          patientId: patientInfo.patientId,
          doctorId: selectedDoctor.value.id,
          appointmentDate: selectedDate.value,
          appointmentTime: formattedTime  // 使用处理后的时间
        };

        // 发送预约请求
        const response = await createAppointment(appointmentData);
        
        if (response ) {
          ElMessage.success('预约成功');
          appointmentIdDialogVisible.value = false;
          showTimeDialog.value = false;
          scheduleDialogVisible.value = false;
          appointmentIdForm.value.appointmentId = '';  // 清空表单
        } else {
          ElMessage.error('预约失败');
        }
      } catch (error) {
        console.error('预约失败:', error);
        ElMessage.error(error.response?.data?.message || '预约失败，请稍后重试');
      }
    }
  });
};
</script>

<template>
<div class="container">
  <div class="header">
    <ul>
      <li
          v-for="(item, index) in items"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="setActive(index)"
      >
        {{ item }}
      </li>
    </ul>
  </div>

  <!-- 使用 v-if/v-else 控制视图切换 -->
  <div v-if="!showDoctors" class="department-table">
    <div class="filter-section">
      <h3 class="section-title">科室列表</h3>
      <el-select
        v-model="selectedDepartment1"
        placeholder="请选择上级科室"
        clearable
        class="department-select"
      >
        <el-option
          v-for="dept in department1Options"
          :key="dept"
          :label="dept"
          :value="dept"
        />
      </el-select>
    </div>

    <el-table
      v-if="selectedDepartment1"
      v-loading="tableLoading"
      :data="filteredDepartments"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      @row-click="handleRowClick"
      class="custom-table"
    >
      <el-table-column
        prop="index"
        label="序号"
        width="80"
        type="index"
        align="center"
      />
      <el-table-column
        label="上级科室"
        width="200"
        align="center"
      >
        <template #default>
          <el-tag size="large" effect="plain" class="department-tag">
            {{ selectedDepartment1 }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="下级科室"
        align="center"
      >
        <template #default="scope">
          <el-tag
            size="default"
            effect="light"
            class="sub-department-tag"
          >
            {{ scope.row }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-empty
      v-if="!selectedDepartment1"
      description="请选择上级科室查看详情"
      :image-size="200"
    />
  </div>

  <!-- 医生列表视图 -->
  <div v-else class="doctors-list">
    <div class="doctors-header">
      <el-button @click="handleBack" type="primary" plain>
        <el-icon><ArrowLeft /></el-icon>返回科室列表
      </el-button>
      <h3 class="department-info">
        {{ currentDepartment?.parent }} - {{ currentDepartment?.name }}
      </h3>
    </div>

    <div class="doctors-grid" v-loading="doctorsLoading">
      <el-empty
        v-if="!doctorsLoading && (!doctorsList.length)"
        description="暂无医生信息"
      />
      
      <el-card
        v-for="doctor in doctorsList"
        :key="doctor.id"
        class="doctor-card"
        @click="handleDoctorClick(doctor)"
      >
        <div class="doctor-avatar">
          <el-avatar
            :size="80"
            :src="doctor.avatar || '/default-avatar.png'"
            :alt="doctor.name"
          />
        </div>
        <div class="doctor-info">
          <h4 class="doctor-name">{{ doctor.name || '未知姓名' }}</h4>
          <p class="doctor-title">{{ doctor.title || '暂无职称' }}</p>
          <p class="doctor-specialty">{{ doctor.specialty || '暂无特长信息' }}</p>
        </div>
      </el-card>
    </div>
  </div>

  <!-- 修改日历对话框 -->
  <el-dialog
    v-model="scheduleDialogVisible"
    :title="`${selectedDoctor?.name || ''}医生的排班表`"
    width="60%"
  >
    <el-calendar v-model="currentDate">
      <template #dateCell="{ data }">
        <div 
          class="schedule-cell"
          @click="handleDateCellClick(data.day, getScheduleForDate(data.day))"
        >
          <p>{{ data.day.split('-').slice(1).join('-') }}</p>
          <div v-if="getScheduleForDate(data.day)" class="schedule-info">
            <el-tag 
              size="small" 
              :type="getScheduleType(data.day)"
              class="schedule-tag"
            >
              {{ getScheduleText(data.day) }}
            </el-tag>
          </div>
        </div>
      </template>
    </el-calendar>
  </el-dialog>

  <!-- 修改时间详情对话框 -->
  <el-dialog
    v-model="showTimeDialog"
    :title="selectedSchedule?.dayOfWeek + ' 门诊时间'"
    width="30%"
  >
    <div class="time-details">
      <div class="time-slot">
        <h4>上午门诊</h4>
        <p>{{ selectedSchedule?.morning }}</p>
        <el-button 
          type="primary" 
          size="small"
          @click="handleMakeAppointment('morning')"
          class="appointment-btn"
        >
          预约上午门诊
        </el-button>
      </div>
      <div v-if="selectedSchedule?.afternoon" class="time-slot">
        <h4>下午门诊</h4>
        <p>{{ selectedSchedule?.afternoon }}</p>
        <el-button 
          type="primary" 
          size="small"
          @click="handleMakeAppointment('afternoon')"
          class="appointment-btn"
        >
          预约下午门诊
        </el-button>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showTimeDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 添加预约编号输入对话框 -->
  <el-dialog
    v-model="appointmentIdDialogVisible"
    title="输入预约编号"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="appointmentIdFormRef"
      :model="appointmentIdForm"
      :rules="appointmentIdRules"
      label-width="100px"
    >
      <el-form-item label="预约编号" prop="appointmentId">
        <el-input
          v-model="appointmentIdForm.appointmentId"
          placeholder="请输入预约编号"
          type="number"
          :min="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="appointmentIdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAppointment">
          确认预约
        </el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<style scoped>
.container{
  padding:20px 80px;
}
.container .header ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}
.container .header ul li{
  margin:0 20px;
  cursor: pointer;
}
.active{
  color:#4b9a7b;
  font-size: 18px;
  font-weight: 400;
}
.container .footer ul {
  list-style: none;
  padding: 0;
  margin: 30px 0;
  display: flex;
  flex-wrap: wrap;

}
.container .footer ul li{
  margin: 5px 10px;
  background-color: #f5f5f5;
  display: block;
  line-height: 42px;
  color: #333;
  padding: 0 15px;
  border-radius: 4px;
  cursor: pointer;
}
/* 激活项的样式 */
.activeItem {
  background-color: #4b9a7b;
  color: #fff;
}

.department-table {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.filter-section {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.section-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.department-select {
  width: 300px;
}

:deep(.custom-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

:deep(.el-table tr:hover) td {
  background-color: #f0f9eb !important;
}

.department-tag {
  font-size: 14px;
  padding: 8px 15px;
  color: #4b9a7b;
  border-color: #4b9a7b;
}

.sub-department-tag {
  font-size: 13px;
  padding: 6px 12px;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

:deep(.el-empty) {
  padding: 40px 0;
}

.doctors-list {
  margin-top: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.doctors-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.department-info {
  margin: 0;
  font-size: 18px;
  color: #4b9a7b;
  font-weight: 500;
}

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.doctor-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.doctor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  text-align: center;
  margin-bottom: 15px;
}

.doctor-info {
  text-align: center;
}

.doctor-name {
  margin: 10px 0;
  color: #333;
  font-size: 16px;
}

.doctor-title {
  color: #4b9a7b;
  margin: 5px 0;
  font-size: 14px;
}

.doctor-specialty {
  color: #666;
  font-size: 13px;
  margin: 5px 0;
}

:deep(.el-button) {
  display: flex;
  align-items: center;
  gap: 5px;
}

.schedule-cell {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  cursor: pointer;
}

.schedule-cell:hover {
  background-color: #f5f7fa;
}

.schedule-tag {
  margin-top: 4px;
}

.time-details {
  padding: 20px;
}

.time-slot {
  margin-bottom: 20px;
  position: relative;
}

.time-slot h4 {
  color: #606266;
  margin: 0 0 8px 0;
}

.time-slot p {
  color: #409EFF;
  font-size: 16px;
  margin: 0;
}

:deep(.el-calendar-table .el-calendar-day) {
  height: 100px;
  padding: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.appointment-btn {
  margin-top: 10px;
}

.el-input {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>