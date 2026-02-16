<template>
  <!-- Floating Dock: 하단 중앙 고정, 3개 영역 전환 -->
  <div
    :class="[
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
      'flex items-center gap-0.5 px-1.5 py-1.5',
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg',
      'border border-gray-200/50 dark:border-gray-700/50',
      'rounded-full shadow-lg'
    ]"
  >
    <button
      v-for="zone in zones"
      :key="zone.id"
      :class="[
        'relative flex items-center gap-1.5 rounded-full transition-all duration-200',
        currentZone === zone.id
          ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-4 py-2'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2'
      ]"
      @mouseenter="hoveredZone = zone.id"
      @mouseleave="hoveredZone = ''"
      @click="navigateToZone(zone)"
    >
      <UIcon :name="zone.icon" class="w-5 h-5 shrink-0" />

      <!-- 활성 zone: 항상 라벨 표시 -->
      <span
        v-if="currentZone === zone.id"
        class="text-xs font-semibold whitespace-nowrap"
      >
        {{ zone.label }}
      </span>

      <!-- 비활성 zone: 호버 시 툴팁 표시 -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <span
          v-if="hoveredZone === zone.id && currentZone !== zone.id"
          :class="[
            'absolute -top-9 left-1/2 -translate-x-1/2',
            'px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap',
            'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
            'shadow-sm pointer-events-none'
          ]"
        >
          {{ zone.label }}
        </span>
      </Transition>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

/** Zone 타입 정의 */
type ZoneType = 'intro' | 'workspace' | 'guide';

interface ZoneItem {
  id: ZoneType;
  label: string;
  icon: string;
  path: string;
}

const router = useRouter();
const route = useRoute();

/** 호버 상태 */
const hoveredZone = ref<string>('');

/** Zone 목록 정의 */
const zones: ZoneItem[] = [
  {
    id: 'intro',
    label: '홍보',
    icon: 'i-lucide-globe',
    path: '/'
  },
  {
    id: 'workspace',
    label: 'CRM',
    icon: 'i-lucide-layout-grid',
    path: '/space'
  },
  {
    id: 'guide',
    label: '가이드',
    icon: 'i-lucide-book-open',
    path: '/guide/pattern/crud/list'
  }
];

/** route.path 기반으로 현재 Zone 자동 감지 */
const currentZone = computed<ZoneType>(() => {
  const path = route.path;
  if (path.startsWith('/guide')) return 'guide';
  if (path.startsWith('/customer') || path.startsWith('/space')) return 'workspace';
  return 'intro';
});

/** Zone 전환 네비게이션 */
const navigateToZone = (zone: ZoneItem): void => {
  if (zone.id !== currentZone.value) {
    router.push(zone.path);
  }
};
</script>
