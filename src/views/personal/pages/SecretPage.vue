<template>
  <PageTpl title="Paillier 密钥">
    <template v-if="myPaillier === null" style="padding: 10px;">
      <van-button :loading="loading" size="large" type="success" @click="generateKeyPair">创建密钥</van-button>
    </template>
    <template v-else>
      <van-divider class="divider-title" content-position="left" style="margin: 0 0 16px 0;">公钥 /
        Public Key
      </van-divider>
      <van-cell-group inset>
        <VanCellExpand title="N" :value="myPaillier?.publicKey.n" />
        <VanCellExpand title="g" :value="myPaillier?.publicKey.g" />
      </van-cell-group>

      <van-divider class="divider-title" content-position="left">私钥 / Private Key</van-divider>
      <van-cell-group inset>
        <VanCellExpand title="λ" :value="myPaillier?.privateKey.lambda" />
        <VanCellExpand title="μ" :value="myPaillier?.privateKey.mu" />
      </van-cell-group>

      <van-divider style="margin: 16px 0 0 0; padding: 0 0 16px 0;"/>
    </template>
  </PageTpl>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import {showToast} from 'vant';
import PageTpl from "@/components/PageTpl.vue";
import * as paillier from "paillier-bigint";
import type {UserPaillierSecretModel} from "@/dao/UserPaillierSecret.ts";
import {UserPaillierSecret} from "@/dao/model/UserPaillierSecret.ts";
import VanCellExpand from "@/components/VanCellExpand.vue";

const loading = ref(true);
const myPaillier = ref<paillier.KeyPair | null>(null)

let userPaillierSecret: UserPaillierSecretModel = null

onMounted(() => {
  userPaillierSecret = inject("UserPaillierSecretModel")
  userPaillierSecret.Get(0)
      .then(res => {
        if (res !== null) {
          myPaillier.value = res.KeyPair()
        } else {
          showToast({message: '用户尚未创建密钥'});
        }
        loading.value = false
      })
      .catch(e => {
        showToast({message: '获取用户密钥失败：' + e.message});
      })
})

function generateKeyPair() {
  loading.value = true
  paillier.generateRandomKeys(1024).then(keyPair => {
    let secret = new UserPaillierSecret(keyPair)
    userPaillierSecret.Create(secret)
        .then(res => {
          myPaillier.value = res.KeyPair()
        })
        .catch(e => {
          showToast({message: '保存密钥失败：' + e});
        })
        .finally(() => {
          loading.value = false
        })
  }).catch(e => {
    showToast({message: '创建密钥失败：' + e.message});
  })
}
</script>

<style scoped>
:deep(.van-cell__title) {
  max-width: 30px;
}

/* 长文本显示优化 */
:deep(.van-cell__value) {
  word-break: break-all;
  font-family: monospace;
  color: #666;
  max-width: 90%;
  text-align: right;
}

.divider-title {
  color: #1989fa;
  borderColor: #1989fa;
  padding: 0 16px;
}


.text-content {
  display: -webkit-box;
  -webkit-line-clamp: var(--line-clamp, 3);
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expanded .text-content {
  -webkit-line-clamp: unset;
}

.toggle-btn {
  color: #1989fa;
  text-align: right;
  margin-top: 8px;
  cursor: pointer;
}
</style>