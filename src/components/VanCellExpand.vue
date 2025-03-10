<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

const props = defineProps({
  title: String,
  value: ""
});

const isExpanded = ref(false);
const textContentRef = ref<HTMLElement | null>(null);
const showToggle = ref(false);

onMounted(() => {
  nextTick(() => {
    if (!textContentRef.value) return;

    // 创建临时元素计算两行高度
    const tempEl = document.createElement('div');
    tempEl.style.cssText = `
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      visibility: hidden;
      position: absolute;
      width: ${textContentRef.value.offsetWidth}px;
      font: ${window.getComputedStyle(textContentRef.value).font};
      line-height: ${window.getComputedStyle(textContentRef.value).lineHeight};
      padding: ${window.getComputedStyle(textContentRef.value).padding};
    `;
    tempEl.textContent = props.value || '';
    document.body.appendChild(tempEl);

    const twoLineHeight = tempEl.offsetHeight;
    document.body.removeChild(tempEl);

    // 比较实际高度
    const actualHeight = textContentRef.value.scrollHeight;
    showToggle.value = twoLineHeight != 0 && actualHeight > twoLineHeight;
  });
});
</script>

<template>
  <van-cell
      :title="props.title"
      :class="['', {'expanded': isExpanded}]"
      @click="showToggle && (isExpanded = !isExpanded)"
  >
    <template #value>
      <div class="content-container">
        <div ref="textContentRef" class="text-content">{{ props.value }}</div>
        <div class="toggle-btn" v-if="showToggle">
          <van-icon v-show="isExpanded" name="arrow-up"/>
          <van-icon v-show="!isExpanded" name="arrow-down"/>
        </div>
      </div>
    </template>
  </van-cell>
</template>

<style scoped>
.content-container {
  position: relative;
  padding-right: 24px;
}

.text-content {
  display: -webkit-box;
  -webkit-line-clamp: var(--line-clamp, 1);
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5; /* 保持行高一致 */
}

.expanded .text-content {
  -webkit-line-clamp: unset;
}

.toggle-btn {
  position: absolute;
  right: 0;
  top: 0;
  color: #1989fa;
  cursor: pointer;
  background: linear-gradient(90deg, transparent 0%, white 30%); /* 文字过长时渐变遮罩 */
  padding-left: 12px;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .toggle-btn {
    padding-left: 8px;
    background: linear-gradient(90deg, transparent 0%, white 40%);
  }
}
</style>