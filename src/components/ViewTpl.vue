<!-- 含有底部导航栏的页面公共部分 -->
<template>
  <!-- 导航栏 -->
  <slot name="title">
    <van-nav-bar :title="props.title" :left-arrow="props.hasBack" @click-left="routeBack" fixed placeholder
                 safe-area-inset-top/>
  </slot>
  <div :class="props.hasTabbar ? 'content-container' : 'content-container__only-nav-bar'">
    <slot></slot>
  </div>
  <!-- 标签栏 -->
  <van-tabbar v-if="props.hasTabbar" route fixed placeholder safe-area-inset-bottom>
    <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/mission" icon="records-o">任务</van-tabbar-item>
    <van-tabbar-item to="/personal" icon="contact-o">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const props = defineProps({
  title: String,
  hasTabbar: Boolean,
  hasBack: Boolean
});

const router = useRouter();
const routeBack = () => {
  !props.hasBack || router.back();
};
</script>

<style scoped>
.content-container {
  background-color: #F7F8FA;
  min-height: calc(100vh - 96px);
}

.content-container__only-nav-bar {
  background-color: #F7F8FA;
  min-height: calc(100vh - 46px);
}
</style>