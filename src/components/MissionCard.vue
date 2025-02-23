<template>
  <van-cell-group inset :title="props.title">
    <van-cell title="任务名称" :value="props.mission.Name"/>
    <van-cell title="任务时间" :value="`${props.mission.TimeRangeString()}(${props.mission.StatusCN()})`"/>
    <VanCellExpand title="任务区域" :value="props.mission.AreaListString()" style="white-space: pre-line;"/>
    <VanCellExpand title="数据类型" :value="props.mission.DataTypeListString()"/>
    <van-cell title="奖励金额" :value="`${props.mission.Reward} 代币`"/>
    <van-cell title="是否加密" :value="`${props.mission.IsEncrypted?'是':'否'}`"/>
  </van-cell-group>
</template>

<script setup lang="ts">
import {Mission} from "@/dao/model/Mission.ts";
import VanCellExpand from "@/components/VanCellExpand.vue";

const props = defineProps({
  title: String,
  mission: Mission
});
</script>

<style scoped>
:deep(.van-cell__title) {
  max-width: 70px;
}

/* 长文本显示优化 */
:deep(.van-cell__value) {
  word-break: break-all;
  font-family: monospace;
  color: #666;
  max-width: 90%;
  text-align: right;
}
</style>