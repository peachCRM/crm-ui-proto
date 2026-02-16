<template>
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

    <div v-if="callListData.length > 0">
      <u-table
        :data="callListData"
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

    <div v-if="callListData.length > 0" class="flex justify-center py-3">
      <u-pagination
        v-model:page="listParams.page"
        :items-per-page="listParams.row"
        :total="callTotalRow"
        @update:page="listMovePage"
      />
    </div>
  </div>

  <call-detail-modal
    :call-seq="selectedCallSeq"
    v-model:open="isOpenDetail"
    @remove-ok="listAction"
  />
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useCommunicationStore } from '../store/communication.store';
import type { CallHistory, CallHistoryPagingDto } from '../type/communication.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import CallDetailModal from './call-detail.modal.vue';

const route = useRoute();
const router = useRouter();
const communicationStore = useCommunicationStore();

const listParams = ref<CallHistoryPagingDto>({
  keyword: '',
  callType: '',
  callResult: '',
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  sortBy: 'startTime',
  sortType: 'desc',
  sortData: 'startTime,desc',
  row: 10,
  page: 1,
  time: ''
});

const selectedCallSeq = ref(0);
const isOpenDetail = ref(false);

const callListData = computed(() => communicationStore.callListData);
const callTotalRow = computed(() => communicationStore.callTotalRow);

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 }
];

/** duration을 mm:ss 포맷으로 변환 */
const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/** 통화유형 배지 색상 */
const callTypeColor = (type: string) => {
  const map: Record<string, string> = {
    인바운드: 'primary',
    아웃바운드: 'warning'
  };
  return map[type] || 'neutral';
};

/** 통화결과 배지 색상 */
const callResultColor = (result: string) => {
  const map: Record<string, string> = {
    연결: 'success',
    부재: 'warning',
    통화중: 'info',
    거절: 'error'
  };
  return map[result] || 'neutral';
};

const columns: TableColumn<CallHistory>[] = [
  {
    accessorKey: 'callSeq',
    header: '번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerPhone',
    header: '전화번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'callType',
    header: '통화유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: callTypeColor(row.original.callType),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.callType }
      );
    }
  },
  {
    accessorKey: 'duration',
    header: '통화시간',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => formatDuration(row.original.duration)
  },
  {
    accessorKey: 'callResult',
    header: '통화결과',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(
        UBadge,
        {
          color: callResultColor(row.original.callResult),
          variant: 'subtle',
          size: 'xs'
        },
        { default: () => row.original.callResult }
      );
    }
  },
  {
    accessorKey: 'counselorName',
    header: '상담사',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'startTime',
    header: '통화시작',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => dayjs(row.original.startTime).format('YYYY-MM-DD HH:mm')
  },
  {
    accessorKey: 'hasRecording',
    header: '녹취',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      if (row.original.hasRecording === 'Y') {
        const UIcon = resolveComponent('UIcon');
        return h(UIcon, { name: 'i-lucide-mic', class: 'h-5 w-5 text-primary' });
      }
      return '-';
    }
  }
];

const onRowClick = (_event: Event, row: TableRow<CallHistory>) => {
  selectedCallSeq.value = row.original.callSeq;
  isOpenDetail.value = true;
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

const getList = async () => {
  communicationStore.callPaging(listParams.value);
};

watch(
  () => route.query,
  (query) => {
    if (route.name === 'communication-history' && query && Object.keys(query).length > 0) {
      const {
        keyword,
        callType,
        callResult,
        startDate,
        endDate,
        sortBy,
        sortType,
        sortData,
        row,
        page,
        time
      } = query;
      Object.assign(listParams.value, {
        keyword: keyword || '',
        callType: callType || '',
        callResult: callResult || '',
        startDate: startDate || dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: endDate || dayjs().format('YYYY-MM-DD'),
        sortBy: sortBy || 'startTime',
        sortType: sortType || 'desc',
        sortData: sortData || 'startTime,desc',
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
