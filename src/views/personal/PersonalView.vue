<template>
  <IndexTpl title="个人中心">
    <van-cell-group class="user-info">
      <van-cell :border="false" :title="`杨桥西路大南瓜`" :label="`车联号：Pumpkin`" center is-link>
        <template #icon>
          <van-image style="margin: 10px" width="60" height="60" :src="avatar" class="user-avatar"/>
        </template>
      </van-cell>
    </van-cell-group>

    <van-divider/>
    <van-cell title="密钥" is-link size="large" to="/personal/secret"/>
    <van-cell title="设置" is-link size="large"/>
  </IndexTpl>
</template>
<script setup lang="ts">
import {ref} from "vue"
import IndexTpl from "@/components/IndexTpl.vue";

const avatar = ref<string>("/user-avatar-mission-owner.png")

</script>