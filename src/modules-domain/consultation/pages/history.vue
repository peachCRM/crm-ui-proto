<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '상담관리' }, { title: '상담 이력' }]"
      title="상담 이력"
    />
  </div>

  <div class="rounded-custom8 dark:bg-black141414 w-full bg-white p-6">
    <!-- 타임라인형 카드 목록 -->
    <div
      ref="scrollContainerRef"
      class="max-h-[70vh] overflow-y-auto"
      @scroll="onScroll"
    >
      <div v-if="historyData.length > 0" class="space-y-4">
        <div
          v-for="item in historyData"
          :key="item.consultationSeq"
          class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-sm text-gray-500">
                {{ item.insertDate }}
              </span>
              <u-badge
                :color="statusColor(item.status)"
                variant="soft"
                size="xs"
              >
                {{ item.consultationType }}
              </u-badge>
            </div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ item.customerName }}
            </div>
            <div class="text-base font-semibold text-gray-800 dark:text-gray-200">
              {{ item.title }}
            </div>
            <div class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {{ contentSummary(item.content) }}
            </div>
            <div class="text-xs text-gray-500">
              상담사: {{ item.counselorName }}
            </div>
          </div>
        </div>

        <!-- 로딩 스피너 -->
        <div v-if="isLoading" class="flex justify-center py-6">
          <u-icon name="i-lucide-loader-2" class="h-8 w-8 animate-spin text-primary" />
        </div>

        <!-- 더 이상 데이터 없음 -->
        <div
          v-if="!historyHasMore && historyData.length > 0 && !isLoading"
          class="py-6 text-center text-sm text-gray-500"
        >
          더 이상 데이터가 없습니다.
        </div>
      </div>

      <!-- 초기 로딩 -->
      <div v-else-if="isLoading && historyData.length === 0" class="py-12 text-center">
        <u-icon name="i-lucide-loader-2" class="mx-auto h-12 w-12 animate-spin text-primary" />
        <p class="mt-2 text-sm text-gray-500">데이터를 불러오는 중...</p>
      </div>

      <!-- 빈 상태 -->
      <div v-else-if="!isLoading && historyData.length === 0" class="py-12 text-center">
        <u-card>
          <div class="text-gray-500">조회된 상담 이력이 없습니다.</div>
        </u-card>
      </div>

      <!-- IntersectionObserver 감지용 요소 -->
      <div
        v-if="historyData.length > 0"
        ref="sentinelRef"
        class="h-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import type { Consultation } from '../type/consultation.type';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';

const consultationStore = useConsultationStore();

const historyData = ref<Consultation[]>([]);
const isLoading = ref(false);
const historyHasMore = ref(true);
const scrollContainerRef = ref<HTMLElement | null>(null);
const sentinelRef = ref<HTMLElement | null>(null);

const LIMIT = 10;

/** 상태별 UBadge 색상 */
const statusColor = (status: string) => {
  const map: Record<string, string> = {
    대기: 'warning',
    진행: 'info',
    완료: 'success',
    취소: 'error'
  };
  return map[status] || 'neutral';
};

/** 내용 요약 (50자) */
const contentSummary = (content: string) => {
  if (!content) return '';
  return content.length > 50 ? content.substring(0, 50) + '...' : content;
};

const loadMore = async () => {
  if (isLoading.value || !historyHasMore.value) return;

  isLoading.value = true;
  try {
    await FormService.loading(async () => {
      await consultationStore.loadMoreHistory(LIMIT);
      historyData.value = [...consultationStore.historyData];
      historyHasMore.value = consultationStore.historyHasMore;
    });
  } finally {
    isLoading.value = false;
  }
};

const onScroll = () => {
  const container = scrollContainerRef.value;
  const sentinel = sentinelRef.value;
  if (!container || !sentinel || isLoading.value || !historyHasMore.value) return;

  const containerRect = container.getBoundingClientRect();
  const sentinelRect = sentinel.getBoundingClientRect();

  if (sentinelRect.top <= containerRect.bottom + 100) {
    loadMore();
  }
};

onMounted(async () => {
  consultationStore.historyDataInit();
  await loadMore();
});

onUnmounted(() => {
  consultationStore.historyDataInit();
});
</script>
