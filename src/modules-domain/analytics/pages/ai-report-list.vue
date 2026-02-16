<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '통계/분석' }, { title: 'AI 리포트' }]"
      title="AI 리포트"
      :show-work-btn="false"
    />
  </div>

  <div class="rounded-lg bg-white dark:bg-gray-900">
    <!-- 검색 영역 -->
    <form @submit.prevent="listAction" class="space-y-3 p-6">
      <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
        <div class="w-20 shrink-0 font-semibold text-gray-600 dark:text-gray-400">키워드</div>
        <div class="flex w-full flex-1 items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="제목, 요약 검색"
            class="w-full lg:w-[220px]"
          />
          <p-nuxt-select
            v-model="listParams.reportType"
            :options="reportTypeOptions"
            class="w-full lg:w-[140px]"
            @change="listAction"
          />
          <u-button type="submit" color="primary" class="whitespace-nowrap">검색</u-button>
          <u-button
            color="primary"
            variant="soft"
            icon="i-lucide-rotate-ccw"
            label="초기화"
            @click="resetAction"
          />
          <u-button
            color="primary"
            icon="i-lucide-plus"
            label="AI 리포트 생성"
            @click="requestReport"
          />
        </div>
      </div>
    </form>

    <!-- 테이블 영역 -->
    <div class="px-6 pb-6">
      <div class="flex items-center justify-between py-3">
        <p-nuxt-select
          v-model="listParams.row"
          :options="rowList"
          value-key="value"
          class="w-22"
          @change="listAction"
        />
      </div>

      <div v-if="aiReportListData.length > 0">
        <u-table
          :data="aiReportListData"
          :columns="columns"
          :meta="tableMeta"
          class="max-h-[600px] flex-1 cursor-pointer"
          @select="onRowClick"
        />
      </div>

      <div v-else class="py-5 text-center">
        <u-card>
          <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
        </u-card>
      </div>

      <div v-if="aiReportListData.length > 0" class="flex justify-center py-3">
        <u-pagination
          v-model:page="listParams.page"
          :items-per-page="listParams.row"
          :total="aiReportTotalRow"
          @update:page="listMovePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useAnalyticsStore } from '../store/analytics.store';
import type { AiReport, AiReportPagingDto } from '../type/analytics.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();
const analyticsStore = useAnalyticsStore();

const listParams = ref<AiReportPagingDto>({
  keyword: '',
  reportType: '',
  startDate: '',
  endDate: '',
  sortBy: 'generatedDate',
  sortType: 'desc',
  sortData: 'generatedDate,desc',
  row: 10,
  page: 1,
  time: ''
});

const aiReportListData = computed(() => analyticsStore.aiReportListData);
const aiReportTotalRow = computed(() => analyticsStore.aiReportTotalRow);

const reportTypeOptions = [
  { text: '전체', value: '' },
  { text: '월간분석', value: '월간분석' },
  { text: '고객분석', value: '고객분석' },
  { text: '매출분석', value: '매출분석' },
  { text: '트렌드', value: '트렌드' }
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 }
];

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

const tableMeta = computed(() => ({
  class: {
    tr: () => 'cursor-pointer'
  }
}));

const columns: TableColumn<AiReport>[] = [
  {
    accessorKey: 'reportSeq',
    header: '번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'title',
    header: '제목',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'reportType',
    header: '유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: reportTypeColor(row.original.reportType),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.reportType }
      );
    }
  },
  {
    accessorKey: 'summary',
    header: '요약',
    meta: {
      class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' },
      style: { maxWidth: '200px' }
    },
    cell: ({ row }) => {
      const summary = row.original.summary || '';
      return h(
        'span',
        { class: 'block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap' },
        summary
      );
    }
  },
  {
    accessorKey: 'status',
    header: '상태',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: statusColor(row.original.status),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.status }
      );
    }
  },
  {
    accessorKey: 'generatedDate',
    header: '생성일',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const date = row.original.generatedDate;
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '';
    }
  }
];

function onRowClick(_event: Event, row: TableRow<AiReport>) {
  router.push({
    name: 'analytics-ai-report-detail',
    params: { reportSeq: String(row.original.reportSeq) }
  });
}

function requestReport() {
  FormService.toastMessage('리포트가 생성 요청되었습니다', 'success');
}

function listAction() {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
}

function resetAction() {
  listParams.value.keyword = '';
  listParams.value.reportType = '';
  listParams.value.page = 1;
  listAction();
}

function listMovePage(page: number) {
  listParams.value.page = page;
  listAction();
}

function getList() {
  const query = route.query;
  Object.assign(listParams.value, {
    keyword: (query.keyword as string) || '',
    reportType: (query.reportType as string) || '',
    page: Number(query.page) || 1,
    row: Number(query.row) || 10,
    sortBy: (query.sortBy as string) || 'generatedDate',
    sortType: (query.sortType as string) || 'desc',
    sortData: (query.sortData as string) || 'generatedDate,desc',
    time: (query.time as string) || ''
  });
  analyticsStore.aiReportPaging(listParams.value);
}

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      getList();
    } else {
      listParams.value = {
        keyword: '',
        reportType: '',
        startDate: '',
        endDate: '',
        sortBy: 'generatedDate',
        sortType: 'desc',
        sortData: 'generatedDate,desc',
        row: 10,
        page: 1,
        time: ''
      };
      analyticsStore.aiReportPaging(listParams.value);
    }
  },
  { immediate: true, deep: true }
);
</script>
