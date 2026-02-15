<template>
  <USelect
    :model-value="internalValue"
    :items="selectItems"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="computedClass"
    @update:model-value="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectOption {
  text: string;
  value: string | number;
}

interface Props {
  modelValue?: string | number;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: '선택하세요',
  disabled: false,
  class: ''
});

const emit = defineEmits<Emits>();

// 내부 값 계산 (빈 문자열을 'all'로 변환)
const internalValue = computed(() => {
  return props.modelValue === '' ? 'all' : String(props.modelValue);
});

// USelect에서 사용할 items 형태로 변환
const selectItems = computed(() => {
  return props.options.map((item) => ({
    label: item.text,
    value: item.value === '' ? 'all' : String(item.value)
  }));
});

// 클래스 계산
const computedClass = computed(() => {
  const baseClass = 'w-full';
  return props.class ? `${baseClass} ${props.class}` : baseClass;
});

// 값 변경 처리
function handleChange(value: string | number) {
  // 'all' 값을 빈 문자열로 변환하여 외부로 전달
  const outputValue = value === 'all' ? '' : value;
  emit('update:modelValue', outputValue);
}
</script>
