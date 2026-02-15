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
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import type { TestDataPagingDto } from '@/modules/test-data/type/test-data.type';
import type { TableColumn, TableRow } from '@nuxt/ui';
import dayjs from 'dayjs';
import { computed, h, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const testDataStore = useTestDataStore();

// 테이블 파라미터 로컬 상태로 관리
const listParams = ref({} as TestDataPagingDto);

// Store에서 list 데이터와 totalRow는 가져오기
const listData = computed(() => testDataStore.listData);
const listTotalRow = computed(() => testDataStore.listTotalRow);

const rowSelection = ref({});

type TableData = {
  testSeq: number;
  subject: string;
  insertDate: string;
};

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: 'testSeq',
    header: '아이디',
    meta: {
      class: {
        th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center'
      }
    }
  },
  {
    accessorKey: 'subject',
    header: '제목',
    meta: {
      class: {
        th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center'
      }
    },
    cell: ({ row }) => {
      return h(
        'div',
        {
          class: [
            'w-[160px] overflow-hidden text-ellipsis',
            row.original.testSeq.toString() === route.query.selected ? 'font-bold' : ''
          ]
        },
        [row.original.subject]
      );
    }
  } // 넓이 오버 하면 ... 처리
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 },
  { text: '100개', value: 100 }
];

const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' }
];

const isSelected = ref<boolean>(false);

const tableMeta = computed(() => ({
  class: {
    tr: (row: TableRow<TableData>) =>
      row.original.testSeq.toString() === route.query.selected
        ? 'bg-primary-50 dark:bg-primary-900 '
        : 'cursor-pointer'
  }
}));

const selectRow = (_event: Event, row: TableRow<TableData>) => {
  isSelected.value = true;
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({
    query: {
      ...route.query,
      ...listParams.value,
      selected: row.original.testSeq.toString()
    }
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
    // 모든 query 파라미터를 합쳐서 전달
    listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
    listParams.value.sortType = listParams.value.sortData?.split(',')[1];
    const allParams = { ...route.query, ...listParams.value };
    await testDataStore.paging(allParams);

    //데이터가 없을 경우 첫페이지로 강제 이동 처리
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
      // 테이블 관련 파라미터만 listParams에 적용
      const { sortBy, sortType, sortData, row, page, time } = route.query;
      Object.assign(listParams.value, {
        sortBy: sortBy || 'insertDate',
        sortType: sortType || 'asc',
        sortData: sortData || 'insertDate,asc',
        row: Number(row) || 10,
        page: Number(page) || 1,
        time: time || ''
      });
    }

    //route 파라미터가 있고 특정 페이지 일때만 조회
    if (
      route.query &&
      Object.keys(route.query).length > 0 &&
      route.path == '/test/crud/two-depth/list'
    ) {
      // // 로컬 스토리지 저장
      // objectLocalStorage.saveObjectToLocalStorage('TestDataTwoDepthList', {
      //   ...listParams.value
      // });
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped></style>
