<script setup lang="ts">
import item1 from '@/assets/item1.png'
import item2 from '@/assets/item2.png'
import item3 from '@/assets/item3.png'
import item4 from '@/assets/item4.png'

defineOptions({
  name: 'ConTent'
})
const itemlist = [
  item1, item2, item3,item4
]
</script>

<template>
 <div class="container">
   <div class="block text-center" m="t-4">
     <el-carousel trigger="click" height="300px">
       <el-carousel-item v-for="item in itemlist" :key="item">
         <img width="100%" height="120%" :src="item" alt="">
       </el-carousel-item>
     </el-carousel>
   </div>
 </div>
</template>

<style scoped>
.container{
  padding: 0 5px;
}
</style>