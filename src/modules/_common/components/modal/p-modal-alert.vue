<template>
  <div v-if="isOpenInsert" ref="modalContainer" style="pointer-events: auto" tabindex="0">
    <div
      class="fixed top-0 right-0 bottom-0 left-0 bg-black opacity-45"
      :style="{ 'z-index': 160 - 1 }"
    ></div>
    <div
      class="fixed top-0 right-0 left-0 z-50 flex h-full max-h-full w-full items-center justify-center overflow-x-hidden overflow-y-auto md:inset-0"
      :style="{ 'z-index': 160 }"
    >
      <!-- S : 오류 -->
      <div
        class="rounded-custom8 shadow-custom0010 dark:bg-black141414 m-auto flex w-[400px] flex-col items-center gap-6 bg-white px-10 pt-[30px] pb-[20px]"
      >
        <!-- <img
          src="@/assets/images/workspace/inc/icon_alert.svg"
          class="cursor-pointer block dark:hidden w-20 h-20"
          v-if="defaultLayoutStore.modalStates.alert"
        />
        <img
          src="@/assets/images/workspace/inc/icon_warning.svg"
          class="cursor-pointer block dark:hidden w-20 h-20"
          v-if="defaultLayoutStore.modalStates.warning"
        /> -->
        <img src="../../../../assets/images/inc/icon_bug.svg" class="block dark:hidden" alt="오류" />
        <img src="../../../../assets/images/inc/icon_bug_dark.svg" class="hidden dark:block" alt="오류" />

        <div class="flex flex-col items-center gap-1">
          <div class="text-fontsize16 dark:text-grayd9d9d9 font-semibold whitespace-pre-line">
            {{ defaultLayoutStore.AlertMessage }}
          </div>
        </div>

        <!-- S : FOOTER -->
        <div class="flex justify-between px-6 pb-5">
          <div class=""></div>
          <div class="flex flex-row gap-2">
            <button class="confirm-button cursor-pointer focus:outline-none" @click="check">
              <div
                class="text-fontsize14 bg-colorPrimary border-colorPrimary rounded-custom6 shadow-custom020 dark:border-customBlue167 dark:bg-customBlue167 dark:shadow-custom020_dark flex h-8 cursor-pointer items-center border px-3 leading-6 text-white"
              >
                확인
              </div>
            </button>
          </div>
        </div>
        <!-- E : FOOTER -->
      </div>
      <!-- E : 오류 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useDefaultLayoutStore } from '@/modules/_common/store/default-layout.store.ts';

const defaultLayoutStore = useDefaultLayoutStore();

// const emit = defineEmits(['close']);

/**
 * 모달창 열기 제어
 */
const isOpenInsert = ref(false); // 모달창 열기
const modalContainer = ref<HTMLElement | null>(null); // 모달 컨테이너 ref
// const boxWidth = ref('450');

const router = useRouter();

/**
 * 모달에 포커스 주기
 */
const focusModal = () => {
  nextTick(() => {
    if (modalContainer.value) {
      modalContainer.value.focus();
    }
  });
};

/**
 * 전역 키 이벤트 핸들러
 */
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isOpenInsert.value) {
    event.preventDefault();
    event.stopPropagation();
    check();
  }
};

watch(
  () => [defaultLayoutStore.modalStates.alert, defaultLayoutStore.modalStates.warning],
  ([isAlert, isWarning]) => {
    isOpenInsert.value = isAlert || isWarning;

    if (isWarning) {
      defaultLayoutStore.modalStates.alert = false;
    } else if (isAlert) {
      defaultLayoutStore.modalStates.warning = false;
    }
  },
  { immediate: true }
);

// 모달이 열릴 때마다 포커스 주기
watchEffect(() => {
  if (isOpenInsert.value) {
    focusModal();
  }
});

watch(
  isOpenInsert,
  (value) => {
    if (value) {
      // 모달이 열릴 때 전역 키보드 이벤트 리스너 등록
      document.addEventListener('keydown', handleGlobalKeyDown);
    } else {
      // 모달이 닫힐 때 전역 키보드 이벤트 리스너 제거
      document.removeEventListener('keydown', handleGlobalKeyDown);

      if (defaultLayoutStore.modalStates.alert) {
        defaultLayoutStore.modalStates.alert = false;
      } else if (defaultLayoutStore.modalStates.warning) {
        defaultLayoutStore.modalStates.warning = false;
      }
    }
  },
  { immediate: true }
);

const check = () => {
  isOpenInsert.value = false;

  if (defaultLayoutStore.returnUrl) {
    router.push(defaultLayoutStore.returnUrl);
  }
};

onMounted(() => {
  const confirmButton = document.querySelector('.confirm-button');
  if (confirmButton) {
    nextTick(() => {
      (confirmButton as HTMLElement).focus();
    });
  }
});

// 컴포넌트가 언마운트될 때 이벤트 리스너 정리
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
});
</script>
<style scoped lang="scss"></style>
