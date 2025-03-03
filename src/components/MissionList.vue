<template>
  <van-list v-model:loading="props.loading" :finished="props.finished" finished-text="没有更多了">
    <template v-for="(mission) in props.missions" :key="mission.Id">
      <MissionCard :mission="mission">
        <template #action-button>
          <div class="action-buttons">
            <template v-if="props.type === 'published'">
              <van-button type="danger" size="small" @click="$emit('delete', mission.Id)">删除</van-button>
            </template>

            <template v-if="props.type === 'available'">
              <van-button type="success" size="small" @click="$emit('claim', mission.Id)">接取</van-button>
            </template>

            <template v-if="props.type === 'claimed'">
              <van-button type="warning" size="small" @click="$emit('abandon', mission.Id)">放弃</van-button>
            </template>

            <van-button type="primary" size="small" @click="$emit('detail', mission)">详情</van-button>
          </div>
        </template>
      </MissionCard>
    </template>
  </van-list>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from "vue";
import MissionCard from "./MissionCard.vue";
import type {Mission} from "@/dao/model/Mission.ts";

const props = defineProps({
  missions: {
    type: Array as () => Mission[],
    required: true
  },
  type: {
    type: String as () => "available" | "claimed" | "published",
    required: true
  },
  loading: Boolean,
  finished: Boolean
});

const emit = defineEmits(["claim", "abandon", "delete", "detail"]);
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding: 12px 16px 0;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
}

/* 列表容器优化 */
.van-list {
  padding: 8px 0;
  background: transparent;
}

/* 按钮颜色方案 */
.van-button--primary {
  --van-button-primary-background: rgba(25, 137, 250, 0.12);
  --van-button-primary-color: #1989fa;
}

.van-button--primary:hover {
  background: rgba(25, 137, 250, 0.2);
}

.van-button--success {
  --van-button-success-background: rgba(7, 193, 96, 0.12);
  --van-button-success-color: #07C160;
}

.van-button--success:hover {
  background: rgba(7, 193, 96, 0.2);
}

.van-button--warning {
  --van-button-warning-background: rgba(255, 151, 106, 0.12);
  --van-button-warning-color: #FF976A;
}

.van-button--warning:hover {
  background: rgba(255, 151, 106, 0.2);
}

.van-button--danger {
  --van-button-danger-background: rgba(237, 10, 36, 0.12);
  --van-button-danger-color: #ED0A24;
}

.van-button--danger:hover {
  background: rgba(237, 10, 36, 0.2);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .van-cell {
    margin: 0 12px 8px;
  }

  .van-button {
    font-size: 12px;
    padding: 3px 10px;
  }
}

/* 加载提示样式 */
.van-list__finished-text {
  color: #999;
  padding: 16px;
  text-align: center;
  font-size: 14px;
}

/* 操作按钮容器 */
.action-buttons {
  position: absolute;
  bottom: 12px;
  right: 16px;
  display: flex;
  gap: 8px;
  background: linear-gradient(to left, white 60%, rgba(255, 255, 255, 0.8));
  padding-left: 20px;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .action-buttons {
    right: 12px;
    gap: 6px;
  }

  .van-button {
    min-width: 52px;
    padding: 0 10px;
    font-size: 12px;
  }
}
</style>