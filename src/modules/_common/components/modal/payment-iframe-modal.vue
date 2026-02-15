<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0" :style="{ zIndex: zIndex }">
      <!-- 배경 오버레이 -->
      <div
        class="absolute inset-0 bg-black opacity-50"
        @click="handleClose"
      ></div>

      <!-- 모달 컨텐츠 -->
      <div class="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div
          class="relative bg-white rounded-custom8 shadow-custom0010 dark:bg-black141414 pointer-events-auto"
          :style="containerStyle"
        >
          <!-- 닫기 버튼 -->
          <!-- <button
            type="button"
            class="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="handleClose"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> -->

          <!-- iframe 컨테이너 -->
          <div class="overflow-hidden rounded-custom8">
            <iframe
              ref="iframeRef"
              :src="iframeUrl"
              :style="iframeStyle"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              class="border-0"
              @load="handleIframeLoad"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, toRaw } from 'vue';
import { usePaymentStore } from '@/modules/_common/store/payment.store';
import { useAuthStore } from '@/modules/member/store/auth.store';
import { useDefaultLayoutStore } from '@/modules/_common/store/default-layout.store';
import type { IframeModalResult } from '@/modules/_common/type/payment.type';

// 기본값 상수
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 430;
const DEFAULT_Z_INDEX = 50;

const paymentStore = usePaymentStore();
const authStore = useAuthStore();
const defaultLayoutStore = useDefaultLayoutStore();

const iframeRef = ref<HTMLIFrameElement | null>(null);

// 스토어에서 모달 상태 가져오기
const isOpen = computed(() => paymentStore.iframeModal.isOpen);
const currentUrl = computed(() => paymentStore.iframeModal.currentUrl);

// iframe URL (origin 파라미터 추가 - postMessage 통신에 필요)
const iframeUrl = computed(() => {
  const baseUrl = currentUrl.value?.url;
  if (!baseUrl) return '';

  const url = new URL(baseUrl);
  url.searchParams.set('origin', window.location.origin);
  return url.toString();
});

// 토큰
const token = computed(() => authStore.accessToken);

// z-index
const zIndex = DEFAULT_Z_INDEX;

// 너비/높이 계산
const width = computed(() => currentUrl.value?.width || DEFAULT_WIDTH);
const height = computed(() => currentUrl.value?.height || DEFAULT_HEIGHT);

// 동적 높이 관리
const isDynamicHeight = computed(() => height.value === -1);
const currentHeight = ref(DEFAULT_HEIGHT);

// 컨테이너 스타일 계산
const containerStyle = computed(() => {
  return {
    width: `${width.value}px`,
    maxWidth: '95vw'
  };
});

// iframe 스타일 계산
const iframeStyle = computed(() => {
  let heightValue: string;
  if (isDynamicHeight.value) {
    heightValue = `${currentHeight.value}px`;
  } else {
    heightValue = `${height.value}px`;
  }
  return {
    width: `${width.value}px`,
    height: heightValue,
    maxWidth: '95vw',
    maxHeight: '90vh'
  };
});

// iframe에 파라미터 전송 (공통 로직)
const sendParamsToIframe = () => {
  if (!iframeRef.value?.contentWindow) return;

  const message: any = {
    token: token.value
  };

  // services 정보가 있으면 함께 전송 (toRaw로 reactive proxy 해제)
  if (paymentStore.iframeModal.services) {
    message.services = toRaw(paymentStore.iframeModal.services);
  }
  iframeRef.value.contentWindow.postMessage(message, '*');
};

// iframe 로드 완료 시 토큰과 서비스 정보 전송
const handleIframeLoad = () => {
  // 로딩 종료
  defaultLayoutStore.loading(false, true);

  // 토큰과 서비스 정보 전송
  sendParamsToIframe();
};

// postMessage 이벤트 핸들러
const handleMessage = (event: MessageEvent) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  // MODAL_RESULT 처리
  if (data.type === 'MODAL_RESULT') {
    const result: IframeModalResult = {
      type: data.type,
      code: data.code || '',
      action: data.action || '',
      redirectUrl: data.redirectUrl || '',
      remainingPoint: data.remainingPoint || 0,
      transactions: data.transactions || []
    };
    paymentStore.handleIframeResult(result);
    return;
  }

  // MODAL_RESIZE 처리 (동적 높이)
  if (data.type === 'MODAL_RESIZE' && typeof data.height === 'number') {
    if (isDynamicHeight.value) {
      currentHeight.value = data.height;
    }
    return;
  }

  // MODAL_READY 처리 (파라미터 요청)
  if (data.type === 'MODAL_READY') {
    sendParamsToIframe();
    return;
  }
};

// 모달 닫기
const handleClose = () => {
  paymentStore.closeIframeModal();
};

// 메시지 이벤트 리스너 등록/해제
onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

// 모달이 열릴 때 body 스크롤 방지
watch(
  isOpen,
  (isOpenValue) => {
    if (isOpenValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
  { immediate: true }
);

// iframe 로딩 상태 관리
watch(
  [isOpen, currentUrl],
  ([isOpenValue, url]) => {
    if (isOpenValue && url?.url) {
      defaultLayoutStore.loading(true, true);
      // 동적 높이 모드면 초기 높이 설정
      if (isDynamicHeight.value) {
        currentHeight.value = DEFAULT_HEIGHT;
      }
    }
  },
  { immediate: true }
);
</script>
