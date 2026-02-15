<template>
  <div class="flex flex-col border-b border-gray-100 py-4 md:flex-row dark:border-gray-800">
    <div class="w-full font-medium text-gray-500 md:w-1/5 dark:text-gray-400" :title="label">
      <div class="flex items-center">
        <UIcon v-if="icon" :name="icon" class="mr-2 text-gray-500 dark:text-gray-400" />
        <span class="text-gray-500 dark:text-gray-300">{{ truncatedLabel }}</span>
      </div>
    </div>
    <div class="w-full text-gray-700 md:w-2/3 dark:text-gray-300">
      <div v-if="isHtml" v-html="value"></div>
      <div v-else>{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Array, Object],
    required: true
  },
  maxLabelLength: {
    type: Number,
    default: 10
  },
  icon: {
    type: String,
    default: ''
  },
  isHtml: {
    type: Boolean,
    default: false
  },
  isImage: {
    type: Boolean,
    default: false
  },
  isFile: {
    type: Boolean,
    default: false
  }
});

const truncatedLabel = computed(() => {
  if (props.label.length > props.maxLabelLength) {
    return props.label.substring(0, props.maxLabelLength) + '...';
  }
  return props.label;
});
</script>
