<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '통신' }, { title: '녹취 청취' }]"
      title="녹취 청취"
    />
  </div>
  <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
    <!-- 검색 영역 -->
    <form @submit.prevent="listAction" class="space-y-3 p-6">
      <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
        <div class="w-20 shrink-0 font-semibold text-gray-600">키워드</div>
        <div class="flex w-full flex-wrap items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명, 상담사명 검색"
            class="w-full lg:w-[220px]"
          />
          <p-date-picker
            v-model="listParams.startDate"
            class="w-full lg:w-[130px]"
            @update:modelValue="listAction"
          />
          <span class="hidden text-gray-500 lg:inline">~</span>
          <p-date-picker
            v-model="listParams.endDate"
            class="w-full lg:w-[130px]"
            @update:modelValue="listAction"
          />
          <u-button type="submit" color="primary" class="whitespace-nowrap">검색</u-button>
          <u-button
            color="primary"
            variant="soft"
            icon="i-lucide-rotate-ccw"
            label="초기화"
            @click="resetAction"
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

      <div v-if="recordListData.length > 0">
        <u-table
          :data="recordListData"
          :columns="columns"
          class="max-h-[600px] flex-1 cursor-pointer"
          @select="onRowClick"
        />
      </div>

      <div v-else class="py-5 text-center">
        <u-card>
          <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
        </u-card>
      </div>

      <div v-if="recordListData.length > 0" class="flex justify-center py-3">
        <u-pagination
          v-model:page="listParams.page"
          :items-per-page="listParams.row"
          :total="recordTotalRow"
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
import { useCommunicationStore } from '../store/communication.store';
import type { CallRecord, CallRecordPagingDto } from '../type/communication.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();
const communicationStore = useCommunicationStore();

const listParams = ref<CallRecordPagingDto>({
  keyword: '',
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  sortBy: 'recordDate',
  sortType: 'desc',
  sortData: 'recordDate,desc',
  row: 10,
  page: 1,
  time: ''
});

const recordListData = computed(() => communicationStore.recordListData);
const recordTotalRow = computed(() => communicationStore.recordTotalRow);

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 }
];

/** 감정 배지 색상 */
const sentimentColor = (sentiment: string) => {
  const map: Record<string, string> = {
    긍정: 'success',
    부정: 'error',
    중립: 'neutral'
  };
  return map[sentiment] || 'neutral';
};

/** duration을 mm:ss 포맷으로 변환 */
const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const columns: TableColumn<CallRecord>[] = [
  {
    accessorKey: 'recordSeq',
    header: '번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'counselorName',
    header: '상담사',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'callType',
    header: '통화유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'duration',
    header: '통화시간',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => formatDuration(row.original.duration)
  },
  {
    accessorKey: 'sentiment',
    header: '감정분석',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: sentimentColor(row.original.sentiment),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.sentiment }
      );
    }
  },
  {
    accessorKey: 'recordDate',
    header: '녹취일시',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => dayjs(row.original.recordDate).format('YYYY-MM-DD HH:mm')
  }
];

const onRowClick = (_event: Event, row: TableRow<CallRecord>) => {
  router.push({
    name: 'communication-record-detail',
    params: { recordSeq: String(row.original.recordSeq) }
  });
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const resetAction = () => {
  listParams.value = {
    keyword: '',
    startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    sortBy: 'recordDate',
    sortType: 'desc',
    sortData: 'recordDate,desc',
    row: 10,
    page: 1,
    time: ''
  };
  listAction();
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

const getList = () => {
  communicationStore.recordPaging(listParams.value);
};

watch(
  () => route.query,
  (query) => {
    if (route.name === 'communication-record' && query && Object.keys(query).length > 0) {
      const { keyword, startDate, endDate, sortBy, sortType, sortData, row, page, time } = query;
      Object.assign(listParams.value, {
        keyword: keyword || '',
        startDate: startDate || dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: endDate || dayjs().format('YYYY-MM-DD'),
        sortBy: sortBy || 'recordDate',
        sortType: sortType || 'desc',
        sortData: sortData || 'recordDate,desc',
        row: Number(row) || 10,
        page: Number(page) || 1,
        time: time || ''
      });
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
