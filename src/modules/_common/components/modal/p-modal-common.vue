<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center"
      :class="[`z-${zIndex}`]"
    >
      <!-- 배경 오버레이 -->
      <div class="absolute inset-0 bg-black opacity-50" @click="handleOverlayClick"></div>

      <!-- 모달 컨텐츠 -->
      <div
        :class="[
          'relative z-10 bg-white rounded-custom8 shadow-custom0010 p-6 dark:bg-black141414',
          sizeClass
        ]"
      >
        <!-- 헤더 -->
        <div v-if="$slots.header" class="mb-4">
          <slot name="header"></slot>
        </div>
        <div v-else class="flex justify-between items-center mb-4">
          <h3 class="text-fontsize18 font-semibold text-customGray1f1 dark:text-grayD9D9D9">
            {{ title }}
          </h3>
          <button
            class="text-customGray1f1 hover:text-customGray1f1 dark:text-grayD9D9D9"
            @click="closeModal"
          >
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- 바디 -->
        <div v-if="$slots.body" class="mb-4">
          <slot name="body"></slot>
        </div>
        <div v-else class="mb-4">
          <slot></slot>
        </div>

        <!-- 푸터 -->
        <div v-if="$slots.footer" class="flex justify-end gap-2">
          <slot name="footer"></slot>
        </div>
        <div v-else class="flex justify-end gap-2">
          <button
            class="px-4 py-2 text-customGray1f1 bg-gray-200 rounded-custom6 hover:bg-gray-300 dark:bg-black141414 dark:text-grayD9D9D9"
            @click="closeModal"
          >
            취소
          </button>
          <button
            class="px-4 py-2 text-white bg-colorPrimary rounded-custom6 hover:bg-colorPrimary dark:bg-customBlue167"
            @click="handleConfirm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '모달'
  },
  size: {
    type: String as PropType<ModalSize>,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl', 'full', 'custom'].includes(value)
  },
  // 커스텀 사이즈를 직접 지정할 수 있는 prop
  customSize: {
    type: String,
    default: ''
  },
  // 추가적인 커스텀 클래스
  customClass: {
    type: String,
    default: ''
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const closeModal = () => {
  emit('update:modelValue', false);
};

const handleOverlayClick = () => {
  if (props.autoClose) {
    closeModal();
  }
};

const handleConfirm = () => {
  emit('confirm');
  closeModal();
};

// 사이즈별 클래스 계산
const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
    full: 'w-11/12 max-w-7xl',
    custom: props.customSize || 'w-11/12'
  };
  // return sizes[props.size]
  return `${sizes[props.size]} ${props.customClass}`.trim();
});
</script>
