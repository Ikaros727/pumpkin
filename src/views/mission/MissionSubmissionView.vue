<template>
  <ViewTpl title="提交任务数据" :has-back="true" ref="viewTplRef" v-auto-scroll-bottom>
    <!-- 任务信息展示 -->
    <MissionCard title="基本信息" :mission="mission"/>

    <!-- 已提交数据列表 -->
    <template v-if="submissionFormData.length">
      <van-divider>已提交数据</van-divider>
      <van-cell-group v-for="submitted in submissionFormData" :title="submitted.area" inset>
        <van-cell v-for="dataType in mission.DataTypeList" :title="dataType" :value="submitted.dataItems[dataType]"/>
      </van-cell-group>
    </template>

    <van-divider>{{areaOptions.length > 0 ? "提交任务区域数据" : "任务区域数据已全部提交"}}</van-divider>
    <van-form v-if="areaOptions.length > 0" @submit="handleSubmit">
      <van-cell-group inset>
        <!-- 区域选择 -->
        <van-field
            v-model="formData.area"
            is-link
            readonly
            name="area"
            label="选择区域"
            placeholder="请选择省/市/区"
            :rules="[{ required: true, message: '请选择区域' }]"
            @click="showAreaPicker = true"
        />
        <van-popup v-model:show="showAreaPicker" round position="bottom">
          <van-picker
              title="任务区域"
              :columns="areaOptions"
              @confirm="onAreaConfirm"
              @cancel="showAreaPicker = false"
          />
        </van-popup>

        <!-- 动态数据输入项 -->
        <template v-for="dataType in mission.DataTypeList" :key="dataType">
          <van-field
              v-model.number="formData.dataItems[dataType]"
              :name="`data-${dataType}`"
              :label="dataType"
              type="number"
              :rules="[
              { required: true, message: `请输入${dataType}` },
              { validator: validateNumber, message: '请输入有效数字' }
            ]"
              :placeholder="`请输入${dataType}`"
          />
        </template>
      </van-cell-group>

      <!-- 提交按钮 -->
      <div style="margin: 16px;">
        <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="submitting"
        >
          提交数据
        </van-button>
      </div>
    </van-form>
  </ViewTpl>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {Mission} from "@/dao/model/Mission.js";
import ViewTpl from "@/components/ViewTpl.vue";
import MissionCard from "@/components/MissionCard.vue";
import {showSuccessToast, showFailToast} from "vant";

interface FormData {
  area: string;
  dataItems: Record<string, bigint>;
}

// 添加模板引用
const viewTplRef = ref<HTMLElement>();
const mission = ref<Mission>(new Mission());
const formData = ref<FormData>({
  area: "",
  dataItems: {}
});
const showAreaPicker = ref(false);
const submitting = ref(false);
const areaOptions = ref<string[]>([]);

const route = useRoute();
let submissionFormData: FormData[] = [];

// 初始化任务数据
onMounted(() => {
  mission.value = new Mission(JSON.parse(route.query.mission as string));

  // 初始化数据项
  mission.value.DataTypeList.forEach(type => {
    formData.value.dataItems[type] = 0n;
  });

  // 计算区域选项（适配vant-picker格式）
  areaOptions.value = mission.value.AreaList.map(area => ({
    text: area,
    value: area
  }));
});

// 区域选择确认
const onAreaConfirm = (values: any) => {
  formData.value.area = values.selectedOptions[0].value;
  showAreaPicker.value = false;
};

// 数字验证
const validateNumber = (value: string | number) => {
  return !isNaN(Number(value));
};

// 提交处理
const handleSubmit = async () => {
  try {
    submitting.value = true;
    submissionFormData.push(formData.value);
    for (let i = 0; i < areaOptions.value.length; i++) {
      if (areaOptions.value[i].value === formData.value.area) {
        areaOptions.value.splice(i, 1);
        break;
      }
    }
    formData.value = {
      area: "",
      dataItems: {}
    };
    mission.value.DataTypeList.forEach(type => {
      formData.value.dataItems[type] = 0n;
    });
  } catch (error) {
    // showFailToast("提交失败，请重试");
    // console.error("提交失败:", error);
  } finally {
    showSuccessToast("提交成功");
    submitting.value = false;
  }
};
</script>

<style scoped>
.van-cell-group {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  margin: 12px 12px; /* 新增左右边距 */
}
</style>
[file content end]