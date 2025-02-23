<template>
  <van-nav-bar title="车联网数据聚合平台" />
  <van-tabbar route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/mission" icon="records-o">任务</van-tabbar-item>
      <van-tabbar-item to="/personal" icon="contact-o">个人</van-tabbar-item>
  </van-tabbar>

  <div :style="amapStyle">
    <el-amap />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const amapStyle = ref({
  width: `${document.documentElement.clientWidth}px`,
  height: `${document.documentElement.clientWidth / 4 * 3}px`,
})
</script>

<style scoped></style>