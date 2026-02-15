<template>
  <div class="flex flex-col gap-1">
    <!-- S : 현재주소 -->
    <div class="flex min-h-[2rem] flex-row gap-2">
      <template v-for="(item, index) in breadcrumbs" :key="index">
        <div
          class="text-fontsize14 dark:text-gray727272 px-1"
          :class="index !== breadcrumbs.length - 1 ? 'text-customGray8c' : 'text-customGray1f1'"
        >
          {{ item.title }}
        </div>
        <div
          v-if="index !== breadcrumbs.length - 1"
          class="text-fontsize14 text-customGray8c dark:text-gray727272"
        >
          /
        </div>
      </template>
      <div class="ml-auto flex gap-2">
        <WorkButtonComponent v-if="showWorkBtn" color="btn_search_md" @click="openSmsModal">
          문자 전송
        </WorkButtonComponent>
      </div>
    </div>
    <!-- E : 현재주소 -->

    <!-- S : TITLE/버튼 -->
    <div class="flex flex-row items-end justify-between">
      <div class="flex flex-col gap-2">
        <div class="flex flex-row items-center gap-2">
          <div class="text-fontsize24 leading-line32 dark:text-grayd9d9d9 font-semibold">
            {{ props.title }}
          </div>
          <div class="relative">
            <PBtnType v-if="layer" btn-type="status" text="설명" @click="toggleBtn" />
            <div
              v-if="hoverIndex"
              class="absolute top-[-17px] left-[45px] z-20 flex w-auto flex-col items-center"
            >
              <div
                class="rounded-custom8 shadow-custom04100 flex flex-col items-center justify-center border bg-white"
              >
                <!-- S : 메시지 -->
                <div class="flex flex-col">
                  <div
                    class="text-fontsize14 text-customGray1f1 content-center px-2 py-1 break-keep whitespace-nowrap"
                  >
                    <slot></slot>
                  </div>
                </div>
                <!-- E : 메시지 -->
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="props.subtitle"
          class="text-fontsize12 leading-line20 text-customgray8c8 dark:text-gray727272"
          v-html="subtitle"
        ></div>
      </div>
      <slot name="buttons"></slot>
    </div>
    <!-- E : TITLE/버튼 -->
  </div>

  <PModal
    v-model="isOpenInsert"
    :title="title"
    :box-width="boxWidth"
    :current-comp="currentComp"
    :btn-close="btnClose"
    :btn-save="btnSave"
    :modal-props="modalProps"
    :btn-save-text="btnSaveText"
  >
  </PModal>

  <!-- 준비중 모달 -->
  <UModal v-model:open="isOpenPreparing" title="알림">
    <template #body>
      <div class="flex flex-col items-center justify-center py-8">
        <div class="i-heroicons-information-circle text-primary mb-4 h-12 w-12"></div>
        <p class="text-lg font-medium">준비중입니다.</p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <UButton color="primary" @click="isOpenPreparing = false">확인</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import WorkButtonComponent from '@/modules/_common/components/forms/p-button.vue';
import PBtnType from '@/modules/_common/components/forms/p-btn-type.vue';
import PModal from '@/modules/_common/components/modal/p-modal.vue';

// UI Proto: 인증 관련 코드 제거 (Mock 모드)

const hoverIndex = ref(false); // 현재 hover 상태
const toggleBtn = () => {
  hoverIndex.value = !hoverIndex.value;
};

type Breadcrumb = {
  title: string;
};

// 준비중 모달 상태
const isOpenPreparing = ref(false);

const props = defineProps({
  layer: Boolean,
  layerText: {
    type: String,
    default: ''
  },
  showWorkBtn: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array as () => Breadcrumb[],
    default: () => []
  }
});

/**
 * 모달창 열기 제어
 */
const isOpenInsert = ref(false); // 모달창 열기
const boxWidth = ref('900');
const currentComp = shallowRef();
const btnSave = ref(false);
const modalProps = ref<Record<string, unknown>>();
const btnSaveText = ref('');
const btnClose = ref(false);

/**
 * 문자 전송 버튼 클릭 - 준비중 모달 표시
 */
const openSmsModal = () => {
  isOpenPreparing.value = true;
};
</script>
