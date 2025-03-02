<template>
  <ViewTpl title="个人中心" :has-back="true">
    <van-divider/>
    <div style="margin: 16px">
      <van-button type="danger" block @click="logout">退出登录</van-button>
    </div>
  </ViewTpl>
</template>
<script setup lang="ts">
import ViewTpl from "@/components/ViewTpl.vue";
import {useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const userStore = useUserStore()();

const logout = () => {
  userStore.logout();
  router.push({
    path: "/auth",
  });
};

</script>