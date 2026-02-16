<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '통계/분석' }, { title: 'AI 리포트' }, { title: '상세' }]"
      title="AI 리포트 상세"
      :show-work-btn="false"
    />
  </div>

  <div v-if="detailData.reportSeq" class="space-y-6">
    <!-- 상단 카드: 제목 + 유형 + 생성일 + 상태 -->
    <u-card>
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ detailData.title }}
          </h2>
          <div class="flex flex-wrap items-center gap-2">
            <u-badge
              :color="reportTypeColor(detailData.reportType)"
              variant="subtle"
              size="sm"
            >
              {{ detailData.reportType }}
            </u-badge>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              생성일: {{ formatDate(detailData.generatedDate) }}
            </span>
            <u-badge
              :color="statusColor(detailData.status)"
              variant="subtle"
              size="sm"
            >
              {{ detailData.status }}
            </u-badge>
          </div>
        </div>
        <u-button color="primary" variant="outline" icon="i-lucide-arrow-left" @click="goList">
          목록으로
        </u-button>
      </div>
    </u-card>

    <!-- 요약 섹션 -->
    <u-card>
      <div class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">AI 요약</div>
      <div
        class="rounded-lg bg-gray-100 p-4 text-base leading-relaxed text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      >
        {{ detailData.summary || '요약 내용이 없습니다.' }}
      </div>
    </u-card>

    <!-- 주요 인사이트 섹션 -->
    <u-card v-if="detailData.insights && detailData.insights.length > 0">
      <div class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">주요 인사이트</div>
      <ul class="space-y-2">
        <li
          v-for="(insight, index) in detailData.insights"
          :key="index"
          class="flex items-start gap-2"
        >
          <UIcon name="i-lucide-check-circle" class="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <span class="text-gray-700 dark:text-gray-300">{{ index + 1 }}. {{ insight }}</span>
        </li>
      </ul>
    </u-card>

    <!-- 추천 사항 섹션 -->
    <u-card v-if="detailData.recommendations && detailData.recommendations.length > 0">
      <div class="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">추천 사항</div>
      <ul class="space-y-2">
        <li
          v-for="(rec, index) in detailData.recommendations"
          :key="index"
          class="flex items-start gap-2"
        >
          <UIcon name="i-lucide-arrow-right" class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span class="text-gray-700 dark:text-gray-300">{{ rec }}</span>
        </li>
      </ul>
    </u-card>

    <!-- 하단 버튼 -->
    <div class="flex justify-end">
      <u-button color="primary" variant="outline" icon="i-lucide-arrow-left" @click="goList">
        목록으로
      </u-button>
    </div>
  </div>

  <div v-else class="py-12 text-center">
    <u-card>
      <div class="text-gray-500 dark:text-gray-400">리포트를 찾을 수 없습니다.</div>
      <u-button color="primary" variant="soft" class="mt-4" @click="goList">목록으로</u-button>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import { useAnalyticsStore } from '../store/analytics.store';

const route = useRoute();
const router = useRouter();
const analyticsStore = useAnalyticsStore();

const reportSeq = Number(route.params.reportSeq);
const detailData = computed(() => analyticsStore.aiReportDetailData);

function reportTypeColor(type: string): string {
  const map: Record<string, string> = {
    월간분석: 'primary',
    고객분석: 'success',
    매출분석: 'warning',
    트렌드: 'info'
  };
  return map[type] || 'neutral';
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    생성중: 'warning',
    완료: 'success',
    실패: 'error'
  };
  return map[status] || 'neutral';
}

function formatDate(dateStr: string): string {
  return dateStr ? dayjs(dateStr).format('YYYY-MM-DD HH:mm') : '';
}

function goList() {
  router.push({ name: 'analytics-ai-report' });
}

onMounted(() => {
  analyticsStore.aiReportDetail(reportSeq);
});

onUnmounted(() => {
  analyticsStore.aiReportDetailInit();
});
</script>
