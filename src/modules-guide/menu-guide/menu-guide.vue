<template>
  <div class="bg-gray-100 font-sans">
    <!-- 헤더 -->
    <div class="bg-white border-b border-gray-200 py-3.5">
      <div class="max-w-[960px] mx-auto px-4">
        <h1 class="text-base font-extrabold text-center">피치CRM 3-Depth 메뉴 시스템 쇼케이스</h1>
        <p class="text-[10px] text-gray-400 text-center mt-1 mb-2.5">PRD 기반 · PICK 표시 = 채택 패턴</p>
        <div class="flex justify-center gap-1.5">
          <button
            v-for="s in sections" :key="s.id"
            @click="section = s.id"
            :class="[
              'px-4 py-1.5 text-xs rounded-full cursor-pointer border-none',
              section === s.id ? 'bg-[#287dff] text-white font-bold' : 'bg-gray-100 text-gray-500'
            ]"
          >{{ s.label }} ({{ s.count }})</button>
        </div>
      </div>
    </div>

    <div class="max-w-[960px] mx-auto px-4 py-4 pb-10">
      <!-- 모바일 섹션 -->
      <MenuMobile v-if="section === 'mobile'" />

      <!-- 상단 메뉴 섹션 -->
      <MenuTop v-else-if="section === 'top'" />

      <!-- 좌측 메뉴 섹션 -->
      <MenuLeft v-else-if="section === 'left'" />

      <!-- PICK 채택 패턴 요약 -->
      <div class="mt-5 bg-white rounded-lg p-3.5 text-[11px] leading-[1.7]">
        <div class="font-bold text-[13px] mb-2 text-[#287dff]">⭐ PICK 채택 패턴 요약</div>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-[#f0f5ff] rounded-lg p-2.5 border border-[#d0e0ff]">
            <div class="font-bold text-[11px] text-[#287dff] mb-1">📱 모바일</div>
            <div class="font-bold">탭 + 패널 분리</div>
            <div class="text-gray-500 text-[10px]">좌측 아이콘 탭으로 섹션 전환, 우측 콘텐츠 패널에서 2차/3차 아코디언</div>
          </div>
          <div class="bg-[#f0f5ff] rounded-lg p-2.5 border border-[#d0e0ff]">
            <div class="font-bold text-[11px] text-[#287dff] mb-1">🖥️ 상단 메뉴</div>
            <div class="font-bold">클래식 호버 드롭다운</div>
            <div class="text-gray-500 text-[10px]">mouseenter/leave 기반 1차→2차→3차 순차 패널. PRD 기본 패턴</div>
          </div>
          <div class="bg-[#f0f5ff] rounded-lg p-2.5 border border-[#d0e0ff]">
            <div class="font-bold text-[11px] text-[#287dff] mb-1">📐 좌측 메뉴</div>
            <div class="font-bold">Notion 스타일</div>
            <div class="text-gray-500 text-[10px]">인덴트 + 삼각형 토글. 미니멀 문서 탐색기 스타일</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuMobile from './menu-guide-mobile.vue';
import MenuTop from './menu-guide-top.vue';
import MenuLeft from './menu-guide-left.vue';

// 섹션 전환
const section = ref<'mobile' | 'top' | 'left'>('mobile');

const sections = [
  { id: 'mobile' as const, label: '📱 모바일', count: 10 },
  { id: 'top' as const, label: '🔝 상단', count: 9 },
  { id: 'left' as const, label: '◀ 좌측', count: 9 },
];
</script>
