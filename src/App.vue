<template>
  <div v-if="isFullyReady">
    <UApp :toaster="{ position: 'top-right' }">
      <router-view />
    </UApp>
    <PModalAlert :key="defaultLayoutStore.alertKey" />
    <PFullLoding :is-full-screen-popup-open="isLoading" />
    <PToast />
  </div>
</template>

<script setup lang="ts">
/**
 * 피치CRM Proto - App.vue
 * Backend API 없이 Mock 데이터로 동작하는 프로토타이핑 환경
 */
import { computed, onMounted, ref, nextTick } from 'vue';
import { useThemeStore } from '@/modules/_common/store/theme.store';
import PModalAlert from '@/modules/_common/components/modal/p-modal-alert.vue';
import PFullLoding from '@/modules/_common/components/layouts/p-full-loding.vue';
import PToast from '@/modules/_common/components/layouts/p-toast.vue';
import { useDefaultLayoutStore } from '@/modules/_common/store/default-layout.store';
import { useRouter } from 'vue-router';

const themeStore = useThemeStore();
const defaultLayoutStore = useDefaultLayoutStore();
const router = useRouter();

const isLoading = computed(() => defaultLayoutStore.isLoading);

// 라우터 준비 상태
const isRouteReady = ref(false);
// 레이아웃 결정 상태
const layoutDecided = ref(false);

// 모든 준비가 완료되었는지 확인
const isFullyReady = computed(() => {
  return isRouteReady.value && layoutDecided.value;
});

onMounted(async () => {
  // 앱 실행 시 라이트 모드로 초기화
  themeStore.initTheme();

  // 라우터가 완전히 준비될 때까지 대기
  await router.isReady();

  // 라우트 메타 정보가 안정화될 때까지 잠시 대기
  await nextTick();

  // 레이아웃 결정 완료
  layoutDecided.value = true;

  // 라우터 준비 완료
  isRouteReady.value = true;

  // Vue 앱이 마운트되면 로딩 화면 숨기기
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }

  console.log('✅ 피치CRM Proto 앱 준비 완료');
});
</script>
