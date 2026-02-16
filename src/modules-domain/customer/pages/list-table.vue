<template>
  <div class="flex flex-row items-center justify-between gap-2 py-3">
    <p-nuxt-select
      v-model="listParams.row"
      placeholder="10개"
      :options="rowList"
      class="w-full md:w-1/2"
      @update:model-value="listAction"
    />
    <p-nuxt-select
      v-model="listParams.sortData"
      placeholder="등록일순"
      :options="sortList"
      class="w-full md:w-1/2"
      @update:model-value="listAction"
    />
  </div>
  <div class="w-full">
    <u-table
      :data="listData"
      sticky
      :columns="columns"
      v-model:row-selection="rowSelection"
      @select="selectRow"
      :meta="tableMeta"
      class="max-h-[700px] flex-1"
    />
  </div>
  <u-pagination
    class="mt-3 flex justify-center"
    :sibling-count="1"
    v-model:page="listParams.page"
    :items-per-page="listParams.row"
    :total="listTotalRow"
    @update:page="listMovePage"
  />
</template>

<script setup lang="ts">
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useCustomerStore } from '../store/customer.store';
import type { CustomerPagingDto } from '../type/customer.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import dayjs from 'dayjs';
import { computed, h, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const customerStore = useCustomerStore();

const listParams = ref({} as CustomerPagingDto);
const listData = computed(() => customerStore.listData);
const listTotalRow = computed(() => customerStore.listTotalRow);
const rowSelection = ref({});

type TableData = {
  customerSeq: number;
  customerName: string;
  phone: string;
  customerGrade: string;
};

const gradeLabel = (grade: string) => {
  const labels: Record<string, string> = { A: 'VIP', B: '우수', C: '일반', D: '관심' };
  return labels[grade] || grade;
};

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      return h(
        'div',
        {
          class: [
            'w-[120px] overflow-hidden text-ellipsis font-medium',
            row.original.customerSeq.toString() === route.query.selected ? 'font-bold text-[#287dff]' : ''
          ]
        },
        [row.original.customerName]
      );
    }
  },
  {
    accessorKey: 'phone',
    header: '연락처',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'customerGrade',
    header: '등급',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      return h('span', { class: 'text-xs' }, gradeLabel(row.original.customerGrade));
    }
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
  { text: '이름순', value: 'customerName,asc' }
];

const tableMeta = computed(() => ({
  class: {
    tr: (row: TableRow<TableData>) =>
      row.original.customerSeq.toString() === route.query.selected
        ? 'bg-primary-50 dark:bg-primary-900'
        : 'cursor-pointer'
  }
}));

const selectRow = (_event: Event, row: TableRow<TableData>) => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({
    query: { ...route.query, ...listParams.value, selected: row.original.customerSeq.toString() }
  });
};

const listMovePage = async (page: number) => {
  listParams.value.page = page;
  listAction();
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const getList = async () => {
  await FormService.loading(async () => {
    listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
    listParams.value.sortType = listParams.value.sortData?.split(',')[1];
    const allParams = { ...route.query, ...listParams.value };
    await customerStore.paging(allParams);

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

    if (route.query && Object.keys(route.query).length > 0 && route.path === '/customer/list') {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
