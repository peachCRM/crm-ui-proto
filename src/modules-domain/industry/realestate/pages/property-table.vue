<template>
  <div class="mt-4">
    <div class="flex flex-row items-center justify-between gap-2 py-3">
      <p-nuxt-select
        v-model="listParams.row"
        placeholder="10개"
        :options="rowList"
        class="w-24"
        @update:model-value="listAction"
      />
      <p-nuxt-select
        v-model="listParams.sortData"
        placeholder="등록일순"
        :options="sortList"
        class="w-32"
        @update:model-value="listAction"
      />
    </div>
    <div v-if="listData.length > 0" class="w-full">
      <u-table
        :data="listData"
        sticky
        :columns="columns"
        v-model:row-selection="rowSelection"
        :meta="tableMeta"
        class="max-h-[600px]"
        @select="onRowClick"
      />
    </div>
    <div v-else class="py-12 text-center text-gray-500">
      조회된 매물이 없습니다.
    </div>
    <u-pagination
      v-if="listData.length > 0"
      class="mt-3 flex justify-center"
      :sibling-count="1"
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
      @update:page="listMovePage"
    />
    <property-detail-modal
      :property-seq="selectedPropertySeq"
      v-model:open="isOpenDetail"
      @remove-ok="listAction"
      @go-update="goUpdate"
    />
    <property-update-modal
      :property-seq="selectedPropertySeq"
      v-model:open="isOpenUpdate"
      @update-ok="listAction"
    />
  </div>
</template>

<script setup lang="ts">
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useRealestateStore } from '../store/realestate.store';
import type { Property, PropertyPagingDto } from '../type/realestate.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import dayjs from 'dayjs';
import { computed, h, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PropertyDetailModal from './property-detail.modal.vue';
import PropertyUpdateModal from './property-update.modal.vue';

const route = useRoute();
const router = useRouter();
const realestateStore = useRealestateStore();

const listParams = ref({} as PropertyPagingDto);
const listData = computed(() => realestateStore.propertyListData);
const listTotalRow = computed(() => realestateStore.propertyTotalRow);
const rowSelection = ref({});
const selectedPropertySeq = ref(0);
const isOpenDetail = ref(false);
const isOpenUpdate = ref(false);

/** 가격 포맷: 억/만원 (예: 5억 2000만) */
function formatPrice(price: number, deposit: number, monthlyRent: number, transactionType: string): string {
  if (transactionType === '매매') {
    if (price >= 10000) return `${Math.floor(price / 10000)}억 ${price % 10000 ? ` ${price % 10000}만` : ''}`;
    return `${price}만`;
  }
  if (transactionType === '전세') {
    if (deposit >= 10000) return `${Math.floor(deposit / 10000)}억 ${deposit % 10000 ? ` ${deposit % 10000}만` : ''}`;
    return `${deposit}만`;
  }
  if (transactionType === '월세') {
    return `${deposit}만 / ${monthlyRent}만`;
  }
  return '-';
}

const statusBadgeColor = (status: string) => {
  const map: Record<string, string> = {
    등록: 'primary',
    계약중: 'warning',
    계약완료: 'success',
    보류: 'neutral'
  };
  return map[status] || 'neutral';
};

type TableData = Property;

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: 'propertyName',
    header: '매물명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      h(
        'div',
        {
          class: 'max-w-[180px] cursor-pointer overflow-hidden text-ellipsis font-medium hover:text-[#287dff]'
        },
        row.original.propertyName
      )
  },
  {
    accessorKey: 'propertyType',
    header: '매물유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      h(
        'u-badge',
        {
          color: 'neutral',
          variant: 'soft',
          size: 'xs'
        },
        row.original.propertyType
      )
  },
  {
    accessorKey: 'transactionType',
    header: '거래유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'address',
    header: '주소',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'max-w-[200px] overflow-hidden text-ellipsis' },
        row.original.address
      )
  },
  {
    accessorKey: 'price',
    header: '가격',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      formatPrice(
        row.original.price,
        row.original.deposit,
        row.original.monthlyRent,
        row.original.transactionType
      )
  },
  {
    accessorKey: 'area',
    header: '면적(m²)',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'status',
    header: '상태',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      h(
        'u-badge',
        {
          color: statusBadgeColor(row.original.status),
          variant: 'soft',
          size: 'xs'
        },
        row.original.status
      )
  }
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 }
];

const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '가격순', value: 'price,asc' },
  { text: '가격역순', value: 'price,desc' }
];

const tableMeta = computed(() => ({
  class: {
    tr: 'cursor-pointer'
  }
}));

const onRowClick = (_event: Event, row: TableRow<TableData>) => {
  selectedPropertySeq.value = row.original.propertySeq;
  isOpenDetail.value = true;
};

const goUpdate = (propertySeq: number) => {
  isOpenDetail.value = false;
  selectedPropertySeq.value = propertySeq;
  isOpenUpdate.value = true;
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
    listParams.value.sortBy = listParams.value.sortData?.split(',')[0] || 'insertDate';
    listParams.value.sortType = listParams.value.sortData?.split(',')[1] || 'desc';
    const allParams = { ...route.query, ...listParams.value };
    await realestateStore.propertyPaging(allParams);

    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
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
    if (route.query && Object.keys(route.query).length > 0 && route.path.includes('property')) {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
