<template>
  <div class="attention-management">
    <div class="header">
      <h2>通告管理</h2>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        创建通告
      </el-button>
    </div>

    <!-- 通告列表 -->
    <div class="attention-list">
      <el-card v-for="attention in attentions" 
               :key="attention.attentionId" 
               class="attention-card">
        <template #header>
          <div class="card-header">
            <span class="title">{{ attention.attentionName }}</span>
            <div class="actions">
              <el-button type="primary" 
                        size="small" 
                        @click="handleEdit(attention)"
                        style="margin-right: 10px;">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" 
                        size="small" 
                        @click="handleDelete(attention.attentionId)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </template>
        <div class="content">
          <p>{{ attention.content }}</p>
          <div class="meta">
            <span class="time">发布时间: {{ formatDate(attention.releaseTime) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 创建通告对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建通告"
      width="50%"
    >
      <el-form :model="newAttention" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newAttention.attentionName" placeholder="请输入通告标题"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="newAttention.content"
            type="textarea"
            :rows="4"
            placeholder="请输入通告内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

    <!-- 编辑通告对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑通告"
      width="50%"
    >
      <el-form :model="editingAttention" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editingAttention.attentionName" placeholder="请输入通告标题"/>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="editingAttention.content"
            type="textarea"
            :rows="4"
            placeholder="请输入通告内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Delete, Edit } from '@element-plus/icons-vue';
import { getAllAttention, createAttention, deleteAttention, updateAttention } from '@/api/managerAPI';

const attentions = ref([]);
const createDialogVisible = ref(false);
const newAttention = ref({
  attentionName: '',
  content: '',
  releaseTime: new Date().toISOString()
});

// 添加新的响应式变量
const editDialogVisible = ref(false);
const editingAttention = ref({
  attentionId: null,
  attentionName: '',
  content: '',
  releaseTime: ''
});

// 获取所有通告
const fetchAttentions = async () => {
  try {
    console.log('正在获取通告列表...');
    const data = await getAllAttention();
    console.log('获取到的通告数据:', data);
    
    if (!data || data.length === 0) {
      ElMessage.info('暂无通告信息');
      attentions.value = [];
      return;
    }

    attentions.value = Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('获取通告列表失败:', error);
    ElMessage.error('获取通告列表失败');
    attentions.value = [];
  }
};

// 显示创建对话框
const showCreateDialog = () => {
  newAttention.value = {
    attentionName: '',
    content: '',
    releaseTime: new Date().toISOString()
  };
  createDialogVisible.value = true;
};

// 创建通告
const handleCreate = async () => {
  if (!newAttention.value.attentionName || !newAttention.value.content) {
    ElMessage.warning('请填写完整的通告信息');
    return;
  }

  try {
    await createAttention(newAttention.value);
    ElMessage.success('创建通告成功');
    createDialogVisible.value = false;
    await fetchAttentions();
  } catch (error) {
    console.error('创建通告失败:', error);
    ElMessage.error('创建通告失败');
  }
};

// 删除通告
const handleDelete = async (attentionId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await deleteAttention(attentionId);
    ElMessage.success('删除通告成功');
    await fetchAttentions();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除通告失败:', error);
      ElMessage.error('删除通告失败');
    }
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 编辑通告
const handleEdit = (attention) => {
  editingAttention.value = {
    attentionId: attention.attentionId,
    attentionName: attention.attentionName,
    content: attention.content,
    releaseTime: attention.releaseTime
  };
  editDialogVisible.value = true;
};

// 更新通告
const handleUpdate = async () => {
  if (!editingAttention.value.attentionName || !editingAttention.value.content) {
    ElMessage.warning('请填写完整的通告信息');
    return;
  }

  try {
    await updateAttention(editingAttention.value.attentionId, {
      attentionName: editingAttention.value.attentionName,
      content: editingAttention.value.content,
      releaseTime: new Date().toISOString()
    });
    
    ElMessage.success('更新通告成功');
    editDialogVisible.value = false;
    await fetchAttentions();
  } catch (error) {
    console.error('更新通告失败:', error);
    ElMessage.error('更新通告失败');
  }
};

onMounted(() => {
  console.log('AttentionManagement 组件已挂载');
  fetchAttentions();
});
</script>

<style scoped>
.attention-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.attention-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.attention-card {
  transition: all 0.3s;
}

.attention-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.content {
  color: #606266;
}

.meta {
  margin-top: 15px;
  color: #909399;
  font-size: 14px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style> 