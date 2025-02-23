<template>
  <IndexTpl title="任务中心">
    <van-row style="padding: 10px;">
      <van-button type="success" @click="openMissionCreatePage">创建任务</van-button>
    </van-row>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
      <template v-for="(mission, index) in missions">
        <van-divider content-position="left" :style="{ borderColor: '#1989fa' }">NO.{{ index + 1 }}</van-divider>
        <MissionCard :mission="mission"/>
        <van-cell>
          <van-button type="primary" plain @click="openMissionDetailPage(mission)">详情</van-button>&ensp;
          <van-button type="danger" plain @click="item.Delete(index)">删除</van-button>
        </van-cell>
      </template>
    </van-list>
    <van-back-top right="10px" bottom="50px"/>
  </IndexTpl>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showDialog} from "vant";
import IndexTpl from "@/components/IndexTpl.vue";
import type {MissionModel} from "@/dao/Mission.ts";
import {Mission} from "@/dao/model/Mission.ts";
import MissionCard from "@/components/MissionCard.vue";

const router = useRouter();
const missions = ref<Mission[]>([]);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);

let missionModel: MissionModel = null;

onMounted(() => {
  missionModel = inject("MissionModel");
  missionModel.Query({UserId: 1})
      .then(result => {
        missions.value = result;
      })
      .catch(e => {
        showDialog({title: "提示", message: "查询任务列表失败：" + e.message});
      });
  finished.value = true;
  loading.value = true;
});

const openMissionDetailPage = (m: Mission) => {
  router.push({path: "/mission/detail", query: {mission: JSON.stringify(m)}});
};

const openMissionCreatePage = () => {
  router.push({
    path: "/mission/create"
  });
};
</script>