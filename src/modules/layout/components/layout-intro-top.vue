<template>
  <!-- 메인 헤더 -->
  <header
    :class="[
      'sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300',
      'bg-white/95 border-slate-200/60',
      'shadow-sm shadow-slate-900/5'
    ]"
  >
    <div class="max-w-screen-xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
      <!-- 좌측 브랜드 로고 영역 -->
      <router-link to="/" class="group flex items-center gap-3 transition-all duration-300 ease-out">
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
          <span class="text-lg font-bold text-slate-800 leading-tight">피치CRM</span>
          <span class="text-[10px] text-slate-400 leading-tight">Business Platform</span>
        </div>
      </router-link>

      <!-- 중간 메뉴 영역 (데스크톱) -->
      <nav class="hidden md:flex items-center gap-1">
        <a
          href="#"
          @click.prevent="scrollToSection('features')"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            'text-slate-600 hover:text-[#287dff] hover:bg-blue-50'
          ]"
        >
          기능 소개
        </a>
        <a
          href="#"
          @click.prevent="scrollToSection('contact')"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            'text-slate-600 hover:text-[#287dff] hover:bg-blue-50'
          ]"
        >
          상담 문의
        </a>
      </nav>

      <!-- 우측 메뉴 영역 -->
      <div class="flex items-center gap-2">
        <!-- 스페이스 선택 버튼 -->
        <router-link
          to="/space"
          :class="[
            'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
            'bg-[#287dff] hover:bg-[#1a6ae6] text-white shadow-sm'
          ]"
        >
          <UIcon name="i-lucide-layout-grid" class="w-4 h-4" />
          <span>시작하기</span>
        </router-link>

        <!-- 모바일 메뉴 버튼 -->
        <button
          @click="mobileMenuOpen = true"
          :class="[
            'md:hidden p-2 rounded-xl transition-all duration-200',
            'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          ]"
        >
          <UIcon name="i-lucide-menu" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </header>

  <!-- 모바일 메뉴 슬라이드오버 -->
  <USlideover v-model:open="mobileMenuOpen" side="left" :ui="{ width: 'w-[300px]' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
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
          <span class="text-lg font-semibold">피치CRM</span>
        </div>
        <button
          class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          @click="mobileMenuOpen = false"
        >
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="py-4">
        <div class="mb-4">
          <div class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            메뉴
          </div>
          <div class="px-2">
            <a
              href="#"
              @click.prevent="scrollToSection('features'); mobileMenuOpen = false;"
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 text-slate-700"
            >
              <UIcon name="i-lucide-sparkles" class="w-4 h-4" />
              기능 소개
            </a>
            <a
              href="#"
              @click.prevent="scrollToSection('contact'); mobileMenuOpen = false;"
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 text-slate-700"
            >
              <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
              상담 문의
            </a>
          </div>
        </div>

        <div class="border-t border-slate-100 pt-4 px-2">
          <router-link
            to="/space"
            class="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-[#287dff] text-white w-full justify-center"
            @click="mobileMenuOpen = false"
          >
            <UIcon name="i-lucide-layout-grid" class="w-4 h-4" />
            시작하기
          </router-link>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { nextTick } from 'vue';

const router = useRouter();
const route = useRoute();

const mobileMenuOpen = ref(false);

const scrollToSection = async (id: string) => {
  if (route.path !== '/') {
    await router.push({ path: '/', query: { scrollTo: id } });
    await nextTick();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  } else {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
</script>
