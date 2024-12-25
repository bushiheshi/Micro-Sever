<script setup lang="ts">
defineOptions({
  name: 'MyHeader'
})
import Img from '@/assets/logo.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { createNotification, getPatientSendMessage } from '@/api/patientAPI'

const router = useRouter()
const patientName = ref('')
const dialogVisible = ref(false)
const messageDialogVisible = ref(false)
const sendMessageDialogVisible = ref(false)
const sentMessageDialogVisible = ref(false)
const selectedDoctor = ref('')
const messageContent = ref('')
const messages = ref([
  {
    id: 1,
    title: '预约提醒',
    content: '您有一个预约将在明天进行',
    time: '2024-01-20 10:30',
    isRead: false
  },
  {
    id: 2,
    title: '检查结果通知',
    content: '您的最新检查结果已出，请及时查看',
    time: '2024-01-19 15:45',
    isRead: true
  }
])
const patientInfo = ref({
  name: '',
  email: '',
  IDCardWord: '',
  gender: 0
})
const sentMessages = ref([])

onMounted(() => {
  console.log('开始获取本地存储的患者信息...')
  const storedInfo = localStorage.getItem('patientInfo')
  console.log('localStorage中的原始数据：', storedInfo)
  
  if (storedInfo) {
    try {
      const patient = JSON.parse(storedInfo)
      console.log('解析后的患者信息：', patient)
      console.log('患者ID：', patient.patientId)
      console.log('患者名称：', patient.name)
      patientName.value = patient.name
      patientInfo.value = patient
    } catch (error) {
      console.error('解析患者信息时出错：', error)
    }
  } else {
    console.log('未找到患者信息')
  }
})

const handleCommand = async (command) => {
  if (command === 'logout') {
    localStorage.removeItem('jwt')
    localStorage.removeItem('patientInfo')
    ElMessage.success('退出登录成功')
    router.push('/login')
  } else if (command === 'profile') {
    dialogVisible.value = true
  } else if (command === 'messages') {
    messageDialogVisible.value = true
  } else if (command === 'sent-messages') {
    try {
      await fetchSentMessages()
      sentMessageDialogVisible.value = true
    } catch (error) {
      ElMessage.error('获取消息失败')
    }
  }
}

const handleClose = (done: () => void) => {
  done()
}

const handleSendMessage = async () => {
  try {
    console.log('开始创建通知...')
    const storedInfo = localStorage.getItem('patientInfo')
    console.log('获取到的患者信息：', storedInfo)
    
    if (!storedInfo) {
      console.log('未找到患者信息，需要重新登录')
      ElMessage.error('未找到患者信息，请重新登录')
      return
    }

    const patientInfo = JSON.parse(storedInfo)
    console.log('解析后的患者信息：', patientInfo)
    console.log('患者ID：', patientInfo.patientId)
    
    if (!patientInfo.patientId) {
      console.log('患者ID不存在')
      ElMessage.error('患者ID不存在，请重新登录')
      return
    }

    if (!selectedDoctor.value) {
      console.log('未输入医生ID')
      ElMessage.error('请输入医生ID')
      return
    }

    // 确保医生ID为整数
    const doctorId = parseInt(selectedDoctor.value)
    if (isNaN(doctorId)) {
      console.log('医生ID必须为数字')
      ElMessage.error('医生ID必须为数字')
      return
    }

    if (!messageContent.value) {
      console.log('未输入消息内容')
      ElMessage.error('请输入消息内容')
      return
    }

    // 生成一个1到100之间的随机ID
    const randomId = Math.floor(Math.random() * 100) + 1

    const notification = {
      patientId: Number(patientInfo.patientId),
      doctorId: doctorId,
      message: ` ${messageContent.value}`,
      direction: 0,
      notificationId: randomId.toString()
    }
    
    console.log('准备发送的通知数据：', notification)
    const response = await createNotification(notification)
    console.log('发送消息返回数据：', response)
    
    ElMessage.success('消息发送成功')
    messageContent.value = ''
    selectedDoctor.value = ''
    sendMessageDialogVisible.value = false
  } catch (error) {
    console.log('=== 错误信息开始 ===')
    console.log('完整的错误对象：', error)
    console.log('localStorage中的患者信息：', localStorage.getItem('patientInfo'))
    console.log('当前表单数据：', {
      selectedDoctor: selectedDoctor.value,
      messageContent: messageContent.value
    })
    console.log('发送的请求数据：', {
      patientId: localStorage.getItem('patientInfo') ? JSON.parse(localStorage.getItem('patientInfo')).patientId : 'undefined',
      doctorId: parseInt(selectedDoctor.value),
      message: `deserunt Ut cillum magna ${messageContent.value}`,
      direction: 0,
      notificationId: Math.floor(Math.random() * 100) + 1
    })
    console.log('错误信息：', error.message)
    console.log('=== 错误信息结束 ===')
    ElMessage.error('发送失败：' + error.message)
  }
}

