<template>
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
      class="max-h-[500px]"
      @select="selectRow"
    />
  </div>
  <div v-else class="py-8 text-center text-gray-500">
    조회된 매칭이 없습니다.
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
</template>

<script setup lang="ts">
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useRealestateStore } from '../store/realestate.store';
import type { PropertyMatching, MatchingPagingDto } from '../type/realestate.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import dayjs from 'dayjs';
import { computed, h, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const realestateStore = useRealestateStore();

const listParams = ref({} as MatchingPagingDto);
const listData = computed(() => realestateStore.matchingListData);
const listTotalRow = computed(() => realestateStore.matchingTotalRow);
const rowSelection = ref({});

const statusBadgeColor = (status: string) => {
  const map: Record<string, string> = {
    추천: 'primary',
    상담예정: 'warning',
    상담완료: 'info',
    계약: 'success'
  };
  return map[status] || 'neutral';
};

type TableData = PropertyMatching;

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'propertyName',
    header: '매물명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'max-w-[140px] overflow-hidden text-ellipsis' },
        row.original.propertyName
      )
  },
  {
    accessorKey: 'matchScore',
    header: '매칭점수',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const score = row.original.matchScore;
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', { class: 'h-2 flex-1 min-w-[40px] rounded bg-gray-200 dark:bg-gray-700 overflow-hidden' }, [
          h('div', {
            class: 'h-full rounded bg-[#287dff]',
            style: { width: `${score}%` }
          })
        ]),
        h('span', { class: 'text-sm font-medium' }, `${score}`)
      ]);
    }
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
  { text: '점수순', value: 'matchScore,desc' }
];

const tableMeta = computed(() => ({
  class: {
    tr: (row: TableRow<TableData>) =>
      row.original.matchingSeq.toString() === route.query.selected
        ? 'bg-primary-50 dark:bg-primary-900'
        : 'cursor-pointer'
  }
}));

const selectRow = (_event: Event, row: TableRow<TableData>) => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({
    query: { ...route.query, ...listParams.value, selected: row.original.matchingSeq.toString() }
  });
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
    await realestateStore.matchingPaging(allParams);

    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      const { sortBy, sortType, sortData, row, page, time, selected } = route.query;
      Object.assign(listParams.value, {
        sortBy: sortBy || 'insertDate',
        sortType: sortType || 'desc',
        sortData: sortData || 'insertDate,desc',
        row: Number(row) || 10,
        page: Number(page) || 1,
        time: time || '',
        selected: selected || ''
      });
    }
    if (route.query && Object.keys(route.query).length > 0 && route.path.includes('matching')) {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
