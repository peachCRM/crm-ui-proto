<template>
  <div class="min-w-[1200px]">
    <!-- 헤더 -->
    <header
      :class="[
        'fixed top-0 left-0 right-0 z-50 h-16',
        'bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-gray-800',
        'flex items-center justify-between px-6'
      ]"
    >
      <div class="flex items-center gap-3">
        <!-- 브랜드 로고 영역 -->
        <div class="flex items-center justify-center w-9 h-9 bg-[#287dff] rounded-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">피치CRM</h1>
          <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">Business Platform</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UBadge color="info" variant="soft">가이드</UBadge>
      </div>
    </header>

    <div class="bg-bodyBg mt-16 duration-200 dark:bg-black">
      <!-- 좌측 메뉴 -->
      <left-menu @menu-toggle="handleMenuToggle" />

      <main ref="contentRef" :class="['h-full', isMenuHidden ? 'ps-[60px]' : 'ps-[186px]']">
        <div id="work_inner" class="h-full">
          <div class="px-8 py-6">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LeftMenu from '../left-menu/components/left-menu.vue';

const contentRef = ref<HTMLElement | null>(null);

// 메뉴 상태 관리
const isMenuHidden = ref(window.innerWidth < 1440);

// 메뉴 토글 핸들러
const handleMenuToggle = (menuHidden: boolean) => {
  isMenuHidden.value = menuHidden;
};
</script>
