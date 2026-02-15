<template>
  <WorkButtonComponent :color="returnColor" :is-disabled="isDisabled">{{
    textValue
  }}</WorkButtonComponent>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WorkButtonComponent from '@/modules/_common/components/forms/p-button.vue';

const props = defineProps({
  btnType: {
    type: String,
    required: true
  },
  code: {
    type: [String],
    required: false,
    default: ''
  },
  text: {
    type: String,
    required: false,
    default: ''
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const textValue = computed(() => {
  if (props.btnType === 'status') {
    // 완료, 진행중, 접수
    if (props.text) return props.text;
    switch (props.code) {
      case '01':
        return '접수';
      case '02':
        return '진행중';
      case '03':
        return '완료';
      case 'N':
        return '성공';
      case 'Y':
        return '에러';
      default:
        return '접수';
    }
  } else {
    return props.text;
  }
});

const returnColor = computed(() => {
  switch (props.btnType) {
    case 'status':
      return dynamicColor.value; // 완료, 진행중, 접수
    case 'download':
      return 'btn_secondary_md'; // 다운로드
    default:
      return 'btn_primary_md'; // 기본값 추가
  }
});

const dynamicColor = computed(() => {
  if (props.code === '01') {
    // 접수
    return 'btn_confirm_sm_type1';
  } else if (props.code === '02') {
    // 진행중
    return 'btn_confirm_sm_type3';
  } else if (props.code === '03' || props.code === 'N') {
    // 완료, 성공
    return 'btn_confirm_sm_type2';
  } else if (props.code === 'Y') {
    // 오류
    return 'btn_confirm_sm_type5';
  } else if (props.code === 'ERR') {
    // 오류내용보기
    return 'btn_confirm_sm_type4';
  } else {
    return 'btn_confirm_sm_type1'; // 기본 값
  }
});
</script>
