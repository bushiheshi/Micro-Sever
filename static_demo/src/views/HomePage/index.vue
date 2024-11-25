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
        default-active="1"
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
          <el-breadcrumb-item>登记挂号</el-breadcrumb-item>
          <el-breadcrumb-item>患者挂号</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Search Form -->
        <el-form :inline="true" class="search-form">
          <el-form-item label="开始日">
            <el-date-picker
              v-model="searchForm.startDate"
              type="date"
              placeholder="选择开始日期"
            />
          </el-form-item>
          <el-form-item label="截止日">
            <el-date-picker
              v-model="searchForm.endDate"
              type="date"
              placeholder="选择结束日期"
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
              <el-option label="手机号码" value="phone" />
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
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="selection" width="55"   fixed/>
          <el-table-column label="挂号编号" prop="registrationNo"  fixed  width="150" />
          <el-table-column label="诊号" prop="diagnosisNo" />
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="性别" prop="gender" />
          <el-table-column label="年龄" prop="age" />
          <el-table-column label="手机" prop="phone" />
          <el-table-column label="挂号医生" prop="doctor" />
          <el-table-column label="挂号时间" prop="registrationTime" />
          <el-table-column label="初/复诊" prop="visitType" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button
                v-if="scope.row.status === '待诊'"
                type="warning"
                size="small"
              >
              <el-icon>
                <Delete/>
              </el-icon>
                取消挂号
              </el-button>
              <el-tag v-else-if="scope.row.status === '已诊'" type="success">
                已诊疗
              </el-tag>
              <el-tag v-else-if="scope.row.status === '已取消'" type="info">
                已取消
              </el-tag>
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
      </el-main>
    </el-container>
  </el-container>
</div>
  <!-- Header -->

  <!-- Main Content -->
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { Plus, HomeFilled,Search,Delete } from "@element-plus/icons-vue";

interface SearchForm {
  startDate: string;
  endDate: string;
  searchType: "registrationNo" | "patientName" | "phone";
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
const tableData = ref<TableData[]>([
  {
    registrationNo: "1714313707",
    diagnosisNo: "1",
    name: "测试",
    gender: "男",
    age: "30岁",
    phone: "13112345678",
    doctor: "李四",
    registrationTime: "2024-04-28 22:15:02",
    visitType: "复诊",
    status: "待诊",
  },
  {
    registrationNo: "1695720861",
    diagnosisNo: "1",
    name: "测试",
    gender: "男",
    age: "30岁",
    phone: "13112345678",
    doctor: "李四",
    registrationTime: "2023-09-26 17:34:17",
    visitType: "复诊",
    status: "待诊",
  },
  {
    registrationNo: "1695720861",
    diagnosisNo: "1",
    name: "测试",
    gender: "男",
    age: "30岁",
    phone: "13112345678",
    doctor: "李四",
    registrationTime: "2023-09-26 17:34:17",
    visitType: "复诊",
    status: "已取消",
  },
  {
    registrationNo: "1695720861",
    diagnosisNo: "1",
    name: "测试",
    gender: "男",
    age: "30岁",
    phone: "13112345678",
    doctor: "李四",
    registrationTime: "2023-09-26 17:34:17",
    visitType: "复诊",
    status: "已诊",
  },
  {
    registrationNo: "1714313707",
    diagnosisNo: "1",
    name: "测试",
    gender: "男",
    age: "30岁",
    phone: "13112345678",
    doctor: "李四",
    registrationTime: "2024-04-28 22:15:02",
    visitType: "复诊",
    status: "待诊",
  },
]);

// Pagination
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(5);

// Methods
const handleSearch = (): void => {
  console.log("Searching with:", searchForm);
};

const handleAdd = (): void => {
  console.log("Adding new registration");
};

const handleSizeChange = (val: number): void => {
  console.log("Page size changed to:", val);
};

const handleCurrentChange = (val: number): void => {
  console.log("Current page changed to:", val);
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
