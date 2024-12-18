<template>
  <div class="clinic-system">
  <el-container>
    <el-header>
      <el-header class="header">
        <div class="logo">医生办公室预约系统管理员端</div>
        <el-menu
          mode="horizontal"
          :router="true"
          class="menu"
          background-color="#2d2d2d"
          text-color="#fff"
          active-text-color="#fff"
          default-active="/home"
        >
          <el-menu-item index="/home">预约信息</el-menu-item>
          <el-menu-item index="/prescription">医生信息</el-menu-item>
          <el-menu-item index="/billing">修改工作时间</el-menu-item>
          <el-menu-item index="/pharmacy">通知管理</el-menu-item>
          <el-menu-item index="/finance">公告管理</el-menu-item>

        </el-menu>
        <div class="user-info">
          <span class="username">济医(超级管理员)</span>
          <el-button type="danger" size="small">退出登录</el-button>
        </div>
      </el-header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          :default-active="activeMenu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="1">
            <span>登记挂号</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span>患者档案</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">
            <el-icon><HomeFilled /></el-icon> 首页
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ activeMenu === '1' ? '登记挂号' : '患者档案' }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Search Form -->
        <div v-show="activeMenu === '1'">
          <el-form :inline="true" class="search-form">
            <el-form-item label="开始日">
              <el-date-picker
                v-model="searchForm.startDate"
                type="date"
                placeholder="选择开始日期"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item label="截止日">
              <el-date-picker
                v-model="searchForm.endDate"
                type="date"
                placeholder="选择结束日期"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item label="搜索方式">
              <el-select
                v-model="searchForm.searchType"
                placeholder="请选择搜索方式"
                style="width: 300px;"
              >
                <el-option label="挂号编号" value="registrationNo" />
                <el-option label="患者姓名" value="patientName" />
                <el-option label="医生姓名" value="doctorName" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="searchForm.keyword"
                placeholder="请输入搜索内容"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search/></el-icon>
              </el-button>
            </el-form-item>
          </el-form>

          <!-- Action Button -->
          <div class="action-bar">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon> 添加挂号
            </el-button>
            <span class="total">共有数据：{{ total }} 条</span>
          </div>

          <!-- Data Table -->
          <el-table 
            :data="tableData" 
            border 
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55" fixed/>
            <el-table-column label="挂号编号" prop="registrationNo" fixed width="150" />
            <el-table-column label="诊号" prop="diagnosisNo" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="性别" prop="gender" />
            <el-table-column label="年龄" prop="age" />
            <el-table-column label="手机" prop="phone" />
            <el-table-column label="挂号医生" prop="doctor" />
            <el-table-column label="挂号时间" prop="registrationTime" />
            <el-table-column label="初/复诊" prop="visitType" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === '待诊' ? 'warning' : 
                         scope.row.status === '已诊' ? 'success' : 'info'"
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === '待诊'"
                  type="danger"
                  size="small"
                  @click="handleCancelAppointment(scope.row.registrationNo)"
                >
                  <el-icon><Delete/></el-icon>
                  取消挂号
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- Pagination -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <!-- 患者档案内容 -->
        <div v-show="activeMenu === '2'">
          <patient-records />
        </div>
      </el-main>
    </el-container>
  </el-container>
</div>
  <!-- Header -->

  <!-- Main Content -->
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, shallowRef } from "vue";
import { Plus, HomeFilled, Search, Delete } from "@element-plus/icons-vue";
import { getAllDoctorID, getDoctorInfo } from "@/api/doctorAPI";
import { getAllAppointment } from "@/api/managerAPI";
import { getPatientInfo } from "@/api/patientAPI";
import { ElMessage } from 'element-plus';
import PatientRecords from './patientRecords.vue';

const doctorID = ref([]);

onMounted(async () => {
  try {
    const ids = await getAllDoctorID();
    doctorID.value = ids;
  } catch (error) {
    console.error('Error fetching doctors on mount:', error);
  }
  console.log(doctorID.value)
  await fetchAppointments();
});

const getDoctorID = async () => {

}

interface SearchForm {
  startDate: string;
  endDate: string;
  searchType: "registrationNo" | "patientName" | "doctorName";
  keyword: string;
}

interface TableData {
  registrationNo: string;
  diagnosisNo: string;
  name: string;
  gender: string;
  age: string;
  phone: string;
  doctor: string;
  registrationTime: string;
  visitType: string;
  status: "待诊" | "已诊" | "已取消";
}

// Search form data
const searchForm = reactive<SearchForm>({
  startDate: "",
  endDate: "",
  searchType: "registrationNo",
  keyword: "",
});

// Table data
const tableData = ref<any[]>([]);
const loading = ref(false);

