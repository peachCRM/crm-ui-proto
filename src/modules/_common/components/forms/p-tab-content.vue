<template>
  <div
    v-if="!deferRendering || activeTab === tabId"
    v-show="activeTab === tabId"
    :class="{ active: activeTab === tabId }"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({
  name: 'TaxiTabContent'
});

defineProps({
  tabId: {
    type: String,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  },

  deferRendering: {
    type: Boolean,
    default: true
  }
});
</script>
