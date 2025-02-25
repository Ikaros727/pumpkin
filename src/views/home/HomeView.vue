<template>
  <ViewTpl title="首页" :has-tabbar="true">
    <div :style="amapStyle">
      <el-amap />
    </div>
  </ViewTpl>
</template>

<script setup>
import { ref } from 'vue'
import ViewTpl from "@/components/ViewTpl.vue";
const amapStyle = ref({
  width: `${document.documentElement.clientWidth}px`,
  height: `${document.documentElement.clientWidth / 4 * 3}px`,
})
</script>

<style scoped></style>