<template>
  <van-cell-group inset :title="props.title" class="mission-card">
    <van-cell title="任务名称" :value="props.mission.Name"/>
    <van-cell title="任务时间" :value="`${props.mission.TimeRangeString()}(${props.mission.StatusCN()})`"/>
    <VanCellExpand title="任务区域" :value="props.mission.AreaListString()" style="white-space: pre-line;"/>
    <VanCellExpand title="数据类型" :value="props.mission.DataTypeListString()"/>
    <van-cell title="奖励金额" :value="`${props.mission.Reward} 代币`"/>
    <van-cell title="是否加密" :value="`${props.mission.IsEncrypted?'是':'否'}`"/>
    <slot name="action-button"></slot>
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
.mission-card {
  position: relative;
  margin: 12px 16px;
  padding-bottom: 8px;
}

.van-cell-group {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin: 12px 16px; /* 新增左右边距 */
}

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