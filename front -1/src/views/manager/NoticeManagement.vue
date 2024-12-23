<template>
  <div class="notice-management">
    <div class="header">
      <h2>通知管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        创建通知
      </el-button>
    </div>

    <!-- 使用卡片形式展示通知 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="notice in notices" :key="notice.attentionId">
        <el-card class="notice-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3 class="notice-title">{{ notice.attentionName }}</h3>
              <div class="notice-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(notice)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(notice)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>
          <div class="notice-content">
            <div class="notice-text">{{ notice.content }}</div>
            <div class="notice-time">
              <el-tag size="small" type="info">
                创建时间: {{ formatTime(notice.attentionTime) }}
              </el-tag>
              <span class="notice-id">ID: {{ notice.attentionId }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑/创建通知对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '创建通知' : '编辑通知'"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item 
          v-if="dialogType === 'create'" 
          label="通知ID" 
          prop="attentionId"
        >
          <el-input-number 
            v-model="form.attentionId" 
            :min="1"
            placeholder="请输入通知ID"
          />
        </el-form-item>
        <el-form-item label="名称" prop="attentionName">
          <el-input v-model="form.attentionName" placeholder="请输入通知名称" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入通知内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saveLoading">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteConfirmVisible"
      title="确认删除"
      width="30%"
    >
      <p>确定要删除这条通知吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button
          type="danger"
          @click="confirmDelete"
          :loading="deleteLoading"
        >
          确认删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getAllAttention, createAttention, deleteAttention, updateAttention } from '@/api/managerAPI';

const notices = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref('create'); // 'create' 或 'edit'
const form = ref({
  attentionId: 1,
  attentionName: '',
  content: ''
});
const formRef = ref(null);
const saveLoading = ref(false);
const deleteConfirmVisible = ref(false);
const deleteLoading = ref(false);
const currentNotice = ref(null);

const rules = {
  attentionId: [
    { required: true, message: '请输入通知ID', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字', trigger: 'blur' }
  ],
  attentionName: [
    { required: true, message: '请输入通知名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
};

// 添加时间格式化函数
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取所有通知
const fetchNotices = async () => {
  loading.value = true;
  try {
    const response = await getAllAttention();
    console.log('获取到的通知数据:', response);
    notices.value = response;
  } catch (error) {
    console.error('获取通知列表失败:', error);
    ElMessage.error('获取通知列表失败');
  } finally {
    loading.value = false;
  }
};

// 创建通知
const handleCreate = () => {
  dialogType.value = 'create';
  form.value = {
    attentionId: 1,
    attentionName: '',
    content: ''
  };
  dialogVisible.value = true;
};

// 编辑通知
const handleEdit = (notice) => {
  dialogType.value = 'edit';
  form.value = {
    attentionName: notice.attentionName,
    content: notice.content
  };
  currentNotice.value = notice;
  dialogVisible.value = true;
};

// 保存通知
const handleSave = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    saveLoading.value = true;

    if (dialogType.value === 'create') {
      const createData = {
        attentionId: form.value.attentionId,
        attentionName: form.value.attentionName,
        content: form.value.content
      };
      
      console.log('创建通知数据:', createData);
      await createAttention(createData);
      ElMessage.success('创建成功');
    } else {
      // 更新通知时的数据结构
      const updateData = {
        attentionName: form.value.attentionName,
        content: form.value.content
      };
      
      console.log('更新通知数据:', updateData);
      await updateAttention(currentNotice.value.attentionId, updateData);
      ElMessage.success('更新成功');
    }

    dialogVisible.value = false;
    await fetchNotices();
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    saveLoading.value = false;
  }
};

// 删除通知
const handleDelete = (notice) => {
  currentNotice.value = notice;
  deleteConfirmVisible.value = true;
};

// 确认删除
const confirmDelete = async () => {
  if (!currentNotice.value) return;
  
  deleteLoading.value = true;
  try {
    await deleteAttention(currentNotice.value.attentionId);
    ElMessage.success('删除成功');
    deleteConfirmVisible.value = false;
    await fetchNotices();
  } catch (error) {
    console.error('删除失败:', error);
    ElMessage.error('删除失败，请重试');
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(() => {
  fetchNotices();
});
</script>

<style scoped>
.notice-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.notice-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.notice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-actions {
  display: flex;
  gap: 10px;
}

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notice-info {
  margin-bottom: 10px;
}

.notice-name {
  font-size: 14px;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 10px;
}

.notice-text {
  color: #606266;
  line-height: 1.6;
  min-height: 80px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 10px 0;
}

.notice-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}

.notice-id {
  color: #909399;
  font-size: 13px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

.el-row {
  margin: 0 -10px;
}

.el-col {
  padding: 0 10px;
}

/* 添加响应式布局 */
@media (max-width: 1200px) {
  .el-col {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .el-col {
    width: 100%;
  }
}
</style> 