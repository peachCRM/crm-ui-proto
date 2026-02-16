<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row items-center justify-between gap-2 py-3">
      <p-nuxt-select
        v-model="listParams.row"
        placeholder="10개"
        :options="rowList"
        class="w-full md:w-32"
        @update:model-value="listAction"
      />
      <p-nuxt-select
        v-model="listParams.sortData"
        placeholder="등록일순"
        :options="sortList"
        class="w-full md:w-40"
        @update:model-value="listAction"
      />
    </div>
    <div class="w-full overflow-x-auto">
      <u-table
        :data="listData"
        :columns="columns"
        class="max-h-[500px]"
      />
    </div>
    <u-pagination
      class="flex justify-center"
      :sibling-count="1"
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
      @update:page="listMovePage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, resolveComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service';
import { usePilatesStore } from '../store/pilates.store';
import type { Membership, MembershipPagingDto } from '../type/pilates.type';
import type { TableColumn } from '@nuxt/ui';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();
const pilatesStore = usePilatesStore();

const listParams = ref<MembershipPagingDto>({
  keyword: '',
  membershipType: '',
  status: '',
  sortBy: 'insertDate',
  sortType: 'desc',
  sortData: 'insertDate,desc',
  row: 10,
  page: 1,
  time: ''
});

const listData = computed(() => pilatesStore.membershipListData);
const listTotalRow = computed(() => pilatesStore.membershipTotalRow);

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 }
];

const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '고객명순', value: 'customerName,asc' }
];

function getMembershipTypeColor(type: string): string {
  const map: Record<string, string> = { 기본: 'neutral', 프리미엄: 'primary', VIP: 'warning' };
  return map[type] || 'neutral';
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = { 활성: 'success', 만료: 'neutral', 일시정지: 'warning' };
  return map[status] || 'neutral';
}

const emit = defineEmits<{
  'open-detail': [membershipSeq: number];
}>();

const columns: TableColumn<Membership>[] = [
  {
    accessorKey: 'customerName',
    header: '고객명',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      return h(
        'span',
        {
          class: 'cursor-pointer font-medium text-[#287dff] hover:underline',
          onClick: () => emit('open-detail', row.original.membershipSeq)
        },
        row.original.customerName
      );
    }
  },
  {
    accessorKey: 'membershipType',
    header: '멤버십유형',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(UBadge, {
        color: getMembershipTypeColor(row.original.membershipType),
        size: 'xs'
      }, { default: () => row.original.membershipType });
    }
  },
  {
    accessorKey: 'totalSessions',
    header: '총횟수',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'remainingSessions',
    header: '잔여횟수',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      return h(
        'span',
        { class: row.original.remainingSessions <= 5 ? 'font-bold text-red-600' : '' },
        String(row.original.remainingSessions)
      );
    }
  },
  {
    accessorKey: 'startDate',
    header: '시작일',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'endDate',
    header: '종료일',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } }
  },
  {
    accessorKey: 'status',
    header: '상태',
    meta: { class: { th: 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-center' } },
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge');
      return h(UBadge, {
        color: getStatusColor(row.original.status),
        size: 'xs'
      }, { default: () => row.original.status });
    }
  }
];

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
    const [sortBy, sortType] = (listParams.value.sortData || 'insertDate,desc').split(',');
    listParams.value.sortBy = sortBy || 'insertDate';
    listParams.value.sortType = sortType || 'desc';
    const allParams = { ...route.query, ...listParams.value };
    pilatesStore.membershipPaging(allParams);
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
    if (route.path.includes('membership')) {
      getList();
    }
  },
  { immediate: true, deep: true }
);
</script>
