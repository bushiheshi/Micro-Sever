<script setup lang="ts">
defineOptions({
  name: 'Layout'
})
import MyHeader from '@/views/patient/MyHeader/index.vue'
import Content from '@/views/patient/Content/index.vue'
import Footer from '@/views/patient/Fouter/index.vue'
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