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

    <!-- 在搜索栏下方添加添加医生按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAddDoctor">
        <el-icon><Plus /></el-icon>
        添加医生
      </el-button>
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
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="editForm.departmentId">
            <el-option
              v-for="dept in departments"
              :key="dept.departmentId"
              :label="dept.departmentName1"
              :value="dept.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="editForm.titleId">
            <el-option
              v-for="title in titles"
              :key="title.titleId"
              :label="title.titleName"
              :value="title.titleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="editForm.idcardWord" />
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

    <!-- 添加医生对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加医生"
      width="50%"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="100px"
      >
        <el-form-item label="医生ID" prop="doctorId">
          <el-input-number 
            v-model="addForm.doctorId" 
            :min="1"
            placeholder="请输入医生ID"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="addForm.password" 
            type="password" 
            show-password
            placeholder="请输入密码" 
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="IDCardWord">
          <el-input v-model="addForm.IDCardWord" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="addForm.gender" placeholder="请选择性别">
            <el-option label="男" :value="0" />
            <el-option label="女" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室" prop="departmentId">
          <el-select v-model="addForm.departmentId" placeholder="请选择科室">
            <el-option
              v-for="dept in departments"
              :key="dept.departmentId"
              :label="dept.departmentName1"
              :value="dept.departmentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="titleId">
          <el-select v-model="addForm.titleId" placeholder="请选择职称">
            <el-option
              v-for="title in titles"
              :key="title.titleId"
              :label="title.titleName"
              :value="title.titleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="addForm.introduction"
            type="textarea"
            :rows="4"
            placeholder="请输入简介"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDoctor" :loading="addLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import { getAllDoctorInfo, updateDoctorInfo, deleteDoctor, doctorRegister } from '@/api/doctorAPI';
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
const addDialogVisible = ref(false);
const addLoading = ref(false);
const addFormRef = ref(null);
const addForm = ref({
  doctorId: 1,
  email: '',
  password: '',
  IDCardWord: '',
  name: '',
  gender: 0,
  introduction: '',
  titleId: null,
  departmentId: null
});
const addRules = {
  doctorId: [
    { required: true, message: '请输入医生ID', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  IDCardWord: [
    { required: true, message: '请输入身份证号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  departmentId: [
    { required: true, message: '请选择科室', trigger: 'change' }
  ],
  titleId: [
    { required: true, message: '请选择职称', trigger: 'change' }
  ]
};

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
    doctorId: doctor.doctorId,
    email: doctor.email,
    password: doctor.password,
    name: doctor.name,
    gender: doctor.gender, // 0 或 1
    introduction: doctor.introduction,
    titleId: doctor.titleId,
    departmentId: doctor.departmentId,
    idcardWord: doctor.idcardWord,
    IDCardWord: doctor.IDCardWord
  };
  editVisible.value = true;
};

// 保存编辑
const handleSave = async () => {
  try {
    // 构造符合后端要求的数据格式
    const doctorData = {
      doctorId: editForm.value.doctorId,
      email: editForm.value.email,
      password: editForm.value.password,
      name: editForm.value.name,
      gender: parseInt(editForm.value.gender), // 确保是数字
      introduction: editForm.value.introduction,
      titleId: parseInt(editForm.value.titleId), // 确保是数字
      departmentId: parseInt(editForm.value.departmentId), // 确保是数字
      idcardWord: editForm.value.idcardWord,
      IDCardWord: editForm.value.IDCardWord
    };

    console.log('准备更新的医生信息:', doctorData);
    
    const response = await updateDoctorInfo(doctorData.doctorId, doctorData);
    
    if (response) {
      ElMessage.success('医生信息更新成功');
      editVisible.value = false;
      await fetchDoctors(); // 刷新列表
    }
  } catch (error) {
    console.error('保存医生信息失败:', error);
    ElMessage.error('更新失败，请重试');
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
    console.log('要删除的医生信息:', {
      doctorId: doctorToDelete.value.doctorId,
      rawData: doctorToDelete.value,
      parsedId: parseInt(doctorToDelete.value.doctorId)
    });
    
    // 确保 doctorId 是数字类型
    const doctorId = parseInt(doctorToDelete.value.doctorId);
    await deleteDoctor(doctorId);
    
    ElMessage.success('删除成功');
    deleteConfirmVisible.value = false;
    await fetchDoctors(); // 刷新列表
  } catch (error) {
    console.error('删除医生失败:', error);
    ElMessage.error(error.response?.data?.message || '删除失败，请重试');
  } finally {
    deleteLoading.value = false;
    doctorToDelete.value = null;
  }
};

// 处理添加医生按钮点击
const handleAddDoctor = () => {
  addForm.value = {
    doctorId: 1,
    email: '',
    password: '',
    IDCardWord: '',
    name: '',
    gender: 0,
    introduction: '',
    titleId: null,
    departmentId: null
  };
  addDialogVisible.value = true;
};

// 处理保存新医生
const handleSaveDoctor = async () => {
  if (!addFormRef.value) return;
  
  try {
    await addFormRef.value.validate();
    addLoading.value = true;

    const doctorData = {
      doctorId: addForm.value.doctorId,
      email: addForm.value.email,
      password: addForm.value.password,
      IDCardWord: addForm.value.IDCardWord,
      name: addForm.value.name,
      gender: addForm.value.gender,
      introduction: addForm.value.introduction || '',
      titleId: addForm.value.titleId,
      departmentId: addForm.value.departmentId
    };

    console.log('添加医生数据:', doctorData);
    
    await doctorRegister(doctorData);
    ElMessage.success('添加医生成功');
    addDialogVisible.value = false;
    await fetchDoctors(); // 刷新医生列表
  } catch (error) {
    console.error('添加医生失败:', error);
    ElMessage.error('添加失败，请重试');
  } finally {
    addLoading.value = false;
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

.action-bar {
  margin: 20px 0;
  display: flex;
  justify-content: flex-start;
}

.el-input-number {
  width: 100%;
}
</style> 