const fetchSentMessages = async () => {
  try {
    console.log('开始获取已发送消息...')
    const storedInfo = localStorage.getItem('patientInfo')
    console.log('获取到的本地存储信息：', storedInfo)
    
    if (!storedInfo) {
      console.log('未找到患者信息')
      ElMessage.error('未找到患者信息，请重新登录')
      return
    }

    const patientInfo = JSON.parse(storedInfo)
    console.log('解析后的患者信息：', patientInfo)
    
    if (!patientInfo.patientId) {
      console.log('患者ID不存在')
      ElMessage.error('患者ID不存在，请重新登录')
      return
    }

    console.log('正在调用API获取消息，患者ID：', patientInfo.patientId)
    const response = await getPatientSendMessage(patientInfo.patientId)
    console.log('API返回的消息数据：', response)
    
    if (Array.isArray(response)) {
      sentMessages.value = response
      console.log('成功更新消息列表，消息数量：', response.length)
    } else {
      console.log('API返回的数据不是数组：', response)
      sentMessages.value = []
    }
  } catch (error) {
    console.error('获取已发送消息失败：', error)
    ElMessage.error('获取已发送消息失败：' + error.message)
    throw error
  }
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
             <el-dropdown-item command="messages">消息管理</el-dropdown-item>
             <el-dropdown-item command="sent-messages">已发送消息</el-dropdown-item>
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

<!-- 添加消息管理对话框 -->
<el-dialog
  v-model="messageDialogVisible"
  title="消息管理"
  width="50%"
  :before-close="handleClose"
>
  <div class="message-list">
    <el-empty v-if="messages.length === 0" description="暂无消息" />
    <div v-else v-for="msg in messages" :key="msg.id" class="message-item" :class="{ 'unread': !msg.isRead }">
      <div class="message-header">
        <span class="message-title">{{ msg.title }}</span>
        <span class="message-time">{{ msg.time }}</span>
      </div>
      <div class="message-content">{{ msg.content }}</div>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="sendMessageDialogVisible = true">发送消息</el-button>
      <el-button @click="messageDialogVisible = false">关闭</el-button>
    </span>
  </template>
</el-dialog>

<!-- 添加发送消息对话框 -->
<el-dialog
  v-model="sendMessageDialogVisible"
  title="发送消息"
  width="30%"
  :before-close="handleClose"
>
  <div class="send-message-content">
    <div class="send-message-item">
      <span class="label">医生ID：</span>
      <el-input v-model="selectedDoctor" type="number" placeholder="请输入医生ID" />
    </div>
    <div class="send-message-item">
      <span class="label">消息内容：</span>
      <el-input v-model="messageContent" type="textarea" placeholder="请输入消息内容" />
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="sendMessageDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSendMessage">发送</el-button>
    </span>
  </template>
</el-dialog>

<!-- 添加已发送消息对话框 -->
<el-dialog
  v-model="sentMessageDialogVisible"
  title="已发送消息"
  width="50%"
  :before-close="handleClose"
>
  <div class="message-list">
    <el-empty v-if="sentMessages.length === 0" description="暂无已发送消息" />
    <div v-else v-for="msg in sentMessages" :key="msg.notificationId" class="message-item">
      <div class="message-header">
        <span class="message-title">发送给医生ID: {{ msg.doctorId }}</span>
        <span class="message-time">{{ msg.createTime }}</span>
      </div>
      <div class="message-content">{{ msg.message }}</div>
    </div>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="sentMessageDialogVisible = false">关闭</el-button>
    </span>
  </template>
</el-dialog>

</template>

<style scoped>
.container {
  padding:20px 75px;
  display: flex; /* 启用 Flexbox 布局，子元素水平排列 */
  align-items: flex-end; /* 垂直居中对齐 */
  justify-content: space-between; /* 左右两部分分散列，尽量拉开 */
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

.message-list {
  padding: 20px;
}

.message-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.unread {
  background-color: #f0f9ff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-title {
  font-weight: bold;
  color: #303133;
}

.message-time {
  color: #909399;
  font-size: 14px;
}

.message-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

.send-message-content {
  padding: 20px;
}

.send-message-item {
  margin-bottom: 15px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.send-message-item .label {
  width: 100px;
  color: #606266;
  font-weight: bold;
}

</style>