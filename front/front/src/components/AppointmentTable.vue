<template>
  <div class="appointment-table">
    <el-empty
      v-if="!appointments || appointments.length === 0"
      :description="emptyText"
    />
    <div v-else>
      <el-table
        :data="appointments"
        border
        stripe
        @row-click="handleRowClick"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="appointmentId" label="预约编号" width="120" />
        <el-table-column prop="doctorName" label="医生姓名" width="120">
          <template #default="scope">
            {{ scope.row.doctorName || '未知医生' }}
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="科室" width="120">
          <template #default="scope">
            {{ scope.row.departmentName || '未知科室' }}
          </template>
        </el-table-column>
        <el-table-column label="预约时间" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.appointmentDate, scope.row.appointmentTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
            >
              {{ translateStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="showDetails(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预约详情"
      width="60%"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预约编号">{{ currentAppointment.appointmentId }}</el-descriptions-item>
        <el-descriptions-item label="预约状态">
          <el-tag :type="getStatusType(currentAppointment.status)">
            {{ translateStatus(currentAppointment.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="医生姓名">{{ currentAppointment.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentAppointment.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ currentAppointment.appointmentDate }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{ currentAppointment.appointmentTime }}</el-descriptions-item>
        <el-descriptions-item label="就诊类型">{{ currentAppointment.visitType || '普通门诊' }}</el-descriptions-item>
        <el-descriptions-item label="挂号费用">{{ currentAppointment.fee || '50元' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ currentAppointment.note || '无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, watchEffect } from 'vue';

const props = defineProps({
  appointments: {
    type: Array,
    required: true,
    default: () => []
  },
  type: {
    type: String,
    default: 'unfinished'
  }
});

const dialogVisible = ref(false);
const currentAppointment = ref({});

watchEffect(() => {
  console.log(`${props.type} appointments changed:`, props.appointments);
});

const emptyText = computed(() => {
  const textMap = {
    unfinished: '暂无未完成预约',
    finished: '暂无已完成预约',
    expired: '暂无过期预约'
  };
  return textMap[props.type] || '暂无预约记录';
});

const formatDateTime = (date: string, time: string) => {
  if (!date) return '未知时间';
  return `${date} ${time || ''}`.trim();
};

const translateStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PENDING: '待诊',
    COMPLETED: '已诊',
    CANCELLED: '已取消',
    EXPIRED: '已过期',
    WAITING: '待诊',
    IN_PROGRESS: '就诊中',
    FINISHED: '已完成'
  };
  return statusMap[status] || status;
};

const getStatusType = (status: string) => {
  const typeMap: { [key: string]: string } = {
    PENDING: 'warning',
    COMPLETED: 'success',
    CANCELLED: 'info',
    EXPIRED: 'danger',
    WAITING: 'warning',
    IN_PROGRESS: 'primary',
    FINISHED: 'success'
  };
  return typeMap[status] || 'info';
};

const handleRowClick = (row: any) => {
  console.log('Row clicked:', row);
  showDetails(row);
};

const showDetails = (appointment: any) => {
  console.log('Showing details for appointment:', appointment);
  currentAppointment.value = appointment;
  dialogVisible.value = true;
};
</script>

<style scoped>
.appointment-table {
  min-height: 200px;
}

:deep(.el-descriptions) {
  margin: 20px 0;
}

:deep(.el-descriptions__cell) {
  padding: 12px 20px;
}

:deep(.el-table) {
  margin-top: 10px;
}
</style> 