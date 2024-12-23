<script setup lang="ts">
defineOptions({
  name: 'MyHeader'
})
import Img from '@/assets/logo.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const patientName = ref('')
const dialogVisible = ref(false)
const patientInfo = ref({
  name: '',
  email: '',
  IDCardWord: '',
  gender: 0
})

onMounted(() => {
  const storedInfo = localStorage.getItem('patientInfo')
  if (storedInfo) {
    const patient = JSON.parse(storedInfo)
    patientName.value = patient.name
    patientInfo.value = patient
  }
})

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('jwt')
    localStorage.removeItem('patientInfo')
    ElMessage.success('退出登录成功')
    router.push('/login')
  } else if (command === 'profile') {
    dialogVisible.value = true
  }
}

const handleClose = (done: () => void) => {
  done()
}
</script>

<template>
<div class="container">
 <div class="imgContainer">
   <img :src="Img" alt="logo">
 </div>
 <div class="headerRight">
   <ul>
     <li>公众版|</li>
     <li>English|</li>
     <li>German|</li>
     <li>员工/学生版</li>
     <li><input type="text" placeholder="搜索"></li>
     <li class="user-info">
       <el-dropdown @command="handleCommand">
         <span class="user-name">
           {{ patientName }}
           <el-icon class="el-icon--right"><ArrowDown /></el-icon>
         </span>
         <template #dropdown>
           <el-dropdown-menu>
             <el-dropdown-item command="profile">个人信息</el-dropdown-item>
             <el-dropdown-item command="logout">退出登录</el-dropdown-item>
           </el-dropdown-menu>
         </template>
       </el-dropdown>
     </li>
   </ul>
 </div>
</div>

<!-- 添加个人信息对话框 -->
<el-dialog
  v-model="dialogVisible"
  title="个人信息"
  width="30%"
  :before-close="handleClose"
>
  <div class="profile-content">
    <div class="profile-item">
      <span class="label">姓名：</span>
      <span>{{ patientInfo.name }}</span>
    </div>
    <div class="profile-item">
      <span class="label">邮箱：</span>
      <span>{{ patientInfo.email }}</span>
    </div>
    <div class="profile-item">
      <span class="label">身份证号：</span>
      <span>{{ patientInfo.IDCardWord }}</span>
    </div>
    <div class="profile-item">
      <span class="label">性别：</span>
      <span>{{ patientInfo.gender === 1 ? '男' : '女' }}</span>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
    </span>
  </template>
</el-dialog>

</template>

<style scoped>
.container {
  padding:20px 75px;
  display: flex; /* 启用 Flexbox 布局，子元素水平排列 */
  align-items: flex-end; /* 垂直居中对齐 */
  justify-content: space-between; /* 左右两部分分散排列，尽量拉开 */
}

.imgContainer {
  flex-shrink: 0; /* 防止图片被压缩 */
}

.headerRight ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center; /* 添加这行确保所有项垂直居中 */
}

.headerRight li {
  margin-right: 10px;
  font-size: 18px;
}

.user-info {
  margin-left: 20px;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409EFF;
  font-size: 16px;
}

.user-name:hover {
  opacity: 0.8;
}

.el-icon--right {
  margin-left: 4px;
}

.headerRight li input {
  width: 30%;
  padding: 8px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 50px;
  outline: none;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.profile-content {
  padding: 20px;
}

.profile-item {
  margin-bottom: 15px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.profile-item .label {
  width: 100px;
  color: #606266;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

:deep(.el-dialog__body) {
  padding: 0;
}

</style>