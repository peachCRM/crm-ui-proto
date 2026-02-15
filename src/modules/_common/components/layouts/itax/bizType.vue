<template>
  <!--  <WorkButtonComponent v-if="bizType !== 0" :color="dynamicColor">{{-->
  <!--    textValue-->
  <!--  }}</WorkButtonComponent>-->

  <div :class="dynamicColor">{{ textValue }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
const platformStore = usePlatformStore();

const props = defineProps({
  bizType: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: false,
    default: ''
  }
});

const textValue = computed(() => {
  switch (props.bizType) {
    case 999:
      return props.text;
    default:
      return props.text || platformStore.getTaxiClientBizType(props.bizType);
  }
});

const dynamicColor = computed(() => {
  switch (props.bizType) {
    case 1:
      return 'badge_confirm_sm_type2'; // 개인
    case 2:
      return 'badge_confirm_sm_type3'; // 법인
    case 99:
      return 'badge_confirm_sm_type1'; // 기타
    case 999:
      return 'badge_confirm_sm_type1'; // 회사코드
    default:
      return 'badge_confirm_sm_type1'; // 기본 값
  }
});
</script>
