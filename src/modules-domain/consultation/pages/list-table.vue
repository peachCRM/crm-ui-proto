<template>
  <div class="flex items-center justify-between px-6 py-3">
    <div class="flex items-center gap-3">
      <p-nuxt-select
        v-model="listParams.sortData"
        :options="sortList"
        value-key="value"
        class="w-[120px]"
        @change="handleSortChange"
      />
      <p-nuxt-select
        v-model="listParams.row"
        :options="rowList"
        value-key="value"
        class="w-22"
        @change="listAction"
      />
    </div>
  </div>

  <div v-if="listData.length > 0" class="px-6">
    <u-table
      :data="listData"
      :columns="columns"
      class="max-h-[700px] flex-1"
      @select="onRowClick"
    />
  </div>

  <div v-else class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
    </u-card>
  </div>

  <div v-if="listData.length > 0" class="flex justify-center py-3">
    <u-pagination
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
      @update:page="listMovePage"
    />
  </div>

  <!-- 상세 모달 -->
  <consultation-detail-modal
    :consultation-seq="selectedKey"
    v-model:open="isOpenDetail"
    @remove-ok="listAction"
    @go-update="goUpdate"
  />

  <!-- 수정 모달 -->
  <consultation-update-modal
    :consultation-seq="selectedKey"
    v-model:open="isOpenUpdate"
    @update-ok="listAction"
  />
</template>

<script setup lang="ts">
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import type { Consultation, ConsultationPagingDto } from '../type/consultation.type';
import dayjs from 'dayjs';
import { computed, h, ref, resolveComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TableColumn, TableRow } from '@nuxt/ui';
import ConsultationDetailModal from './consultation-detail.modal.vue';
import ConsultationUpdateModal from './consultation-update.modal.vue';

const route = useRoute();
const router = useRouter();
const consultationStore = useConsultationStore();

const listParams = ref({} as ConsultationPagingDto);
const listData = computed(() => consultationStore.listData);
const listTotalRow = computed(() => consultationStore.listTotalRow);
const selectedKey = ref(0);
const isOpenDetail = ref(false);
const isOpenUpdate = ref(false);

const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '예약일순', value: 'reservationDate,asc' },
  { text: '예약일역순', value: 'reservationDate,desc' }
];

const tableMeta = computed(() => ({
  class: {
    tr: () => 'cursor-pointer'
  }
}));

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 },
  { text: '100개', value: 100 }
];

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

type TableData = Consultation;

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: 'consultationSeq',
    header: '번호',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'consultationType',
    header: '상담유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'title',
    header: '제목',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
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
    accessorKey: 'counselorName',
    header: '상담사',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'reservationDate',
    header: '예약일시',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const date = row.original.reservationDate;
      return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '';
    }
  }
];

const onRowClick = (_event: Event, row: TableRow<TableData>) => {
  selectedKey.value = row.original.consultationSeq;
  isOpenDetail.value = true;
};

const goUpdate = (consultationSeq: number) => {
  selectedKey.value = consultationSeq;
  isOpenDetail.value = false;
  isOpenUpdate.value = true;
};

const handleSortChange = () => {
  listParams.value.sortBy = listParams.value.sortData.split(',')[0];
  listParams.value.sortType = listParams.value.sortData.split(',')[1];
  listAction();
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const getList = async () => {
  await FormService.loading(async () => {
    listParams.value.sortBy = listParams.value.sortData.split(',')[0];
    listParams.value.sortType = listParams.value.sortData.split(',')[1];
    const allParams = { ...route.query, ...listParams.value };
    await consultationStore.paging(allParams);

    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
      return;
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      const { sortBy, sortType, sortData, row, page, time } = route.query;
      Object.assign(listParams.value, {
        sortBy: sortBy || 'insertDate',
        sortType: sortType || 'desc',
        sortData: sortData || 'insertDate,desc',
        row: Number(row) || 10,
        page: Number(page) || 1,
        time: time || ''
      });
    }

    if (route.query && Object.keys(route.query).length > 0 && route.path === '/consultation/register') {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
