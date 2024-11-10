<template>
    <section class="services">
      <h2>医疗服务</h2>
      <div class="service-items">
        <ServiceItem icon="fas fa-calendar-alt" title="预约挂号" />
        <ServiceItem icon="fas fa-hospital-symbol" title="门诊服务" />
        <ServiceItem icon="fas fa-bed" title="出/入院服务" />
        <ServiceItem icon="fas fa-map-marker-alt" title="交通位置" />
        <ServiceItem icon="fas fa-medkit" title="医保服务" />
      </div>
    </section>
  </template>
  
  <script>
  import ServiceItem from './ServiceItem.vue';
  
  export default {
    components: {
      ServiceItem
    }
  };
  </script>