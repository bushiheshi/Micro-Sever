<script setup lang="ts">
defineOptions({
  name: 'Layout'
})
import { ref } from 'vue'
import MyHeader from '@/views/patient/MyHeader/index.vue'
import Content from '@/views/patient/Content/index.vue'
import Footer from '@/views/patient/Fouter/index.vue'
import AIChatView from '@/views/patient/AIChatView/index.vue'

const isAISidebarExpanded = ref(false)
</script>

<template>
  <div class="container">
    <div class="main-content">
      <div class="myHeader">
        <MyHeader/>
      </div>
      <div class="myContent">
        <Content/>
      </div>
      <div class="myFooter">
        <Footer/>
      </div>
    </div>
    <div class="ai-sidebar-wrapper" :class="{ expanded: isAISidebarExpanded }">
      <div class="toggle-button" @click="isAISidebarExpanded = !isAISidebarExpanded">
        {{ isAISidebarExpanded ? '›' : '‹' }}
      </div>
      <AIChatView v-show="isAISidebarExpanded"/>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 48px;
  transition: margin-right 0.3s;
  gap: 0;
}

.myHeader {
  flex-shrink: 0;
}

.myContent {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.myFooter {
  flex-shrink: 0;
  margin-top: auto;
}

.ai-sidebar-wrapper {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background: #fff;
  transition: width 0.3s;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.ai-sidebar-wrapper.expanded {
  width: 320px;
}

.toggle-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  border-radius: 4px 0 0 4px;
  transition: all 0.3s;
  z-index: 101;
}

.toggle-button:hover {
  background: linear-gradient(135deg, #45a049, #388e3c);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .main-content {
    margin-right: 0;
  }
  
  .ai-sidebar-wrapper {
    display: none;
  }
}
</style>