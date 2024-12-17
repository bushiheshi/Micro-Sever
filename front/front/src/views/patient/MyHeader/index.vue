<script setup lang="ts">
defineOptions({
  name: 'MyHeader'
})
import Img from '@/assets/logo.png'
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
   </ul>
 </div>
</div>

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
}

.headerRight li {
  margin-right: 10px;
  font-size: 18px;
  input{
    width:30%;
    padding: 8px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 50px;
    outline: none;
    background-color: #f9f9f9;
    transition: all 0.3s ease;
  }
}

</style>