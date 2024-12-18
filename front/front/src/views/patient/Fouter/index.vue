<script setup lang="ts">
import {ref} from "vue";

defineOptions({
  name: 'FooTer'
})
const items = ["全部", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "S", "T", "W", "X", "Y", "Z"];
const activeIndex = ref(0);
const activeSet = ref(0);
// 设置点击事件，更新 activeIndex
function setActive(index:number) {
  activeIndex.value = index;
}
// 设置点击事件
const setItem = (index: number) => {
  console.log('选中的索引:', index);
  activeSet.value = index; // 更新 activeSet 的值
};
const contentList=[
    '心血管内科门诊','消化内科门诊','呼吸与危重症医学科门诊','血液内科门诊','内科门诊','内分泌内科门诊','肾病内科门诊','风湿免疫内科门诊','肝脏外科门诊','胆胰外科门诊','胃肠外科门诊',
    '甲乳外科门诊','心脏大血管外科门诊','胸外科门诊','泌尿外科门诊','骨科门诊','小儿外科门诊','神经外科门诊','整形外科门诊','围产医学科门诊','普通妇科门诊',
    '生殖医学中心','儿童保健科门诊','儿童内科门诊','肿瘤科门诊','器官移植门诊','综合医疗科/老年医学科门诊','老年医学科门诊','全科医学科门诊','感染科门诊','中西医结合科门诊','皮肤病与性病科门诊','神经内科门诊','耳鼻咽喉头颈外科门诊',
    '眼科门诊','眼屈光治疗中心','口腔科门诊','临床营养科','甲乳外科门诊','心脏大血管外科门诊','胸外科门诊','泌尿外科门诊','骨科门诊','小儿外科门诊',
]
</script>

<template>
<div class="container">
 <div class="header">
   <ul>
     <li
         v-for="(item, index) in items"
         :key="index"
         :class="{ active: activeIndex === index }"
         @click="setActive(index)"
     >
       {{ item }}
     </li>
   </ul>
 </div>
 <div class="footer">
   <ul>
     <li
         v-for="(item, index) in contentList"
         :key="index"
         :class="{ activeItem: activeSet === index }"
         @click="setItem(index)"
     >
       {{ item }}
     </li>
   </ul>
 </div>
</div>
</template>

<style scoped>
.container{
  padding:20px 80px;
}
.container .header ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}
.container .header ul li{
  margin:0 20px;
  cursor: pointer;
}
.active{
  color:#4b9a7b;
  font-size: 18px;
  font-weight: 400;
}
.container .footer ul {
  list-style: none;
  padding: 0;
  margin: 30px 0;
  display: flex;
  flex-wrap: wrap;

}
.container .footer ul li{
  margin: 5px 10px;
  background-color: #f5f5f5;
  display: block;
  line-height: 42px;
  color: #333;
  padding: 0 15px;
  border-radius: 4px;
  cursor: pointer;
}
/* 激活项的样式 */
.activeItem {
  background-color: #4b9a7b;
  color: #fff;
}
</style>