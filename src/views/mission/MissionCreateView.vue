<template>
  <ViewTpl title="创建任务" :has-back="true">
    <van-form @submit="onMissionCreateSubmit" required="auto">
      <van-cell-group inset>
        <van-field v-model="missionInfo.Name" label="任务名称" placeholder="请输入任务名称"
                   :rules="[{ required: true, message: '请输入任务名称' }]"/>

        <van-field class="show-time-range" v-model="showTimeRange" is-link readonly label="任务时间" placeholder="点击选择任务时间"
                   :rules="[{ required: true, message: '请选择任务时间' }]" @click="showCalendar = true"/>
        <van-calendar v-model:show="showCalendar" type="range" @confirm="onMissionDataRangeConfirm"/>

        <van-field v-model="fieldValue" required label="任务区域">
          <template #input>
            <van-button size="small" type="primary"
                        @click="showCascaderAreaData = true">添加区域
            </van-button>
          </template>
        </van-field>
        <van-popup v-model:show="showCascaderAreaData" round position="bottom">
          <van-cascader v-model="cascaderValue" title="请选择所在地区" :options="options"
                        @close="showCascaderAreaData = false" @finish="onMissionAreaConfirm"/>
        </van-popup>
        <van-swipe-cell v-for="(area, i) in missionInfo.AreaList">
          <van-field :label="`NO.${i + 1}`" readonly label-align="center">
            <template #input>{{ area }}</template>
          </van-field>
          <template #right>
            <van-button square type="danger" text="删除"
                        @click="onArrayDelete(missionInfo.AreaList, i)"/>
          </template>
        </van-swipe-cell>


        <van-popover v-model:show="showPopover" :actions="actions" @select="onDataItemSelect"
                     style="padding: 10px 16px;">
          <template #reference>
            <van-field v-model="currentDataItem" required label="数据类型" placeholder="请输入此任务的数据类型">
              <template #button>
                <van-button size="small" type="primary"
                            @click="onDataItemSelect({ text: currentDataItem })">确定
                </van-button>
              </template>
            </van-field>
          </template>
        </van-popover>
        <van-swipe-cell v-for="(dataItem, i) in missionInfo.DataTypeList">
          <van-field :label="`NO.${i + 1}`" readonly label-align="center">
            <template #input>{{ dataItem }}</template>
          </van-field>
          <template #right>
            <van-button square type="danger" text="删除"
                        @click="onArrayDelete(missionInfo.DataTypeList, i)"/>
          </template>
        </van-swipe-cell>

        <van-field v-model="missionInfo.Reward" type="number" label="奖励金额" placeholder="请输入奖励金额"
                   :rules="[{ required: true, message: '请输入奖励金额' }]"/>

        <van-field label="是否加密">
          <template #input>
            <van-switch v-model="missionInfo.IsEncrypted"/>
          </template>
        </van-field>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-action-bar>
          <van-button round block type="danger" @click="onMissionCreateCancel">取消</van-button>
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </van-action-bar>
      </div>
    </van-form>
  </ViewTpl>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useCascaderAreaData} from "@vant/area-data";
import {showDialog, showConfirmDialog, showNotify} from "vant";
import {Mission} from "@/dao/model/Mission.js";
import {MissionModel} from "@/dao/Mission.js";
import ViewTpl from "@/components/ViewTpl.vue";

const router = useRouter();
const showCalendar = ref(false);
const showTimeRange = ref("");
const showCascaderAreaData = ref(false);
const fieldValue = ref("");
const cascaderValue = ref("");
const options = useCascaderAreaData();
const showPopover = ref(false);
const currentDataItem = ref("");
const actions = [
  {text: "温度℃"},
  {text: "湿度%"},
  {text: "雨量mm"},
  {text: "噪音db"}
];
const missionInfo = ref(new Mission());
missionInfo.value.IsEncrypted = true;

let missionModel: MissionModel = null;

onMounted(() => {
  missionModel = inject("MissionModel") as MissionModel;
});

