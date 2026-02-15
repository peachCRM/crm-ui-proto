<template>
  <div class="mt-4">
    <div class="text-md font-semibold">대기정보</div>
    <div class="mt-2 border-t">
      <p-form-row label="대기일"> 2025-01-01 </p-form-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
const props = defineProps({
  activeTab: {
    type: String,
    default: ''
  }
});

watch(
  () => [props.activeTab],
  ([value]) => {
    if (value === 'wait') {
      setTimeout(async () => {
        console.log('wait');
      }, 100);
    }
  },
  { immediate: true, deep: true }
);
</script>
