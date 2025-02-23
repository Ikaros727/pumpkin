<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const appStyle = ref({
  position: "absolute",
  left: "0",
  right: "0",
  top: "0",
  bottom: "50px",
})
</script>

<style>
#app {
  margin: 0px;
  padding: 0px;
  --van-nav-bar-background: var(--van-blue);
  --van-nav-bar-icon-color: var(--van-white);
  --van-nav-bar-text-color: var(--van-white);
  --van-nav-bar-title-text-color: var(--van-white);
}
</style>
