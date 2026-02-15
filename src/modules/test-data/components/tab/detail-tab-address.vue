<template>
  <div class="mt-4">
    <div class="text-md font-semibold">주소정보</div>
    <div class="mt-2 border-t">
      <p-form-row label="우편번호"> 12345 </p-form-row>
      <p-form-row label="주소"> 서울특별시 강남구 </p-form-row>
      <p-form-row label="상세주소"> 서울특별시 강남구 역삼동 123-456 </p-form-row>
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
    if (value === 'address') {
      setTimeout(async () => {
        console.log('address');
      }, 100);
    }
  },
  { immediate: true, deep: true }
);
</script>
