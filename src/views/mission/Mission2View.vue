<template>
  <ViewTpl title="任务管理" :has-tabbar="true">
    <!-- 新建任务按钮 -->
    <div class="create-btn">
      <van-button
          round
          type="primary"
          icon="plus"
          @click="showCreateDialog"
      >新建任务</van-button>
    </div>

    <!-- 任务列表 -->
    <van-list>
      <van-cell-group v-for="mission in missions" :key="mission.Id">
        <van-cell :title="mission.Name" :label="missionLabel(mission)" is-link>
          <template #icon>
            <van-icon
                v-if="mission.IsEncrypted"
                name="lock"
                class="mission-lock"
                color="#1989fa"
            />
          </template>
          <template #extra>
            <span class="reward">￥{{ mission.Reward }}</span>
          </template>
        </van-cell>
        <van-divider />
      </van-cell-group>
    </van-list>

    <!-- 新建任务弹窗 -->
    <van-dialog v-model:show="showDialog" title="新建任务" show-cancel-button>
      <van-form @submit="onSubmit">
        <van-field
            v-model="newMission.Name"
            name="任务名称"
            label="任务名称"
            placeholder="请输入任务名称"
            :rules="[{ required: true }]"
        />
        <van-field
            v-model="newMission.AreaList"
            name="区域列表"
            label="区域范围"
            placeholder="请输入区域（逗号分隔）"
        />
        <van-field
            v-model="newMission.DataTypeList"
            name="数据类型"
            label="数据类型"
            placeholder="请输入数据类型（逗号分隔）"
        />
        <van-field
            v-model="timeRange"
            readonly
            name="时间范围"
            label="时间范围"
            placeholder="选择时间范围"
            @click="showTimePicker = true"
        />
        <van-field name="加密任务">
          <template #input>
            <van-switch v-model="newMission.IsEncrypted" size="20" />
          </template>
        </van-field>
        <van-field
            v-model.number="newMission.Reward"
            type="number"
            name="任务奖励"
            label="任务奖励"
            placeholder="请输入奖励金额"
        />
      </van-form>
    </van-dialog>

    <!-- 时间选择器 -->
    <van-calendar
        v-model:show="showTimePicker"
        type="range"
        @confirm="onConfirmTime"
    />
  </ViewTpl>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showConfirmDialog } from 'vant'
import ViewTpl from "@/components/ViewTpl.vue"
import type { Mission } from '@/types/mission'

const missions = ref<Mission[]>([
  // 示例数据
  {
    Id: 1,
    UserId: 1001,
    Name: '车辆轨迹采集',
    AreaList: ['鼓楼区', '台江区'],
    DataTypeList: ['GPS', '车速'],
    StartTime: Date.now() - 86400000,
    EndTime: Date.now() + 86400000,
    IsEncrypted: true,
    Reward: 1500
  }
])

const newMission = ref<Partial<Mission>>({
  Name: '',
  AreaList: [],
  DataTypeList: [],
  StartTime: 0,
  EndTime: 0,
  IsEncrypted: false,
  Reward: 0
})

const showDialog = ref(false)
const showTimePicker = ref(false)
const timeRange = ref('')

const missionLabel = (mission: Mission) => {
  return [
    `区域：${mission.AreaList.join(', ')}`,
    `类型：${mission.DataTypeList.join(', ')}`,
    `时间：${formatTime(mission.StartTime)} - ${formatTime(mission.EndTime)}`
  ].join(' | ')
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

const showCreateDialog = () => {
  showDialog.value = true
}

const onConfirmTime = (values: [Date, Date]) => {
  newMission.value.StartTime = values[0].getTime()
  newMission.value.EndTime = values[1].getTime()
  timeRange.value = `${formatTime(values[0].getTime())} 至 ${formatTime(values[1].getTime())}`
  showTimePicker.value = false
}

const onSubmit = () => {
  // 提交逻辑
  missions.value.push({
    ...newMission.value,
    Id: missions.value.length + 1,
    UserId: 1001 // 实际应从用户信息获取
  } as Mission)
  showDialog.value = false
  resetForm()
}

const resetForm = () => {
  newMission.value = {
    Name: '',
    AreaList: [],
    DataTypeList: [],
    StartTime: 0,
    EndTime: 0,
    IsEncrypted: false,
    Reward: 0
  }
  timeRange.value = ''
}
</script>

<style scoped>
.create-btn {
  padding: 15px;
  text-align: center;
}

.mission-lock {
  margin-right: 10px;
  font-size: 16px;
}

.reward {
  color: #07c160;
  font-weight: bold;
}

.van-cell__label {
  color: #969799;
  font-size: 12px;
}
</style>