const onMissionAreaConfirm = ({selectedOptions}) => {
  let area = selectedOptions.map((option) => option.text).join("/");
  let areaDuplicate = false;
  missionInfo.value.AreaList.forEach(e => {
    if (e == area) {
      showDialog({title: "提示", message: "任务区域重复"});
      areaDuplicate = true;
      return;
    }
  });
  if (areaDuplicate) {
    return;
  }
  showCascaderAreaData.value = false;
  missionInfo.value.AreaList.push(area);
};

const onMissionDataRangeConfirm = (date) => {
  missionInfo.value.StartTime = date[0].getTime();
  missionInfo.value.EndTime = date[1].getTime();
  showTimeRange.value = missionInfo.value.TimeRangeString();
  showCalendar.value = false;
};

const onDataItemSelect = (action) => {
  if (!(action.text === "")) {
    let dataTypeDuplicate = false;
    missionInfo.value.DataTypeList.forEach(e => {
      if (e == action.text) {
        showDialog({title: "提示", message: "数据类型重复"});
        dataTypeDuplicate = true;
        return;
      }
    });
    if (!dataTypeDuplicate) {
      missionInfo.value.DataTypeList.push(action.text);
    }
  }
  currentDataItem.value = "";
};

function onMissionCreateCancel() {
  showConfirmDialog({
    title: "提示",
    message: "取消后填写的信息将会消失，是否取消？"
  }).then(() => {
    router.back();
  }).catch(e => {
    console.log(e);
  });
}

function onMissionCreateSubmit() {
  if (missionInfo.value.AreaList.length === 0) {
    showDialog({title: "提示", message: "请选择至少一个任务区域"});
    return;
  }
  if (missionInfo.value.DataTypeList.length === 0) {
    showDialog({title: "提示", message: "请输入至少一种数据类型"});
    return;
  }

  missionInfo.value.UserId = 1;
  missionModel.Create(missionInfo.value)
      .then(mission => {
        missionInfo.value = mission;
        showDialog({title: "提示", message: "创建任务成功"});
        router.back();
      })
      .catch(e => {
        showDialog({title: "提示", message: "创建任务失败：" + e.message});
      });
}

function onArrayDelete(array: string[], index: number) {
  array.splice(index, 1);
}
</script>

<style scoped>
/* 表单容器 */
.van-form {
  padding: 16px;
  background: #f7f8fa;
  min-height: 100vh;
}

/* 表单分组样式 */
.van-cell-group--inset {
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* 字段标签样式 */
.van-field__label {
  color: #323233;
  font-weight: 500;
  width: 80px !important;
}

/* 输入框样式 */
.van-field__control {
  min-height: 44px;
  padding: 8px 0;
}

/* 时间选择字段 */
.van-field__control[readonly] {
  color: #1989fa;
  cursor: pointer;
}

/* 区域选择按钮 */
.van-button--primary {
  --van-button-primary-background: rgba(25,137,250,0.1);
  --van-button-primary-border-color: transparent;
  --van-button-primary-color: #1989fa;
}

/* 已添加区域/类型列表 */
.van-swipe-cell {
  margin: 8px 0;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.van-swipe-cell__wrapper {
  padding: 0 16px;
}

/* 删除按钮样式 */
.van-button--danger {
  height: 100%;
  border-radius: 0;
}

/* 数据类型输入 */
.van-popover__wrapper {
  width: 100%;
}

/* 金额输入框 */
.van-field__control[type="number"] {
  font-weight: bold;
  color: #07c160;
}

/* 加密开关 */
.van-switch {
  --van-switch-on-background: #1989fa;
}

/* 操作按钮组 */
.van-action-bar {
  padding: 0;
  margin-top: 24px;
  gap: 12px;
}

.van-action-bar .van-button {
  flex: 1;
  height: 44px;
  font-size: 16px;
}

/* 自定义时间显示 */
.show-time-range {
  color: #1989fa;
  font-weight: 500;
}

/* 地区选择弹窗 */
.van-popup--bottom {
  border-radius: 16px 16px 0 0;
}

.van-cascader {
  --van-cascader-active-color: #1989fa;
  --van-cascader-header-height: 48px;
}
</style>