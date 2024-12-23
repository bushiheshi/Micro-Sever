<template>
  <div class="work-time-management">
    <div class="doctor-cards">
      <el-row :gutter="20">
        <el-col v-for="doctor in doctors" :key="doctor.doctorId" :span="8">
          <el-card class="doctor-card" shadow="hover">
            <div class="doctor-info">
              <h3>{{ doctor.name }}</h3>
              <p>科室：{{ getDepartmentName(doctor.departmentId) }}</p>
              <p>职称：{{ getTitleName(doctor.titleId) }}</p>
              <el-button 
                type="primary" 
                @click="handleEditWorkTime(doctor)"
              >
                修改工作时间
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 工作时间编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${currentDoctor?.name || ''}的工作时间`"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="console.log('对话框打开')"
      @closed="console.log('对话框关闭')"
    >
      <div v-loading="timeTableLoading">
        <!-- 添加创建按钮 -->
        <div class="dialog-header">
          <el-button 
            type="primary" 
            @click="handleCreate"
          >
            创建工作时间
          </el-button>
        </div>

        <el-table :data="workingHours" border style="width: 100%">
          <el-table-column prop="dayOfWeek" label="工作日" width="120">
            <template #default="scope">
              {{ getDayOfWeek(scope.row.dayOfWeek) }}
            </template>
          </el-table-column>
          <el-table-column label="上午">
            <template #default="scope">
              {{ scope.row.startTimeMorning }} - {{ scope.row.endTimeMorning }}
            </template>
          </el-table-column>
          <el-table-column label="下午">
            <template #default="scope">
              {{ scope.row.startTimeAfternoon }} - {{ scope.row.endTimeAfternoon }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="handleDeleteDay(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 将删除所有按钮移到表格下方 -->
        <div class="table-footer">
          <el-button 
            type="danger" 
            @click="handleDeleteAll"
          >
            删除该医生所有工作时间
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 添加编辑单天工作时间的对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑工作时间"
      width="50%"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="工作日">
          <el-input v-model="editForm.dayText" disabled />
        </el-form-item>
        <el-form-item label="上午开始时间">
          <el-time-picker
            v-model="editForm.startTimeMorning"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="上午结束时间">
          <el-time-picker
            v-model="editForm.endTimeMorning"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="下午开始时间">
          <el-time-picker
            v-model="editForm.startTimeAfternoon"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="下午结束时间">
          <el-time-picker
            v-model="editForm.endTimeAfternoon"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveWorkTime" :loading="saveLoading">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加删除确认对话框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="确认删除"
      width="30%"
    >
      <span>{{ deleteConfirmMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button 
            type="danger" 
            @click="confirmDelete" 
            :loading="deleteLoading"
          >
            确认删除
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加创建工作时间的对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建工作时间"
      width="50%"
    >
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="工作日">
          <el-select v-model="createForm.dayOfWeek" placeholder="请选择工作日">
            <el-option label="星期一" value="MONDAY" />
            <el-option label="星期二" value="TUESDAY" />
            <el-option label="星期三" value="WEDNESDAY" />
            <el-option label="星期四" value="THURSDAY" />
            <el-option label="星期五" value="FRIDAY" />
            <el-option label="星期六" value="SATURDAY" />
            <el-option label="星期日" value="SUNDAY" />
          </el-select>
        </el-form-item>
        <el-form-item label="上午开始时间">
          <el-time-picker
            v-model="createForm.startTimeMorning"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="上午结束时间">
          <el-time-picker
            v-model="createForm.endTimeMorning"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="下午开始时间">
          <el-time-picker
            v-model="createForm.startTimeAfternoon"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="下午结束时间">
          <el-time-picker
            v-model="createForm.endTimeAfternoon"
            format="HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCreate" :loading="createLoading">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllDoctorInfo, getDoctorWorkingHours, editDoctorWorkingHours, deleteDoctorWorkingHours, deleteDoctorAllWorkingHours, createDoctorWorkingHours } from '@/api/doctorAPI';
import { getAllDepartments, getAllTitles } from '@/api/managerAPI';
import { ElMessage } from 'element-plus';

const doctors = ref([]);
const departments = ref([]);
const titles = ref([]);
const dialogVisible = ref(false);
const currentDoctor = ref(null);
const workingHours = ref([]);
const timeTableLoading = ref(false);
const editDialogVisible = ref(false);
const saveLoading = ref(false);
const editForm = ref({
  doctorId: null,
  dayOfWeek: '',
  dayText: '',
  startTimeMorning: '',
  endTimeMorning: '',
  startTimeAfternoon: '',
  endTimeAfternoon: ''
});
const deleteConfirmVisible = ref(false);
const deleteLoading = ref(false);
const deleteConfirmMessage = ref('');
const deleteType = ref(''); // 'day' 或 'all'
const dayToDelete = ref(null);
const createDialogVisible = ref(false);
const createLoading = ref(false);
const createForm = ref({
  dayOfWeek: '',
  startTimeMorning: null,
  endTimeMorning: null,
  startTimeAfternoon: null,
  endTimeAfternoon: null
});

// 获取所有医生信息
const fetchDoctors = async () => {
  try {
    const response = await getAllDoctorInfo();
    doctors.value = response;
  } catch (error) {
    console.error('获取医生列表失败:', error);
    ElMessage.error('获取医生列表失败');
  }
};

// 获取所有科室
const fetchDepartments = async () => {
  try {
    const response = await getAllDepartments();
    departments.value = response;
  } catch (error) {
    console.error('获取科室列表失败:', error);
    ElMessage.error('获取科室列表失败');
  }
};

// 获所有职称
const fetchTitles = async () => {
  try {
    const response = await getAllTitles();
    titles.value = response;
  } catch (error) {
    console.error('获取职称列表失败:', error);
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

// 处理修改工作时间
const handleEditWorkTime = async (doctor) => {
  console.log('点击修改工作时间按钮:', doctor);
  currentDoctor.value = doctor;
  dialogVisible.value = true;
  timeTableLoading.value = true;
  
  try {
    console.log('准备获取医生工作时间:', {
      doctorId: doctor.doctorId,
      currentDoctor: currentDoctor.value
    });
    
    const response = await getDoctorWorkingHours(doctor.doctorId);
    console.log('获取到的工作时间数据:', response);
    
    workingHours.value = response.data || [];
    
    // 如果没有工作时间数据，初始化一个空的工作时间表
    if (workingHours.value.length === 0) {
      console.log('没有工作时间数据，初始化空表');
      const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      workingHours.value = weekDays.map(day => ({
        dayOfWeek: day,
        startTimeMorning: '',
        endTimeMorning: '',
        startTimeAfternoon: '',
        endTimeAfternoon: ''
      }));
    }
    console.log('最终的工作时间数据:', workingHours.value);
  } catch (error) {
    console.error('获取医生工作时间失败:', error);
    ElMessage.error('获取工作时间失败');
  } finally {
    timeTableLoading.value = false;
  }
};

// 获取星期几的文字描述
const getDayOfWeek = (day) => {
  const days = {
    'MONDAY': '星期一',
    'TUESDAY': '星期二',
    'WEDNESDAY': '星期三',
    'THURSDAY': '星期四',
    'FRIDAY': '星期五',
    'SATURDAY': '星期六',
    'SUNDAY': '星期日',
    // 保留数字映射以防万一
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日'
  };
  return days[day] || '未知';
};

// 处理编辑单天工作时间
const handleEdit = (workTime) => {
  editForm.value = {
    doctorId: currentDoctor.value.doctorId,
    dayOfWeek: workTime.dayOfWeek,
    dayText: getDayOfWeek(workTime.dayOfWeek),
    startTimeMorning: workTime.startTimeMorning ? new Date(`2000-01-01T${workTime.startTimeMorning}`) : null,
    endTimeMorning: workTime.endTimeMorning ? new Date(`2000-01-01T${workTime.endTimeMorning}`) : null,
    startTimeAfternoon: workTime.startTimeAfternoon ? new Date(`2000-01-01T${workTime.startTimeAfternoon}`) : null,
    endTimeAfternoon: workTime.endTimeAfternoon ? new Date(`2000-01-01T${workTime.endTimeAfternoon}`) : null
  };
  editDialogVisible.value = true;
};

// 格式化时间
const formatTime = (date) => {
  if (!date) return null;
  return date.toTimeString().split(' ')[0];
};

// 保存工作时间
const handleSaveWorkTime = async () => {
  saveLoading.value = true;
  try {
    const workTimeData = {
      doctorId: editForm.value.doctorId,
      dayOfWeek: editForm.value.dayOfWeek,
      startTimeMorning: formatTime(editForm.value.startTimeMorning),
      endTimeMorning: formatTime(editForm.value.endTimeMorning),
      startTimeAfternoon: formatTime(editForm.value.startTimeAfternoon),
      endTimeAfternoon: formatTime(editForm.value.endTimeAfternoon)
    };

    console.log('保存工作时间数据:', workTimeData);
    
    const response = await editDoctorWorkingHours(workTimeData);
    
    if (response) {
      ElMessage.success('工作时间更新成功');
      editDialogVisible.value = false;
      // 刷新工作时间数据
      await handleEditWorkTime(currentDoctor.value);
    }
  } catch (error) {
    console.error('保存工作时间失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    saveLoading.value = false;
  }
};

// 处理删除单天工作时间
const handleDeleteDay = (workTime) => {
  deleteType.value = 'day';
  dayToDelete.value = workTime;
  deleteConfirmMessage.value = `确定要删除 ${getDayOfWeek(workTime.dayOfWeek)} 的工作时间吗？`;
  deleteConfirmVisible.value = true;
};

// 处理删除所有工作时间
const handleDeleteAll = () => {
  deleteType.value = 'all';
  deleteConfirmMessage.value = `确定删除 ${currentDoctor.value.name} 的所有工作时间吗？`;
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  deleteLoading.value = true;
  try {
    if (deleteType.value === 'day' && dayToDelete.value) {
      console.log('删除单天工作时间:', {
        doctorId: currentDoctor.value.doctorId,
        dayOfWeek: dayToDelete.value.dayOfWeek
      });
      
      await deleteDoctorWorkingHours(
        currentDoctor.value.doctorId,
        dayToDelete.value.dayOfWeek
      );
      ElMessage.success('删除成功');
    } else if (deleteType.value === 'all') {
      console.log('删除所有工作时间:', {
        doctorId: currentDoctor.value.doctorId
      });
      
      await deleteDoctorAllWorkingHours(currentDoctor.value.doctorId);
      ElMessage.success('删除所有工作时间成功');
    }
    
    // 刷新工作时间数据
    await handleEditWorkTime(currentDoctor.value);
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败，请重试');
  } finally {
    deleteLoading.value = false;
    deleteConfirmVisible.value = false;
    dayToDelete.value = null;
  }
};

// 处理创建按钮点击
const handleCreate = () => {
  createForm.value = {
    dayOfWeek: '',
    startTimeMorning: null,
    endTimeMorning: null,
    startTimeAfternoon: null,
    endTimeAfternoon: null
  };
  createDialogVisible.value = true;
};

// 处理保存创建
const handleSaveCreate = async () => {
  createLoading.value = true;
  try {
    // 验证必填字段
    if (!createForm.value.dayOfWeek) {
      ElMessage.warning('请选择工作日');
      return;
    }
    if (!createForm.value.startTimeMorning || !createForm.value.endTimeMorning ||
        !createForm.value.startTimeAfternoon || !createForm.value.endTimeAfternoon) {
      ElMessage.warning('请填写完整的工作时间');
      return;
    }

    // 格式化时间数据
    const workTimeData = {
      doctorId: currentDoctor.value.doctorId,
      dayOfWeek: createForm.value.dayOfWeek,
      startTimeMorning: formatTimeStr(createForm.value.startTimeMorning),
      endTimeMorning: formatTimeStr(createForm.value.endTimeMorning),
      startTimeAfternoon: formatTimeStr(createForm.value.startTimeAfternoon),
      endTimeAfternoon: formatTimeStr(createForm.value.endTimeAfternoon)
    };

    console.log('创建工作时间数据:', workTimeData);
    
    const response = await createDoctorWorkingHours(workTimeData);
    
    if (response) {
      ElMessage.success('工作时间创建成功');
      createDialogVisible.value = false;
      // 刷新工作时间数据
      await handleEditWorkTime(currentDoctor.value);
    }
  } catch (error) {
    console.error('创建工作时间失败:', error);
    ElMessage.error('创建失败，请重试');
  } finally {
    createLoading.value = false;
  }
};

// 添加新的时间格式化函数
const formatTimeStr = (date) => {
  if (!date) return null;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
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
.work-time-management {
  padding: 20px;
}

.doctor-cards {
  margin-top: 20px;
}

.doctor-card {
  margin-bottom: 20px;
  height: 100%;
}

.doctor-info {
  text-align: center;
}

.doctor-info h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.doctor-info p {
  margin: 5px 0;
  color: #606266;
}

.el-button {
  margin-top: 15px;
}

.el-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.el-table {
  margin-top: 20px;
}

.el-time-picker {
  width: 100%;
}

.table-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-button + .el-button {
  margin-left: 10px;
}

.dialog-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.dialog-header {
  margin-bottom: 20px;
}

.el-select {
  width: 100%;
}
</style> 