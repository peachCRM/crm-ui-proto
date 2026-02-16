<template>
  <div class="flex flex-col items-center overflow-hidden">
    <!-- 패턴 선택 버튼 -->
    <div class="flex flex-wrap justify-center gap-1 mb-3.5">
      <button
        v-for="(m, i) in topMenus"
        :key="i"
        @click="tIdx = i"
        :class="[
          'px-2.5 py-0.5 text-[10px] rounded-xl cursor-pointer border-none',
          tIdx === i
            ? m.pick
              ? 'bg-[#287dff] text-white font-bold'
              : 'bg-gray-600 text-white'
            : m.pick
              ? 'bg-white text-[#287dff] border-2 border-[#287dff] font-bold'
              : 'bg-white text-gray-500 border border-gray-300'
        ]"
      >
        {{ m.pick ? '⭐ ' : '' }}{{ m.n }}
      </button>
    </div>

    <!-- 0: 클래식 호버 (PICK) -->
    <div
      v-if="tIdx === 0"
      class="w-full bg-white rounded-lg border-2 border-[#287dff] overflow-hidden h-[380px] relative shadow-[0_2px_12px_rgba(40,125,255,0.15)]"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-[#287dff] z-50 pointer-events-none font-bold">
        클래식 호버 드롭다운 ⭐ PICK
      </div>
      <div data-topbar class="h-[42px] bg-[#287dff] flex items-center px-3.5 relative">
        <span class="text-white font-bold text-[13px] mr-5">피치CRM</span>
        <div
          v-for="s in menuData"
          :key="s.id"
          @mouseenter="tpEnter(s.id, $event)"
          @mouseleave="tpLeave"
          class="px-3 h-[42px] flex items-center text-white text-xs cursor-pointer"
          :class="tp.h1 === s.id ? 'bg-white/15' : ''"
        >
          {{ s.title }}
        </div>
      </div>
      <template v-if="tp.h1 && tpSec">
        <div
          @mouseenter="tpKeep"
          @mouseleave="tpLeave"
          class="absolute top-[42px] flex z-20 shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-b-md"
          :style="{ left: tp.dropLeft + 'px' }"
        >
          <div class="bg-white min-w-[150px] border-r border-gray-200 py-[5px] rounded-bl-md">
            <div
              v-for="m in tpSec.menus"
              :key="m.id"
              @mouseenter="tpKeep(); tp.h2 = m.id"
              @click="!m.children?.length && (tp.active = m.name)"
              class="px-3 py-[7px] text-xs cursor-pointer flex justify-between"
              :class="tp.h2 === m.id ? 'bg-[#f0f5ff] text-[#287dff]' : 'text-gray-800'"
            >
              {{ m.name }}
              <span v-if="m.children?.length" class="text-gray-300">›</span>
            </div>
          </div>
          <div
            v-if="tp.h2 && tpMenu?.children?.length"
            class="bg-white min-w-[130px] py-[5px] rounded-br-md"
          >
            <div
              v-for="c in tpMenu.children"
              :key="c.id"
              @click="tp.active = c.name"
              class="px-3 py-[7px] text-xs cursor-pointer"
              :class="tp.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
            >
              {{ c.name }}
            </div>
          </div>
        </div>
      </template>
      <div class="p-3.5 text-[11px] text-gray-400">
        {{ tp.active ? `✓ ${tp.active}` : 'hover → 2차 → 3차 순차 패널' }}
      </div>
    </div>

    <!-- 1: 메가메뉴 -->
    <div
      v-if="tIdx === 1"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        메가메뉴
      </div>
      <div class="h-[42px] bg-[#1a1a2e] flex items-center px-3.5">
        <span class="text-white font-bold text-[13px] mr-5">피치CRM</span>
        <div
          v-for="s in menuData"
          :key="s.id"
          @mouseenter="tmEnter(s.id)"
          @mouseleave="tmLeave"
          class="px-3 h-[42px] flex items-center text-xs cursor-pointer"
          :class="tm.hover === s.id ? 'text-blue-400' : 'text-gray-400'"
        >
          {{ s.title }}
        </div>
      </div>
      <template v-if="tm.hover && tmSec">
        <div
          @mouseenter="tmKeep"
          @mouseleave="tmLeave"
          class="absolute top-[42px] left-0 right-0 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] z-20 p-4 flex gap-5"
        >
          <div v-for="m in tmSec.menus" :key="m.id" class="min-w-[120px]">
            <div class="text-[11px] font-bold text-[#287dff] mb-1.5 border-b-2 border-[#287dff] pb-[3px]">
              {{ m.name }}
            </div>
            <template v-if="m.children?.length">
              <div
                v-for="c in m.children"
                :key="c.id"
                @click="tm.active = c.name"
                class="text-[11px] py-1 cursor-pointer"
                :class="tm.active === c.name ? 'text-[#287dff]' : 'text-gray-500'"
              >
                {{ c.name }}
              </div>
            </template>
            <div v-else @click="tm.active = m.name" class="text-[11px] py-1 cursor-pointer">
              {{ m.name }} →
            </div>
          </div>
        </div>
      </template>
      <div class="p-3.5 text-[11px] text-gray-400">{{ tm.active || '전체 폭 메가 패널' }}</div>
    </div>

    <!-- 2: 리본 -->
    <div
      v-if="tIdx === 2"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        리본 스타일
      </div>
      <div class="h-[34px] bg-[#287dff] flex items-center px-3.5">
        <span class="text-white font-bold text-xs">피치CRM</span>
      </div>
      <div class="flex border-b border-gray-300 bg-gray-50">
        <div
          v-for="(s, i) in menuData"
          :key="s.id"
          @click="trb.tab = i"
          class="px-3.5 py-[7px] text-[11px] cursor-pointer"
          :class="
            trb.tab === i
              ? 'font-bold text-[#287dff] border-b-2 border-[#287dff]'
              : 'text-gray-500 border-b-2 border-transparent'
          "
        >
          {{ s.title }}
        </div>
      </div>
      <div class="flex gap-3 px-3.5 py-2 border-b border-gray-200">
        <div
          v-for="m in menuData[trb.tab]?.menus"
          :key="m.id"
          class="flex flex-col gap-[3px] px-1.5 border-r border-gray-100"
        >
          <div class="text-[9px] text-gray-400 font-semibold">{{ m.name }}</div>
          <div class="flex gap-[3px] flex-wrap">
            <template v-if="m.children?.length">
              <div
                v-for="c in m.children"
                :key="c.id"
                @click="trb.active = c.name"
                class="px-2 py-[3px] text-[10px] rounded-[3px] cursor-pointer"
                :class="trb.active === c.name ? 'bg-[#287dff] text-white' : 'bg-gray-100 text-gray-500'"
              >
                {{ c.name }}
              </div>
            </template>
            <div
              v-else
              @click="trb.active = m.name"
              class="px-2 py-[3px] text-[10px] bg-gray-100 rounded-[3px] cursor-pointer"
            >
              {{ m.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ trb.active || '탭 → 리본 툴바' }}</div>
    </div>

    <!-- 3: 2단 내비 (Top2Row) -->
    <div
      v-if="tIdx === 3"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        2단 내비
      </div>
      <!-- 1행: 탭 -->
      <div class="h-[38px] bg-[#287dff] flex items-center px-3.5">
        <span class="text-white font-bold text-xs mr-5">피치CRM</span>
        <div
          v-for="(s, i) in menuData"
          :key="s.id"
          @click="t2r.tab = i"
          class="px-2.5 h-[38px] flex items-center text-white text-[11px] cursor-pointer rounded-t-[5px]"
          :class="t2r.tab === i ? 'bg-white/20' : ''"
        >
          {{ s.icon }} {{ s.title }}
        </div>
      </div>
      <!-- 2행: 서브메뉴 (flat) -->
      <div class="h-[30px] bg-[#f8f9fa] flex items-center px-3.5 gap-[3px] border-b border-gray-200">
        <div
          v-for="c in t2rFlatItems"
          :key="c.id"
          @click="t2r.active = c.name"
          class="px-2.5 py-[3px] text-[10px] cursor-pointer rounded-[3px]"
          :class="
            t2r.active === c.name
              ? 'text-[#287dff] font-semibold bg-[#e8f0fe]'
              : 'text-gray-600'
          "
        >
          {{ c.name }}
        </div>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ t2r.active || '1차 탭 → 2줄째 서브' }}</div>
    </div>

    <!-- 4: 커맨드바 (TopCmd) -->
    <div
      v-if="tIdx === 4"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        커맨드바
      </div>
      <div class="h-[42px] bg-[#287dff] flex items-center px-3.5 gap-2.5">
        <span class="text-white font-bold text-xs">피치CRM</span>
        <div class="flex-1 max-w-[320px] relative">
          <input
            v-model="tcmd.q"
            type="text"
            placeholder="검색... (⌘K)"
            class="w-full px-2.5 py-1.5 rounded-[5px] border-none text-[11px] bg-white/20 text-white outline-none box-border placeholder:text-white/70"
            @focus="tcmd.focus = true"
            @blur="tcmdBlur"
          />
          <div
            v-if="tcmd.focus"
            class="absolute top-[30px] left-0 right-0 bg-white rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.15)] max-h-[220px] overflow-y-auto z-30"
          >
            <div
              v-for="c in tcmdFiltered"
              :key="c.id"
              class="px-3 py-[7px] text-[11px] cursor-pointer border-b border-gray-100"
              @mousedown="tcmd.active = c.name"
            >
              <span class="text-[9px] text-gray-400">{{ c.path }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ tcmd.active || '검색 통합 네비' }}</div>
    </div>

    <!-- 5: 탭+드롭 (TopTab) -->
    <div
      v-if="tIdx === 5"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        탭+드롭다운
      </div>
      <div class="h-[42px] bg-white flex items-center px-3.5 border-b border-gray-200">
        <span class="font-bold text-[13px] text-[#287dff] mr-5">피치CRM</span>
        <div
          v-for="(s, i) in menuData"
          :key="s.id"
          @mouseenter="ttabEnter(s.id, i)"
          @mouseleave="ttabLeave"
          class="px-3 h-[42px] flex items-center text-[11px] cursor-pointer relative"
          :class="
            ttab.tab === i
              ? 'text-[#287dff] font-semibold border-b-2 border-[#287dff]'
              : 'text-gray-600 border-b-2 border-transparent'
          "
        >
          {{ s.title }}
          <!-- 호버 시 드롭다운 -->
          <div
            v-if="ttab.hover === s.id"
            @mouseenter="ttabKeep(s.id)"
            @mouseleave="ttabLeave"
            class="absolute top-[42px] left-0 bg-white min-w-[160px] shadow-[0_4px_14px_rgba(0,0,0,0.1)] rounded-b-md z-20 py-[5px]"
          >
            <template v-for="m in s.menus" :key="m.id">
              <div class="text-[9px] text-gray-400 font-semibold px-3 py-[3px]">{{ m.name }}</div>
              <template v-if="m.children?.length">
                <div
                  v-for="c in m.children"
                  :key="c.id"
                  @click="ttab.active = c.name"
                  class="pl-5 pr-3 py-1.5 text-[11px] cursor-pointer"
                  :class="ttab.active === c.name ? 'text-[#287dff]' : 'text-gray-700'"
                >
                  {{ c.name }}
                </div>
              </template>
              <div
                v-else
                @click="ttab.active = m.name"
                class="pl-5 pr-3 py-1.5 text-[11px] cursor-pointer"
              >
                {{ m.name }} →
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ ttab.active || '탭 hover → 드롭다운' }}</div>
    </div>

    <!-- 6: 슬라이딩 (TopSlide) -->
    <div
      v-if="tIdx === 6"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        슬라이딩 패널
      </div>
      <div class="h-[42px] bg-[#111827] flex items-center px-3.5">
        <span class="text-white font-bold text-xs mr-5">피치CRM</span>
        <div
          v-for="s in menuData"
          :key="s.id"
          @click="tslide.open = tslide.open === s.id ? null : s.id"
          class="px-2.5 h-[42px] flex items-center text-[11px] cursor-pointer"
          :class="tslide.open === s.id ? 'text-blue-400' : 'text-gray-400'"
        >
          {{ s.title }}
          <span class="text-[7px] ml-[3px]">{{ tslide.open === s.id ? '▲' : '▼' }}</span>
        </div>
      </div>
      <!-- 클릭 시 하방 패널 -->
      <template v-if="tslide.open && tslideSec">
        <div class="bg-[#f8fafc] border-b border-gray-200 p-2.5 px-3.5 flex gap-6">
          <div v-for="m in tslideSec.menus" :key="m.id">
            <div class="text-[10px] font-bold text-gray-500 mb-1.5">{{ m.name }}</div>
            <template v-if="m.children?.length">
              <div
                v-for="c in m.children"
                :key="c.id"
                @click="tslide.active = c.name"
                class="py-[3px] text-[11px] cursor-pointer"
                :class="tslide.active === c.name ? 'text-[#287dff]' : 'text-gray-600'"
              >
                {{ c.name }}
              </div>
            </template>
            <div v-else @click="tslide.active = m.name" class="py-[3px] text-[11px] cursor-pointer">
              {{ m.name }} →
            </div>
          </div>
        </div>
      </template>
      <div class="p-3.5 text-[11px] text-gray-400">{{ tslide.active || '클릭 → 하방 패널' }}</div>
    </div>

    <!-- 7: 브레드크럼 (TopBread) -->
    <div
      v-if="tIdx === 7"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        브레드크럼 체인
      </div>
      <div class="h-[42px] bg-[#287dff] flex items-center px-3.5">
        <span class="text-white font-bold text-xs">피치CRM</span>
      </div>
      <div class="h-8 bg-[#f9fafb] flex items-center px-3.5 gap-1 border-b border-gray-200">
        <!-- 1단: 섹션 -->
        <div class="relative">
          <div
            @click="tbread.d1 = !tbread.d1; tbread.d2 = false; tbread.d3 = false"
            class="px-2 py-[3px] text-[11px] bg-[#e8f0fe] rounded-[3px] cursor-pointer text-[#287dff] font-semibold"
          >
            {{ tbread.s1.title }} ▾
          </div>
          <div
            v-if="tbread.d1"
            class="absolute top-[26px] left-0 bg-white rounded-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-20 min-w-[100px] py-[3px]"
          >
            <div
              v-for="s in menuData"
              :key="s.id"
              @click="
                tbread.s1 = s;
                tbread.s2 = s.menus[0];
                tbread.s3 = null;
                tbread.d1 = false
              "
              class="px-2.5 py-1.5 text-[11px] cursor-pointer"
              :class="tbread.s1.id === s.id ? 'text-[#287dff]' : 'text-gray-800'"
            >
              {{ s.title }}
            </div>
          </div>
        </div>
        <span class="text-gray-300 text-[11px]">/</span>
        <!-- 2단: 메뉴 -->
        <div class="relative">
          <div
            @click="tbread.d2 = !tbread.d2; tbread.d1 = false; tbread.d3 = false"
            class="px-2 py-[3px] text-[11px] bg-gray-100 rounded-[3px] cursor-pointer"
          >
            {{ tbread.s2?.name }} ▾
          </div>
          <div
            v-if="tbread.d2"
            class="absolute top-[26px] left-0 bg-white rounded-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-20 min-w-[100px] py-[3px]"
          >
            <div
              v-for="m in tbread.s1?.menus"
              :key="m.id"
              @click="
                tbread.s2 = m;
                tbread.s3 = null;
                tbread.d2 = false
              "
              class="px-2.5 py-1.5 text-[11px] cursor-pointer"
            >
              {{ m.name }}
            </div>
          </div>
        </div>
        <!-- 3단: 차일드 (s2.children 있을 때만) -->
        <template v-if="tbread.s2?.children?.length">
          <span class="text-gray-300 text-[11px]">/</span>
          <div class="relative">
            <div
              @click="tbread.d3 = !tbread.d3; tbread.d1 = false; tbread.d2 = false"
              class="px-2 py-[3px] text-[11px] bg-gray-100 rounded-[3px] cursor-pointer"
            >
              {{ tbread.s3?.name || '선택...' }} ▾
            </div>
            <div
              v-if="tbread.d3"
              class="absolute top-[26px] left-0 bg-white rounded-[5px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-20 min-w-[100px] py-[3px]"
            >
              <div
                v-for="c in tbread.s2.children"
                :key="c.id"
                @click="
                  tbread.s3 = c;
                  tbread.active = c.name;
                  tbread.d3 = false
                "
                class="px-2.5 py-1.5 text-[11px] cursor-pointer"
                :class="tbread.s3?.id === c.id ? 'text-[#287dff]' : 'text-gray-800'"
              >
                {{ c.name }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ tbread.active || '단계별 드롭다운 셀렉터' }}</div>
    </div>

    <!-- 8: 인라인 (TopInline) -->
    <div
      v-if="tIdx === 8"
      class="w-full bg-white rounded-lg border border-gray-200 overflow-hidden h-[380px] relative"
    >
      <div class="absolute top-[5px] right-2 text-[9px] text-gray-400 z-50 pointer-events-none">
        인라인 토글
      </div>
      <div class="h-[42px] bg-[#287dff] flex items-center px-3.5">
        <span class="text-white font-bold text-xs">피치CRM</span>
      </div>
      <div class="border-b border-gray-200">
        <div class="flex bg-[#fafafa]">
          <div
            v-for="s in menuData"
            :key="s.id"
            @click="tinline.expand = tinline.expand === s.id ? null : s.id"
            class="px-3 py-2 text-[11px] cursor-pointer"
            :class="[
              tinline.expand === s.id ? 'text-[#287dff] font-bold bg-white border-b-2 border-[#287dff]' : 'text-gray-600'
            ]"
          >
            {{ s.title }}
          </div>
        </div>
        <!-- 확장 패널 -->
        <div
          v-if="tinline.expand && tinlineSec"
          class="p-1.5 px-3.5 bg-white flex gap-4"
        >
          <div
            v-for="m in tinlineSec.menus"
            :key="m.id"
            class="flex items-center gap-1.5"
          >
            <span class="text-[9px] text-gray-400">{{ m.name }}:</span>
            <template v-if="m.children?.length">
              <span
                v-for="c in m.children"
                :key="c.id"
                @click="tinline.active = c.name"
                class="px-[7px] py-0.5 text-[10px] rounded-[3px] cursor-pointer"
                :class="tinline.active === c.name ? 'bg-[#287dff] text-white' : 'bg-gray-100 text-gray-600'"
              >
                {{ c.name }}
              </span>
            </template>
            <span
              v-else
              @click="tinline.active = m.name"
              class="px-[7px] py-0.5 text-[10px] bg-gray-100 rounded-[3px] cursor-pointer"
            >
              {{ m.name }}
            </span>
          </div>
        </div>
      </div>
      <div class="p-3.5 text-[11px] text-gray-400">{{ tinline.active || '탭 → 인라인 확장' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { menuData } from './menu-data';
import type { MenuSection, MenuItem } from './menu-data';

// ── 상단 메뉴 패턴 메타 ──
const topMenus = [
  { n: '클래식 호버', pick: true },
  { n: '메가메뉴' },
  { n: '리본' },
  { n: '2단 내비' },
  { n: '커맨드바' },
  { n: '탭+드롭' },
  { n: '슬라이딩' },
  { n: '브레드크럼' },
  { n: '인라인' },
];

// 패턴 인덱스 (내부 state)
const tIdx = ref(0);

// ── 0: 클래식 호버 (PICK) ──
const tp = reactive<{
  h1: number | null;
  h2: number | null;
  active: string | null;
  dropLeft: number;
}>({ h1: null, h2: null, active: null, dropLeft: 0 });
let tpTimer: ReturnType<typeof setTimeout> | null = null;

const tpSec = computed(() => menuData.find(s => s.id === tp.h1));
const tpMenu = computed(() =>
  tpSec.value?.menus.find(m => m.id === tp.h2)
);

function tpEnter(id: number, event: MouseEvent) {
  if (tpTimer) clearTimeout(tpTimer);
  tp.h1 = id;
  tp.h2 = null;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const parent = target.closest('[data-topbar]')?.getBoundingClientRect();
  tp.dropLeft = rect.left - (parent?.left ?? 0);
}
function tpKeep() {
  if (tpTimer) clearTimeout(tpTimer);
}
function tpLeave() {
  tpTimer = setTimeout(() => {
    tp.h1 = null;
    tp.h2 = null;
  }, 150);
}

// ── 1: 메가메뉴 ──
const tm = reactive<{ hover: number | null; active: string | null }>({
  hover: null,
  active: null,
});
let tmTimer: ReturnType<typeof setTimeout> | null = null;
const tmSec = computed(() => menuData.find(s => s.id === tm.hover));

function tmEnter(id: number) {
  if (tmTimer) clearTimeout(tmTimer);
  tm.hover = id;
}
function tmKeep() {
  if (tmTimer) clearTimeout(tmTimer);
}
function tmLeave() {
  tmTimer = setTimeout(() => {
    tm.hover = null;
  }, 150);
}

// ── 2: 리본 ──
const trb = reactive<{ tab: number; active: string | null }>({ tab: 0, active: null });

// ── 3: 2단 내비 (Top2Row) ──
const t2r = reactive<{ tab: number; active: string | null }>({ tab: 0, active: null });

const t2rFlatItems = computed(() => {
  const sec = menuData[t2r.tab];
  if (!sec) return [];
  return sec.menus.flatMap(m =>
    m.children?.length ? m.children : [m]
  );
});

// ── 4: 커맨드바 (TopCmd) ──
const tcmd = reactive<{ q: string; focus: boolean; active: string | null }>({
  q: '',
  focus: false,
  active: null,
});

const tcmdAll = computed(() =>
  menuData.flatMap(s =>
    s.menus.flatMap(m =>
      m.children?.length
        ? m.children.map(c => ({
            ...c,
            path: `${s.title} > ${m.name} > ${c.name}`,
          }))
        : [{ ...m, path: `${s.title} > ${m.name}` }]
    )
  )
);

const tcmdFiltered = computed(() =>
  tcmd.q ? tcmdAll.value.filter(x => x.path.includes(tcmd.q)) : tcmdAll.value
);

let tcmdBlurTimer: ReturnType<typeof setTimeout> | null = null;
function tcmdBlur() {
  tcmdBlurTimer = setTimeout(() => {
    tcmd.focus = false;
  }, 200);
}

// ── 5: 탭+드롭 (TopTab) ──
const ttab = reactive<{
  tab: number;
  hover: number | null;
  active: string | null;
}>({ tab: 0, hover: null, active: null });
let ttabTimer: ReturnType<typeof setTimeout> | null = null;

function ttabEnter(id: number, i: number) {
  if (ttabTimer) clearTimeout(ttabTimer);
  ttab.tab = i;
  ttab.hover = id;
}
function ttabKeep(id: number) {
  if (ttabTimer) clearTimeout(ttabTimer);
  ttab.hover = id;
}
function ttabLeave() {
  ttabTimer = setTimeout(() => {
    ttab.hover = null;
  }, 150);
}

// ── 6: 슬라이딩 (TopSlide) ──
const tslide = reactive<{
  open: number | null;
  active: string | null;
}>({ open: null, active: null });

const tslideSec = computed(() =>
  tslide.open ? menuData.find(s => s.id === tslide.open) : null
);

// ── 7: 브레드크럼 (TopBread) ──
const tbread = reactive<{
  d1: boolean;
  d2: boolean;
  d3: boolean;
  s1: MenuSection;
  s2: MenuItem;
  s3: { id: number; name: string } | null;
  active: string | null;
}>({
  d1: false,
  d2: false,
  d3: false,
  s1: menuData[0],
  s2: menuData[0].menus[0],
  s3: null,
  active: null,
});

// ── 8: 인라인 (TopInline) ──
const tinline = reactive<{
  expand: number | null;
  active: string | null;
}>({ expand: null, active: null });

const tinlineSec = computed(() =>
  tinline.expand ? menuData.find(s => s.id === tinline.expand) : null
);
</script>
