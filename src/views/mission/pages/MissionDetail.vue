<template>
  <PageTpl title="任务详情">
    <MissionCard title="基本信息" :mission="mission"/>
    <template v-for="(area) in mission.AreaList">
      <van-cell-group inset>
        <template #title>
          {{ area }} - <span style="color: black">上传车辆数量：{{ groupedDataMap[area]?.length ?? 0 }}</span>
        </template>
        <van-cell-group v-if="groupedDataMap[area] !== undefined" inset>
          <VanCellExpand v-for="itemType in mission.DataTypeList" :title="itemType"
                         :value="sumByDataType(groupedDataMap[area], itemType)"/>
          <van-button block size="small" type="primary" style="margin-bottom: 10px">
            <span style="font-size: 16px">开始解密</span>
          </van-button>
        </van-cell-group>
        <van-cell-group v-else>
          <van-cell title="暂未有车辆上传数据"/>
        </van-cell-group>
      </van-cell-group>
    </template>
  </PageTpl>
</template>

<script setup lang="ts">
import {ref, onMounted, inject} from "vue";
import {useRouter, useRoute} from "vue-router";
import PageTpl from "@/components/PageTpl.vue";
import {Mission} from "@/dao/model/Mission.ts";
import MissionCard from "@/components/MissionCard.vue";
import {MissionCarData} from "@/dao/model/MissionCarData.ts";
import {MissionCarDataModel} from "@/dao/MissionCarData.ts";
import VanCellExpand from "@/components/VanCellExpand.vue";

const router = useRouter();
const mission = ref<Mission>(new Mission());
const missionCarDataList = ref<MissionCarData[]>([]);
const groupedDataMap = ref<Map<string, MissionCarData[]>>(new Map<string, MissionCarData[]>());

let missionCarDataModel: MissionCarDataModel = null;

onMounted(() => {
  const route = useRoute();
  mission.value = new Mission(JSON.parse(route.query.mission));
  missionCarDataModel = inject("MissionCarDataModel");
  missionCarDataList.value.push(new MissionCarData({
    Id: 1,
    MissionId: mission.value.Id,
    CarId: 1,
    CarName: "比亚迪·秦",
    Area: "福建省/福州市/鼓楼区",
    DataItemList: [
      {Type: "温度", Value: 8n},
      {Type: "湿度", Value: 60n},
      {Type: "降雨量", Value: 0n},
      {Type: "噪音程度", Value: 30n}
    ]
  }));
  groupedDataMap.value = missionCarDataList.value.reduce((acc, curr) => {
    const area = curr.Area;
    if (!acc[area]) acc[area] = [];
    acc[area].push(curr);
    return acc;
  }, {} as Record<string, MissionCarData[]>);
});

const sumByDataType = (dataList: MissionCarData[], dataType: string): bigint => {
  let sum = 0n;

  for (let i = 0; i < dataList.length; i++) {
    let item = dataList[i];

    item.DataItemList.find(itemType => {
      if (itemType.Type === dataType) {
        if (sum === 0n) {
          sum = BigInt(itemType.Value);
        } else {
          sum *= BigInt(itemType.Value);
        }
        return true;
      }
    });
  }
  return sum;
};
</script>

<style scoped>
</style>