<template>
  <div class="min-w-[1200px]">
    <!-- 헤더 - purple-blue gradient (itax-layout.vue와 동일) -->
    <header
      :class="[
        'fixed top-0 left-0 right-0 z-50 h-16',
        'bg-gradient-to-r from-purple-600 to-blue-600',
        'flex items-center justify-between px-6 shadow-md'
      ]"
    >
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-9 h-9 bg-white/20 rounded-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-white leading-tight">피치CRM</h1>
          <span class="text-xs text-white/70 leading-tight">Business Platform</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-white/80">Mock 모드</span>
        <UBadge color="success" variant="soft">활성</UBadge>
      </div>
    </header>

    <div class="bg-bodyBg mt-16 duration-200 dark:bg-black">
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
