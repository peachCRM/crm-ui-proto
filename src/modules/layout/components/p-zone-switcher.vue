<template>
  <!-- Floating Dock: 하단 중앙 고정, 3개 영역 전환 -->
  <div
    :class="[
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
      'flex items-center gap-1 px-2 py-1.5',
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg',
      'border border-gray-200/50 dark:border-gray-700/50',
      'rounded-full shadow-lg'
    ]"
  >
    <button
      v-for="zone in zones"
      :key="zone.id"
      :class="[
        'relative flex flex-col items-center justify-center gap-0.5',
        'w-12 h-12 rounded-full transition-all duration-200',
        currentZone === zone.id
          ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      ]"
      :title="zone.label"
      @click="navigateToZone(zone)"
    >
      <UIcon :name="zone.icon" class="w-5 h-5" />
      <!-- 활성 zone dot 인디케이터 -->
      <span
        :class="[
          'w-1 h-1 rounded-full transition-all duration-200',
          currentZone === zone.id
            ? 'bg-[#287dff] dark:bg-blue-400'
            : 'bg-transparent'
        ]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

/** Zone 목록 정의 */
const zones: ZoneItem[] = [
  {
    id: 'intro',
    label: '홍보 사이트',
    icon: 'i-lucide-globe',
    path: '/'
  },
  {
    id: 'workspace',
    label: '워크스페이스',
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
