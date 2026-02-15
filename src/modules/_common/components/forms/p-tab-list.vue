<template>
  <div class="flex flex-row flex-wrap gap-4 border-b border-[#F0F0F0] dark:border-gray303030">
    <template v-for="tab in tabList" :key="tab.id">
      <div
        :class="[
          'cursor-pointer flex items-center mb-[-1px] text-fontsize14 leading-[46px]',
          activeTab === tab.id
            ? 'text-colorPrimary border-b-2 border-colorPrimary dark:text-customBlue167 dark:board-customBlue167'
            : 'text-customGray1f1 border-b-2 border-transparent dark:text-grayd9d9d9'
        ]"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.text }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

defineComponent({
  name: 'TaxiTabList'
});

defineProps({
  tabList: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['setActiveTab']);

const setActiveTab = (tabName: string) => {
  emit('setActiveTab', tabName);
};
</script>
