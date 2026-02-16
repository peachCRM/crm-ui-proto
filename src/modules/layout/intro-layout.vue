<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- 상단 헤더 -->
    <layout-intro-top />

    <!-- 메인 콘텐츠 -->
    <main class="flex-1 w-full min-w-0 overflow-x-hidden">
      <router-view />
    </main>

    <!-- 푸터 -->
    <footer
      :class="[
        'border-t py-6 text-center text-sm',
        'bg-slate-50 border-slate-200 text-slate-400'
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span>&copy; {{ currentYear }} 피치CRM. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import LayoutIntroTop from './components/layout-intro-top.vue';

const currentYear = new Date().getFullYear();
</script>
