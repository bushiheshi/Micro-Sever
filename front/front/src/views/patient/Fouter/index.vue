<script setup lang="ts">
import {onMounted, ref,computed} from "vue";
import { ElMessage } from "element-plus";
import {getAllDepartments}from "@/api/managerAPI";
import { getDoctorsByDepartment } from "@/api/doctorAPI";

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
    const response = await getAllDepartments();
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
    const response = await getAllDepartments();
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

// 处理医生点击
const handleDoctorClick = (doctor) => {
  console.log('选中的医生:', doctor);
  // 这里可以添加跳转到医生详情页的逻辑
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
</style>