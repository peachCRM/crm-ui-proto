<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '통계/분석' }, { title: 'KPI 모니터링' }]"
      title="KPI 모니터링"
      :show-work-btn="false"
    />
  </div>

  <!-- KPI 카드 그리드 -->
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
    <div
      v-for="card in kpiCards"
      :key="card.kpiSeq"
      class="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
      :style="{ borderLeftWidth: '3px', borderLeftColor: getCardColor(card.color) }"
    >
      <div class="flex flex-col gap-2 pl-2">
        <div class="flex items-center gap-2">
          <div
            :class="[
              'flex h-8 w-8 items-center justify-center rounded-lg',
              card.color === 'primary' && 'bg-primary/10 text-primary',
              card.color === 'success' && 'bg-success/10 text-success',
              card.color === 'warning' && 'bg-warning/10 text-warning',
              card.color === 'error' && 'bg-error/10 text-error'
            ]"
          >
            <UIcon :name="card.icon" class="h-4 w-4" />
          </div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ card.title }}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ card.value }}{{ card.unit }}
          </span>
          <span
            v-if="card.changeType !== 'flat'"
            :class="[
              'flex items-center gap-0.5 text-sm font-medium',
              card.changeType === 'up' && 'text-success',
              card.changeType === 'down' && 'text-error'
            ]"
          >
            <UIcon
              :name="card.changeType === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
              class="h-4 w-4"
            />
            {{ card.changeRate > 0 ? '+' : '' }}{{ card.changeRate }}%
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- 월별 추이 -->
  <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
    <!-- 월별 신규 고객 -->
    <u-card>
      <div class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        월별 신규 고객
      </div>
      <div class="flex h-48 items-end gap-1">
        <div
          v-for="stat in monthlyStats"
          :key="stat.month"
          class="flex flex-1 flex-col items-center gap-1"
        >
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ stat.newCustomers }}
          </span>
          <div
            class="w-full min-h-[4px] rounded-t transition-all"
            :style="{
              height: `${maxNewCustomers > 0 ? (stat.newCustomers / maxNewCustomers) * 100 : 0}%`,
              backgroundColor: '#287dff'
            }"
          />
          <span class="text-xs text-gray-500 dark:text-gray-500">
            {{ stat.month.slice(5) }}월
          </span>
        </div>
      </div>
    </u-card>

    <!-- 월별 매출 추이 -->
    <u-card>
      <div class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        월별 매출 추이
      </div>
      <div class="flex h-48 items-end gap-1">
        <div
          v-for="stat in monthlyStats"
          :key="stat.month"
          class="flex flex-1 flex-col items-center gap-1"
        >
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
            {{ (stat.revenue / 10000).toLocaleString() }}
          </span>
          <div
            class="w-full min-h-[4px] rounded-t transition-all"
            :style="{
              height: `${maxRevenue > 0 ? (stat.revenue / maxRevenue) * 100 : 0}%`,
              backgroundColor: '#287dff'
            }"
          />
          <span class="text-xs text-gray-500 dark:text-gray-500">
            {{ stat.month.slice(5) }}월
          </span>
        </div>
      </div>
    </u-card>
  </div>

  <!-- 분포 차트 -->
  <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
    <!-- 고객 등급 분포 -->
    <u-card>
      <div class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        고객 등급 분포
      </div>
      <div class="space-y-3">
        <div
          v-for="item in customerByGrade"
          :key="item.grade"
          class="flex items-center gap-3"
        >
          <span class="w-16 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ item.grade }}
          </span>
          <div class="flex flex-1 items-center gap-2">
            <div
              class="h-6 min-w-[20px] rounded transition-all"
              :style="{
                width: `${customerGradeTotal > 0 ? (item.count / customerGradeTotal) * 100 : 0}%`,
                backgroundColor: '#287dff'
              }"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ item.count }}명
            </span>
          </div>
        </div>
      </div>
    </u-card>

    <!-- 상담 유형 분포 -->
    <u-card>
      <div class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        상담 유형 분포
      </div>
      <div class="space-y-3">
        <div
          v-for="item in consultationByType"
          :key="item.type"
          class="flex items-center gap-3"
        >
          <span class="w-16 shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ item.type }}
          </span>
          <div class="flex flex-1 items-center gap-2">
            <div
              class="h-6 min-w-[20px] rounded transition-all"
              :style="{
                width: `${consultationTypeTotal > 0 ? (item.count / consultationTypeTotal) * 100 : 0}%`,
                backgroundColor: '#287dff'
              }"
            />
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ item.count }}건
            </span>
          </div>
        </div>
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import { useAnalyticsStore } from '../store/analytics.store';

const analyticsStore = useAnalyticsStore();

const kpiCards = computed(() => analyticsStore.kpiCards);
const monthlyStats = computed(() => analyticsStore.monthlyStats);
const customerByGrade = computed(() => analyticsStore.customerByGrade);
const consultationByType = computed(() => analyticsStore.consultationByType);

const maxNewCustomers = computed(() => {
  const stats = analyticsStore.monthlyStats;
  return stats.length > 0 ? Math.max(...stats.map((s) => s.newCustomers)) : 0;
});

const maxRevenue = computed(() => {
  const stats = analyticsStore.monthlyStats;
  return stats.length > 0 ? Math.max(...stats.map((s) => s.revenue)) : 0;
});

const customerGradeTotal = computed(() => {
  return analyticsStore.customerByGrade.reduce((sum, item) => sum + item.count, 0);
});

const consultationTypeTotal = computed(() => {
  return analyticsStore.consultationByType.reduce((sum, item) => sum + item.count, 0);
});

function getCardColor(color: string): string {
  const map: Record<string, string> = {
    primary: '#287dff',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
  };
  return map[color] || '#287dff';
}

onMounted(() => {
  analyticsStore.loadKpi();
  analyticsStore.loadMonthlyStats();
});
</script>
