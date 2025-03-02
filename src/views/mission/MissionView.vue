<template>
  <ViewTpl title="任务中心" :has-tabbar="true">
    <!-- 新建任务按钮 -->
    <div class="create-btn">
      <van-button
          round
          type="primary"
          icon="plus"
          @click="openMissionCreatePage"
      >新建任务
      </van-button>
    </div>
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了">
      <template v-for="(mission, index) in missions">
        <MissionCard :title="`NO.${ index + 1 }`" :mission="mission"/>
        <van-cell>
          <van-button type="primary" plain @click="openMissionDetailPage(mission)">详情</van-button>&ensp;
          <van-button type="danger" plain @click="deleteMission(mission.Id)">删除</van-button>
        </van-cell>
      </template>
    </van-list>
    <van-back-top right="10px" bottom="50px"/>
  </ViewTpl>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showConfirmDialog, showDialog} from "vant";
import ViewTpl from "@/components/ViewTpl.vue";
import type {MissionModel} from "@/dao/Mission.ts";
import {Mission} from "@/dao/model/Mission.ts";
import MissionCard from "@/components/MissionCard.vue";

const router = useRouter();
const missions = ref<Mission[]>([]);
const loading = ref<boolean>(true);
const finished = ref<boolean>(false);

let missionModel: MissionModel = null;

onMounted(() => {
  missionModel = inject("MissionModel");
  loadMissions()
});

const loadMissions = () => {
  finished.value = false;
  loading.value = true;
  missionModel.Query({UserId: 1})
      .then(result => {
        missions.value = result;
      })
      .catch(e => {
        showDialog({title: "提示", message: "查询任务列表失败：" + e.message});
      }).finally(() => {
    finished.value = true;
    loading.value = false;
  });
};

const deleteMission = (missionId: number) => {
  showConfirmDialog({
    title: "风险操作",
    message: "正在删除任务，是否删除？"
  }).then(() => {
    missionModel.Delete(missionId)
        .then(loadMissions)
        .catch(e => {
          showDialog({title: "提示", message: "删除任务失败：" + e.message});
        });
  }).catch(e => {
    console.log(e);
  });

};

const openMissionDetailPage = (m: Mission) => {
  router.push({path: "/mission/detail", query: {mission: JSON.stringify(m)}});
};

const openMissionCreatePage = () => {
  router.push({
    path: "/mission/create"
  });
};
</script>

<style scoped>
.create-btn {
  padding: 15px;
  text-align: center;
}
</style>