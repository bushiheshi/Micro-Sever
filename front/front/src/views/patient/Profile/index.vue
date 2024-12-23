<template>
  <div class="profile-container">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <h3>个人信息</h3>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">
            编辑信息
          </el-button>
          <div v-else>
            <el-button type="success" @click="handleSave">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </div>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="profileForm"
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="profileForm.name" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email" />
        </el-form-item>

        <el-form-item label="身份证号" prop="IDCardWord">
          <el-input v-model="profileForm.IDCardWord" disabled />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-input :model-value="formatBirthday" disabled />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getPatientInfo, updatePatientInfo } from '@/api/patientAPI';

const isEditing = ref(false);
const formRef = ref(null);
const originalProfile = ref(null);

const profileForm = ref({
  patientId: '',
  name: '',
  email: '',
  password: '',
  IDCardWord: '',
  gender: 0
});

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
};

const formatBirthday = computed(() => {
  if (!profileForm.value.IDCardWord) return '';
  const idCard = profileForm.value.IDCardWord;
  return `${idCard.substring(6, 10)}-${idCard.substring(10, 12)}-${idCard.substring(12, 14)}`;
});

onMounted(async () => {
  const patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
  if (patientInfo?.patientId) {
    try {
      const info = await getPatientInfo(patientInfo.patientId);
      originalProfile.value = { ...info };
      profileForm.value = { ...info };
    } catch (error) {
      console.error('获取患者信息失败:', error);
      ElMessage.error('获取个人信息失败');
    }
  }
});

const handleEdit = () => {
  isEditing.value = true;
};

const handleCancel = () => {
  profileForm.value = { ...originalProfile.value };
  isEditing.value = false;
};

const handleSave = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 输出更新前的信息
        console.log('准备更新的患者信息:', {
          ID: profileForm.value.patientId,
          姓名: profileForm.value.name,
          邮箱: profileForm.value.email,
          身份证: profileForm.value.IDCardWord,
          性别: profileForm.value.gender === 1 ? '男' : '女'
        });

        await updatePatientInfo(profileForm.value.patientId, profileForm.value);
        
        ElMessage.success('保存成功');
        localStorage.setItem('patientInfo', JSON.stringify(profileForm.value));
        originalProfile.value = { ...profileForm.value };
        isEditing.value = false;

        // 输出更新后的信息
        console.log('更新后的患者信息:', {
          ID: profileForm.value.patientId,
          姓名: profileForm.value.name,
          邮箱: profileForm.value.email,
          身份证: profileForm.value.IDCardWord,
          性别: profileForm.value.gender === 1 ? '男' : '女'
        });
      } catch (error) {
        console.error('更新失败:', error);
        ElMessage.error('保存失败，请稍后重试');
      }
    }
  });
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa;
}
</style> 