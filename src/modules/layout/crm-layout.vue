<template>
  <div class="min-h-screen">
    <!-- CRM 헤더 -->
    <header
      :class="[
        'fixed top-0 left-0 right-0 z-50 h-[58px]',
        'bg-white dark:bg-black141414 border-b border-[#eef0f4] dark:border-gray-800'
      ]"
    >
      <!-- 데스크톱 상단 3-depth 메뉴 (lg 이상) -->
      <layout-crm-top
        :current-space-name="currentSpaceName"
        :space-type-label="spaceTypeLabel"
        :space-type-badge-color="spaceTypeBadgeColor"
      />

      <!-- 모바일 헤더 (lg 미만) -->
      <div class="lg:hidden flex items-center justify-between h-[58px] px-4">
        <!-- 브랜드 로고 -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="flex items-center justify-center w-8 h-8 bg-[#287dff] rounded-lg">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-[#1e293b] dark:text-white leading-tight">피치CRM</span>
          </div>
        </router-link>

        <!-- 스페이스 정보 + 햄버거 -->
        <div class="flex items-center gap-2">
          <UBadge :color="spaceTypeBadgeColor" variant="soft" size="xs">
            {{ spaceTypeLabel }}
          </UBadge>
          <!-- 모바일 메뉴 트리거 -->
          <layout-crm-mobile-menu
            :current-space-name="currentSpaceName"
            :space-type-label="spaceTypeLabel"
          />
        </div>
      </div>
    </header>

    <!-- 콘텐츠 영역 -->
    <div class="bg-[#f4f6f9] mt-[58px] duration-200 dark:bg-black">
      <!-- 좌측 메뉴 (데스크톱에서만 표시) -->
      <div class="hidden lg:block">
        <left-menu @menu-toggle="handleMenuToggle" />
      </div>

      <!-- 메인 콘텐츠 -->
      <main
        ref="contentRef"
        :class="[
          'min-h-screen bg-white transition-all duration-200',
          isDesktop ? (isMenuHidden ? 'lg:ps-16' : 'lg:ps-[264px]') : ''
        ]"
      >
        <div id="work_inner" class="h-full">
          <div class="px-4 py-4 lg:px-8 lg:py-6">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LeftMenu from '../left-menu/components/left-menu.vue';
import LayoutCrmTop from './components/layout-crm-top.vue';
import LayoutCrmMobileMenu from './components/layout-crm-mobile-menu.vue';
import { useSpaceStore } from '@/modules/space/store/space.store';

const spaceStore = useSpaceStore();
const contentRef = ref<HTMLElement | null>(null);

// 반응형 상태
const isDesktop = ref(window.innerWidth >= 1024);
const isMenuHidden = ref(window.innerWidth < 1440);

// 화면 크기 변경 감지
const handleResize = (): void => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 현재 스페이스 정보
const currentSpaceName = computed(() => spaceStore.currentSpace?.spaceName || '워크스페이스');

const spaceTypeLabel = computed(() => {
  const type = spaceStore.currentSpace?.spaceType || 'basic';
  const labels: Record<string, string> = {
    basic: '기본 CRM',
    pilates: '필라테스',
    realestate: '부동산'
  };
  return labels[type] || '기본 CRM';
});

const spaceTypeBadgeColor = computed(() => {
  const type = spaceStore.currentSpace?.spaceType || 'basic';
  const colors: Record<string, string> = {
    basic: 'primary',
    pilates: 'success',
    realestate: 'warning'
  };
  return colors[type] || 'primary';
});

// 메뉴 토글 핸들러
const handleMenuToggle = (menuHidden: boolean) => {
  isMenuHidden.value = menuHidden;
};
</script>
