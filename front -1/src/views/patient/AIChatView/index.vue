<script setup lang="ts">
import { ref } from 'vue'

const chatHistory = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const inputMessage = ref('')
const loading = ref(false)

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return
  
  chatHistory.value.push({
    role: 'user',
    content: inputMessage.value
  })
  
  loading.value = true
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'sk-b952c31445174e95bc3dbb6ff1ef3995'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          prompt: inputMessage.value
        },
        parameters: {
          top_p: 0.8,
          top_k: 50,
          temperature: 0.7
        }
      })
    })
    
    const data = await response.json()
    console.log('API响应:', data)
    
    if (data.output && data.output.text) {
      chatHistory.value.push({
        role: 'assistant',
        content: data.output.text
      })
    } else if (data.message) {
      throw new Error(data.message)
    } else {
      throw new Error('未知的API响应格式')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    chatHistory.value.push({
      role: 'assistant',
      content: `抱歉，发生错误：${error.message || '请稍后再试'}`
    })
  } finally {
    loading.value = false
    inputMessage.value = ''
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>AI智能助手</h3>
    </div>
    <div class="chat-history">
      <div v-for="(msg, index) in chatHistory" 
           :key="index" 
           :class="['message', msg.role]">
        <p>{{ msg.content }}</p>
      </div>
    </div>
    
    <div class="input-area">
      <input 
        v-model="inputMessage"
        @keyup.enter="sendMessage"
        placeholder="请输入您的问题..."
        :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-left: 48px; /* 为折叠按钮留出空间 */
}

.chat-header {
  padding: 12px 16px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  text-align: center;
  flex-shrink: 0;
}

.chat-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 10px 12px;
  border-radius: 8px;
  max-width: 85%;
  font-size: 13px;
  line-height: 1.5;
  position: relative;
  word-break: break-word;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message p {
  margin: 0;
}

.user {
  background-color: #e8f5e9;
  margin-left: auto;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.assistant {
  background-color: #f5f5f5;
  margin-right: auto;
  color: #424242;
  border: 1px solid #eeeeee;
}

.input-area {
  padding: 12px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

input:focus {
  border-color: #4caf50;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

input::placeholder {
  color: #9e9e9e;
  font-size: 12px;
}

button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

button:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049, #388e3c);
}

button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  color: #9e9e9e;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9e9e9e;
}
</style> 