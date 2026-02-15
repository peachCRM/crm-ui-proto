<template>
  <div class="mt-4">
    <div class="text-md font-semibold">만료정보</div>
    <div class="mt-2 border-t">
      <p-form-row label="만료일"> 2025-01-01 </p-form-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import { watch } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    default: ''
  }
});

watch(
  () => [props.activeTab],
  ([value]) => {
    if (value === 'expire') {
      setTimeout(async () => {
        console.log('expire');
      }, 100);
    }
  },
  { immediate: true, deep: true }
);
</script>
