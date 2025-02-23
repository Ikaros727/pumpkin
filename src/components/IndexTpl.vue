<!-- 含有底部导航栏的页面公共部分 -->
<template>
  <!-- 导航栏 -->
  <slot name="title">
    <van-nav-bar :title="props.title" fixed placeholder safe-area-inset-top/>
  </slot>
  <div class="content-container">
    <slot></slot>
  </div>
  <!-- 标签栏 -->
  <van-tabbar route fixed placeholder safe-area-inset-bottom>
    <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/mission" icon="records-o">任务</van-tabbar-item>
    <van-tabbar-item to="/personal" icon="contact-o">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
})
</script>

<style scoped>
.content-container {
  background-color: #F7F8FA;
  min-height: calc(100vh - 50 - 50);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  position: absolute;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 0;
}
</style>