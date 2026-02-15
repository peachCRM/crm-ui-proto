<template>
  <div class="relative flex items-center group" @mouseover="showTooltip" @mouseleave="hideTooltip">
    <div
      v-show="isTooltipVisible"
      :class="[
        'absolute px-2 py-1 text-xs font-normal border rounded shadow-lg z-50 bg-white text-normal whitespace-pre-line',
        positionClasses
      ]"
      :style="{ width: tooltipWidth }"
    >
      {{ text }}
      <span
        :class="['absolute block w-2.5 h-2.5  transform rotate-45 bg-white', arrowClasses]"
      ></span>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  visible: { type: Boolean, default: false },
  position: {
    type: String,
    default: 'top',
    validator: (value: string) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  width: { type: String, default: '200px' }
});

const isTooltipVisible = ref(false);

const showTooltip = () => {
  isTooltipVisible.value = true;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};

const positionClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2 border-r';
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2 border-l';
    default:
      return '';
  }
});

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-[-4px] left-1/2 transform -translate-x-1/2';
    case 'bottom':
      return 'top-[-4px] left-1/2 transform -translate-x-1/2';
    case 'left':
      return 'right-[-4px] top-1/2 transform -translate-y-1/2';
    case 'right':
      return 'left-[-4px] top-1/2 transform -translate-y-1/2';
    default:
      return '';
  }
});

const tooltipWidth = computed(() => props.width || '200px');
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
