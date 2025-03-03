<template>
  <ViewTpl title="任务中心" :has-tabbar="true">
    <van-tabs v-model:active="activeTab" swipeable>
      <van-tab v-for="t of tabs" :title="t.title">
        <MissionList :type="t.type" :missions="t.missions" :loading="loading" :finished="finished"
                     @detail="openMissionDetailPage" @delete="deleteMission"/>
      </van-tab>
    </van-tabs>
    <!-- 新建任务按钮 -->
    <div class="floating-btn" v-if="activeTab === 2">
      <van-button
          round
          type="primary"
          icon="plus"
          class="circle-btn"
          @click="openMissionCreatePage"
      >
      </van-button>
    </div>
  </ViewTpl>
</template>

<script setup lang="ts">
import {inject, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {showConfirmDialog, showDialog} from "vant";
import ViewTpl from "@/components/ViewTpl.vue";
import type {MissionModel} from "@/dao/Mission.ts";
import {Mission} from "@/dao/model/Mission.ts";
import MissionList from "@/components/MissionList.vue";

const router = useRouter();
const loading = ref<boolean>(true);
const finished = ref<boolean>(false);
const availableMissions = ref<Mission[]>([]);
const claimedMissions = ref<Mission[]>([]);
const publishedMissions = ref<Mission[]>([]);
const activeTab = ref(0);
const tabs = ref([
  {title: "任务列表", type: "available", missions: availableMissions},
  {title: "我领取的", type: "claimed", missions: claimedMissions},
  {title: "我发布的", type: "published", missions: publishedMissions}
]);


let missionModel: MissionModel = null;

onMounted(() => {
  missionModel = inject("MissionModel");
  loadMissions();
});

// 监听选项卡变化
watch(activeTab, (newVal) => {
  switch (newVal) {
    case 0:
      loadAvailableMissions();
      break;
    case 1:
      loadClaimedMissions();
      break;
    case 2:
      loadPublishedMissions();
      break;
  }
});

// 三种不同的加载方法
const loadAvailableMissions = () => {
  // missionModel.QueryAvailable()
  //     .then(result => availableMissions.value = result)
  //     .catch(handleError);
};

const loadClaimedMissions = () => {
  // missionModel.QueryClaimed()
  //     .then(result => claimedMissions.value = result)
  //     .catch(handleError);
};

const loadPublishedMissions = () => {
  // missionModel.QueryPublished()
  //     .then(result => publishedMissions.value = result)
  //     .catch(handleError);
};

// 通用错误处理
const handleError = (e) => {
  showDialog({title: "提示", message: "操作失败：" + e.message});
};

const loadMissions = () => {
  finished.value = false;
  loading.value = true;
  missionModel.Query({UserId: 1})
      .then(result => {
        publishedMissions.value = result;
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
.floating-btn {
  position: fixed;
  right: 16px;
  bottom: 80px; /* 根据实际tabbar高度调整 */
  z-index: 999;
}

.circle-btn {
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 调整图标大小 */
:deep(.van-icon-plus) {
  font-size: 24px;
}
</style>