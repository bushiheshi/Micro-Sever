<template>
  <div class="doctor-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索医生姓名"
        class="search-input"
        clearable
        @clear="handleSearch"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select
        v-model="departmentFilter"
        placeholder="选择科室"
        clearable
        @change="handleSearch"
        class="filter-select"
      >
        <el-option
          v-for="dept in departments"
          :key="dept.departmentId"
          :label="dept.departmentName1"
          :value="dept.departmentId"
        />
      </el-select>

      <el-select
        v-model="titleFilter"
        placeholder="选择职称"
        clearable
        @change="handleSearch"
        class="filter-select"
      >
        <el-option
          v-for="title in titles"
          :key="title.titleId"
          :label="title.titleName"
          :value="title.titleId"
        />
      </el-select>
    </div>

    <!-- 医生列表 -->
    <el-table
      :data="filteredDoctors"
      border
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column label="科室" width="120">
        <template #default="scope">
          {{ getDepartmentName(scope.row.departmentId) }}
        </template>
      </el-table-column>
      <el-table-column label="职称" width="120">
        <template #default="scope">
          {{ getTitleName(scope.row.titleId) }}
        </template>
      </el-table-column>
      <el-table-column prop="specialty" label="专长" show-overflow-tooltip />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="showDoctorDetails(scope.row)"
          >
            查看详情
          </el-button>
          <el-button
            type="success"
            size="small"
            @click="editDoctor(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="confirmDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 医生详情对话框 -->
    <el-dialog
      v-model="detailsVisible"
      title="医生详细信息"
      width="50%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ currentDoctor.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ currentDoctor.gender }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentDoctor.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="职称">{{ currentDoctor.title }}</el-descriptions-item>
        <el-descriptions-item label="专长" :span="2">{{ currentDoctor.specialty || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">{{ currentDoctor.introduction || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 编辑医生信息对话框 -->
    <el-dialog
      v-model="editVisible"
      title="编辑医生信息"
      width="50%"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="editForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" type="email" />
        </el-form-item>
        <el-form-item label="科室" required>
          <el-select v-model="editForm.departmentId">
            <el-option
              v-for="dept in departments"
              :key="dept.departmentId"
              :label="dept.departmentName1"
              :value="dept.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" required>
          <el-select v-model="editForm.titleId">
            <el-option
              v-for="title in titles"
              :key="title.titleId"
              :label="title.titleName"
              :value="title.titleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="editForm.introduction" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加删除确认对话框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除医生 {{ doctorToDelete?.name }} 吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDelete" :loading="deleteLoading">
            确认删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { getAllDoctorInfo, updateDoctorInfo, deleteDoctor } from '@/api/doctorAPI';
import { getAllDepartments, getAllTitles } from '@/api/managerAPI';

const loading = ref(false);
const searchQuery = ref('');
const departmentFilter = ref('');
const doctors = ref([]);
const departments = ref([]);
const detailsVisible = ref(false);
const editVisible = ref(false);
const currentDoctor = ref({});
const editForm = ref({});
const titleFilter = ref('');
const titles = ref([]);
const deleteConfirmVisible = ref(false);
const deleteLoading = ref(false);
const doctorToDelete = ref(null);

// 添加组件名称定义
defineOptions({
  name: 'DoctorManagement'
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

// 过滤医生列表
const filteredDoctors = computed(() => {
  return doctors.value.filter(doctor => {
    const matchesSearch = !searchQuery.value || 
      doctor.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDepartment = !departmentFilter.value || 
      doctor.departmentId === departmentFilter.value;
    const matchesTitle = !titleFilter.value || 
      doctor.titleId === titleFilter.value;
    return matchesSearch && matchesDepartment && matchesTitle;
  });
});

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已通过计算属性实现
};

// 显示医生详情
const showDoctorDetails = (doctor) => {
  currentDoctor.value = doctor;
  detailsVisible.value = true;
};

// 编辑医生信息
const editDoctor = (doctor) => {
  editForm.value = {
    ...doctor,
    email: doctor.email || '',
    password: doctor.password || '',
    IDCardWord: doctor.IDCardWord || 18
  };
  editVisible.value = true;
};

// 保存编辑
const handleSave = async () => {
  try {
    // 验证必填字段
    if (!editForm.value.name?.trim() || 
        !editForm.value.gender || 
        !editForm.value.departmentId || 
        !editForm.value.titleId) {
      ElMessage.warning('请填写所有必要信息');
      return;
    }

    const result = await updateDoctorInfo(editForm.value.doctorId, editForm.value);
    
    if (result.success) {
      ElMessage.success('保存成功');
      editVisible.value = false;
      await fetchDoctors(); // 刷新列表
    } else {
      ElMessage.error(result.message || '保存失败');
    }
  } catch (error) {
    console.error('Error saving doctor info:', error);
    ElMessage.error(error.message || '保存失败，请稍后重试');
  }
};

// 显示删除确认对话框
const confirmDelete = (doctor) => {
  doctorToDelete.value = doctor;
  deleteConfirmVisible.value = true;
};

// 处理删除操作
const handleDelete = async () => {
  if (!doctorToDelete.value) return;
  
  deleteLoading.value = true;
  try {
    await deleteDoctor(doctorToDelete.value.doctorId);
    ElMessage.success('删除成功');
    deleteConfirmVisible.value = false;
    await fetchDoctors(); // 刷新列表
  } catch (error) {
    console.error('Error deleting doctor:', error);
    ElMessage.error('删除失败');
  } finally {
    deleteLoading.value = false;
    doctorToDelete.value = null;
  }
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
.doctor-management {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 200px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-button--danger) {
  margin-left: 10px;
}
</style> 