// 获取所有预约信息
const fetchAppointments = async () => {
  loading.value = true;
  try {
    const appointments = await getAllAppointment();
    console.log('Raw appointments:', appointments); // 添加日志查看原始数据
    
    // 处理每个预约记录
    const processedAppointments = await Promise.all(
      appointments.map(async (appointment: Appointment) => {
        try {
          // 获取患者信息
          const patientInfo = await getPatientInfo(appointment.patientId);
          // 获取医生信息
          const doctorInfo = await getDoctorInfo(appointment.doctorId);
          
          // 合并信息
          return {
            registrationNo: appointment.appointmentId,
            diagnosisNo: appointment.patientId,
            name: patientInfo.name,
            gender: patientInfo.gender,
            age: calculateAge(patientInfo.birthDate),
            phone: patientInfo.phone,
            doctor: doctorInfo.name,
            registrationTime: `${appointment.appointmentDate} ${appointment.appointmentTime}`,
            visitType: '普通门诊',
            status: translateStatus(appointment.status),
          };
        } catch (error) {
          console.error('Error processing appointment:', appointment, error);
          return null;
        }
      })
    );

    // 过滤掉处理失败的预约
    tableData.value = processedAppointments.filter(item => item !== null);
    total.value = tableData.value.length;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    ElMessage.error('获取预约信息失败');
  } finally {
    loading.value = false;
  }
};

// 计算年龄的函数
const calculateAge = (birthDate: string) => {
  if (!birthDate) return '未知';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return `${age}岁`;
};

// 转换预约状态的函数
const translateStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: '待诊',
    COMPLETED: '已诊',
    CANCELLED: '已取消',
    // 添加其他可能的状态映射
  };
  return statusMap[status] || status;
};

// Pagination
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(5);

// Methods
const handleSearch = async () => {
  const { startDate, endDate, searchType, keyword } = searchForm;
  
  if (!keyword && !startDate && !endDate) {
    await fetchAppointments();
    return;
  }

  const filteredData = tableData.value.filter(item => {
    let matchesKeyword = true;
    let matchesDate = true;

    // 关键字搜索
    if (keyword) {
      switch (searchType) {
        case 'registrationNo':
          matchesKeyword = item.registrationNo.includes(keyword);
          break;
        case 'patientName':
          matchesKeyword = item.name.toLowerCase().includes(keyword.toLowerCase());
          break;
        case 'doctorName':
          matchesKeyword = item.doctor.toLowerCase().includes(keyword.toLowerCase());
          break;
      }
    }

    // 日期范围搜索
    if (startDate && endDate) {
      const appointmentDateStr = item.registrationTime.split(' ')[0];
      const appointmentDate = new Date(appointmentDateStr);
      const start = new Date(formatDate(startDate));
      const end = new Date(formatDate(endDate));
      
      appointmentDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      matchesDate = appointmentDate >= start && appointmentDate <= end;
    }

    return matchesKeyword && matchesDate;
  });

  tableData.value = filteredData;
  total.value = filteredData.length;
};

const handleAdd = (): void => {
  console.log("Adding new registration");
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchAppointments();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchAppointments();
};

const handleCancelAppointment = async (appointmentId: string) => {
  try {
    // 调用取消预约的 API
    // await cancelAppointment(appointmentId);
    ElMessage.success('预约已取消');
    await fetchAppointments(); // 刷新数据
  } catch (error) {
    console.error('Error canceling appointment:', error);
    ElMessage.error('取消预约失败');
  }
};

interface Appointment {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  
}

// 格式化日期的函数
const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

// 日期选择器的值改变时的处理函数
const handleDateChange = () => {
  if (searchForm.startDate && searchForm.endDate) {
    const start = new Date(searchForm.startDate);
    const end = new Date(searchForm.endDate);
    if (start > end) {
      ElMessage.warning('开始日期不能大于结束日期');
      searchForm.endDate = '';
    }
  }
};

const activeMenu = ref('1');
const currentComponent = shallowRef(null);

const handleMenuSelect = (index: string) => {
  activeMenu.value = index;
  if (index === '1') {
    // 切换到登记挂号时重新加载数据
    fetchAppointments();
  }
};
</script>

<style scoped>
.clinic-system {
  height: 100vh;
  display: flex;
}

.el-header{
  padding: 0;
}
.header {
  background-color: #2d2d2d;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
  color: rgb(237,226,192);
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
  color: rgb(237,226,192);
}

.el-breadcrumb {
  margin: 16px 0;
  font-size: 14px;
}

.search-form {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.total {
  color: #666;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  height: 60px;
  line-height: 60px;
  border-bottom: none;
  border-bottom: 4px solid transparent;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background-color: #1e1e1e !important;
  border-bottom: none;
  position: relative;
  border-bottom: 4px solid  var(--el-color-primary) !important;

}
.el-menu-vertical-demo{
  height: calc(100vh - 60px);
}

</style>
