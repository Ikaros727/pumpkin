<template>
  <ViewTpl title="个人中心" :has-back="true">
    <van-divider/>
    <div style="margin: 16px">
      <van-button type="danger" block>退出登录</van-button>
    </div>
  </ViewTpl>
</template>
<script setup lang="ts">
import ViewTpl from "@/components/ViewTpl.vue";

</script>