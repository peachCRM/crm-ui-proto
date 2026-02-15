<template>
  <div v-if="isOpenInsert">
    <div
      class="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black opacity-45"
      :style="{ 'z-index': 60 - 1 }"
    ></div>
    <div
      class="fixed top-0 right-0 left-0 z-50 flex h-full max-h-full w-full items-center justify-center overflow-x-hidden overflow-y-auto md:inset-0"
      :style="{ 'z-index': 60 }"
    >
      <!-- S : 완료 -->
      <div
        class="rounded-custom8 shadow-custom0010 dark:bg-black141414 m-auto flex w-[380px] flex-col items-center gap-6 bg-white px-10 pt-[30px] pb-[20px]"
      >
        <!-- 커스텀 텍스트가 있으면 텍스트 표시 -->
        <template v-if="iconText">
          <div :class="[iconTextSize, 'dark:text-grayd9d9d9 font-bold']">
            {{ iconText }}
          </div>
        </template>
        
        <!-- 커스텀 텍스트가 없으면 기존 아이콘 표시 -->
        <template v-else>
          <template v-if="defaultLayoutStore.modalStates.confirm">
            <img src="../../../../assets/images/inc/icon_success.svg" class="block dark:hidden" alt="완료" />
            <img
              src="../../../../assets/images/inc/icon_success_dark.svg"
              class="hidden dark:block"
              alt="완료"
            />
          </template>

          <template v-if="defaultLayoutStore.modalStates.Delete">
            <img
              src="../../../../assets/images/inc/icon_delete.svg"
              class="block h-10 w-10 dark:hidden"
              alt="삭제"
            />
            <img
              src="../../../../assets/images/inc/icon_delete_dark.svg"
              class="hidden h-10 w-10 dark:block"
              alt="삭제"
            />
          </template>
        </template>

        <div class="flex flex-col items-center gap-1">
          <div :class="[messageTextSize, 'dark:text-grayd9d9d9 whitespace-pre-line', textAlign, { 'font-semibold': useBoldMessage }]">
            {{ defaultLayoutStore.AlertMessage }}
          </div>
          <div
            v-if="defaultLayoutStore.SubMessage"
            class="text-fontsize14 dark:text-grayf0f0f0 text-graya6a6a6 font-semibold"
          >
            {{ defaultLayoutStore.SubMessage }}
          </div>
        </div>

        <!-- S : FOOTER -->
        <div :class="['flex flex-row gap-2', { 'w-full': props.useWideButton }]">
          <a
            v-if="props.useCancel"
            :class="['cursor-pointer', { grow: props.useWideButton }]"
            @click="isOpenInsert = false"
          >
            <div
              class="text-fontsize14 text-customGray1f1 border-customGrayE4E rounded-custom6 shadow-custom020 dark:border-gray424242 dark:text-grayd9d9d9 dark:shadow-custom020_dark flex h-8 cursor-pointer items-center justify-center border px-3 leading-6"
            >
              {{ cancelButtonText }}
            </div>
          </a>
          <a
            v-if="props.useConfirm"
            :class="['cursor-pointer', { grow: props.useWideButton }]"
            @click="confirmAction"
          >
            <div
              class="text-fontsize14 bg-colorPrimary border-colorPrimary rounded-custom6 shadow-custom020 dark:border-customBlue167 dark:bg-customBlue167 dark:shadow-custom020_dark flex h-8 cursor-pointer items-center justify-center border px-3 leading-6 text-white"
            >
              {{ confirmButtonText }}
            </div>
          </a>
        </div>
        <!-- E : FOOTER -->
      </div>
      <!-- E : 완료 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDefaultLayoutStore } from '@/modules/_common/store/default-layout.store.ts';
import { ref, watch } from 'vue';

const defaultLayoutStore = useDefaultLayoutStore();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },

  useConfirm: {
    type: Boolean,
    default: true
  },

  useCancel: {
    type: Boolean,
    default: true
  },

  useWideButton: {
    type: Boolean,
    default: false
  },

  // 메시지 텍스트 크기 (text-fontsize12, text-fontsize14, text-fontsize16, text-fontsize18, text-fontsize20, text-fontsize24)
  messageTextSize: {
    type: String,
    default: 'text-fontsize18'
  },

  // 텍스트 정렬 (center, left, right, justify)
  textAlign: {
    type: String ,
    default: 'text-left'
  },

  // 아이콘 대신 표시할 텍스트 (예: '⚠️', '✓', '!')
  iconText: {
    type: String,
    default: ''
  },

  // 아이콘 텍스트 크기 (text-fontsize12, text-fontsize14, text-fontsize16, text-fontsize18, text-fontsize20, text-fontsize24)
  iconTextSize: {
    type: String,
    default: 'text-fontsize24'
  },

  // 메시지 텍스트 볼드 처리 여부
  useBoldMessage: {
    type: Boolean,
    default: true
  },

  // 확인 버튼 텍스트
  confirmButtonText: {
    type: String,
    default: '확인'
  },

  // 취소 버튼 텍스트
  cancelButtonText: {
    type: String,
    default: '취소'
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'fnConfirm', 'test']);

const confirmAction = () => {
  emit('fnConfirm');
  emit('test');
  isOpenInsert.value = false; // 모달창 닫기
};

/**
 * 모달창 열기 제어
 */
const isOpenInsert = ref(false); // 모달창 열기
// const boxWidth = ref('450');

watch(
  () => [defaultLayoutStore.modalStates.confirm, defaultLayoutStore.modalStates.Delete],
  ([isConfirm, isDelete]) => {
    isOpenInsert.value = isConfirm || isDelete;

    if (isConfirm) {
      defaultLayoutStore.modalStates.Delete = false;
    } else if (isDelete) {
      defaultLayoutStore.modalStates.confirm = false;
    }
  },
  { immediate: true }
);

watch(
  isOpenInsert,
  (value) => {
    if (!value) {
      emit('update:modelValue', false);

      if (defaultLayoutStore.modalStates.confirm) {
        defaultLayoutStore.modalStates.confirm = false;
      } else if (defaultLayoutStore.modalStates.Delete) {
        defaultLayoutStore.modalStates.Delete = false;
      }
    } else {
      emit('update:modelValue', true);
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss"></style>
