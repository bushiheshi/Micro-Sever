<script setup lang="ts">
defineOptions({
  name: 'LayOut'
})
import MyHeader from '@/components/MyHeader/index.vue'
import Content from '@/components/Content/index.vue'
import Footer from '@/components/Footer/index.vue'
</script>

<template>
  <div class="container">
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
</template>

<style scoped>

</style>