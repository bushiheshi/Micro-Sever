<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import MyHeader from '@/views/patient/MyHeader/index.vue';
import Content from '@/views/patient/Content/index.vue';
import Footer from '@/views/patient/Fouter/index.vue';

defineOptions({
  name: 'Layout'
});

const router = useRouter();
const patientInfo = ref(null);

onMounted(() => {
  // 检查登录状态
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    ElMessage.warning('请先登录');
    router.push('/login');
    return;
  }

  // 获取患者信息
  const storedInfo = localStorage.getItem('patientInfo');
  if (storedInfo) {
    patientInfo.value = JSON.parse(storedInfo);
  }
});

// 提供患者信息给子组件
const providePatientInfo = () => {
  return patientInfo.value;
};
</script>

<template>
  <div class="container">
    <div class="myHeader">
      <MyHeader :patient-info="patientInfo"/>
    </div>
    <div class="myContent">
      <Content :patient-info="patientInfo"/>
    </div>
    <div class="myFooter">
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.myHeader {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.myContent {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

.myFooter {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
}
</style>