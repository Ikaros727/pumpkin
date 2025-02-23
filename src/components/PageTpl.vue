<template>
    <!-- 导航栏 -->
    <slot name="title">
        <van-nav-bar :title="props.title" left-arrow left-text="返回" @click-left="routeBack" fixed placeholder safe-area-inset-top/>
    </slot>
  <div class="content-container">
    <slot>
      <van-empty description=""/>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
    title: String,
})
const router = useRouter()

const routeBack = () => {
    router.back()
}
</script>

<style scoped>
.content-container {
  background-color: #F7F8FA;
  min-height: calc(100vh - 62px);
  padding-top: 16px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>