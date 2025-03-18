<template>
  <ViewTpl title="任务详情" :has-back="true">
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
  </ViewTpl>
</template>

<script setup lang="ts">
import {ref, onMounted, inject} from "vue";
import {useRouter, useRoute} from "vue-router";
import {Mission} from "@/dao/model/Mission.js";
import MissionCard from "@/components/MissionCard.vue";
import {MissionCarData} from "@/dao/model/MissionCarData.js";
import {MissionCarDataModel} from "@/dao/MissionCarData.js";
import VanCellExpand from "@/components/VanCellExpand.vue";
import ViewTpl from "@/components/ViewTpl.vue";
import * as paillier from "paillier-bigint";
import {showToast} from "vant";

const router = useRouter();
const mission = ref<Mission>(new Mission());
const missionCarDataList = ref<MissionCarData[]>([]);
const groupedDataMap = ref<Map<string, MissionCarData[]>>(new Map<string, MissionCarData[]>());
let paillierKey: paillier.KeyPair | null = null;

let missionCarDataModel: MissionCarDataModel = null;

onMounted(() => {
  const route = useRoute();
  mission.value = new Mission(JSON.parse(route.query.mission));
  missionCarDataModel = inject("MissionCarDataModel");
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/东城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/东城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/西城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/西城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/西城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));
  missionCarDataList.value.push(new MissionCarData({
    Area: "北京市/北京市/西城区",
    DataItemList: [
      {Type: "温度℃", Value: 8n},
      {Type: "湿度%", Value: 60n},
      {Type: "雨量mm", Value: 0n},
      {Type: "噪音db", Value: 30n}
    ]
  }));

  groupedDataMap.value = missionCarDataList.value.reduce((acc, curr) => {
    console.log(acc);
    const area = curr.Area;
    if (!acc[area]) acc[area] = [];
    acc[area].push(curr);
    console.log("[missionCarDataList.value.reduce] area:", area, "acc[area]:", acc[area]);
    return acc;
  }, {} as Record<string, MissionCarData[]>);
  console.log(groupedDataMap.value);

  paillier.generateRandomKeys(1024).then(keyPair => {
    paillierKey = keyPair;
    missionCarDataList.value.forEach(data => {
      data.DataItemList.forEach(item => {
        item.Value = paillierKey?.publicKey.encrypt(item.Value);
      });
    });
  }).catch(e => {
    showToast({message: "创建密钥失败：" + e.message});
  });
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

:deep(.van-cell) {
  align-items: flex-start;
  padding: 14px 16px;
  margin: 0 8px; /* 单元格内容左右缩进 */
}

:deep(.van-cell__title) {
  flex: 0 0 88px;
  min-width: 88px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

:deep(.van-cell__value) {
  flex: 1;
  overflow-wrap: anywhere;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #444;
  line-height: 1.5;
  padding-left: 12px;
}

:deep(.van-cell__value)[title="奖励金额"] {
  color: #e55039;
  font-weight: 500;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2d3436;
}

/* 新增响应式边距 */
@media (max-width: 480px) {
  .van-cell-group {
    margin: 12px 12px; /* 小屏幕缩小边距 */
  }
}
</style>