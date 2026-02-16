<template>
  <form @submit.prevent="listAction">
    <div class="space-y-3 p-6">
      <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
        <div class="w-20 shrink-0 font-semibold text-gray-600">키워드</div>
        <div class="flex w-full flex-wrap items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명, 전화번호 검색"
            class="w-full lg:w-[220px]"
          />
          <p-nuxt-select
            v-model="listParams.callType"
            :options="callTypeOptions"
            class="w-full lg:w-[120px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.callResult"
            :options="callResultOptions"
            class="w-full lg:w-[120px]"
            @change="listAction"
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
          <u-button type="submit" color="primary" class="whitespace-nowrap">
            검색
          </u-button>
          <u-button
            color="primary"
            variant="soft"
            icon="i-lucide-rotate-ccw"
            label="초기화"
            @click="resetAction"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { CallHistoryPagingDto } from '../type/communication.type';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';

const route = useRoute();
const router = useRouter();

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

const callTypeOptions = [
  { text: '전체', value: '' },
  { text: '인바운드', value: '인바운드' },
  { text: '아웃바운드', value: '아웃바운드' }
];

const callResultOptions = [
  { text: '전체', value: '' },
  { text: '연결', value: '연결' },
  { text: '부재', value: '부재' },
  { text: '통화중', value: '통화중' },
  { text: '거절', value: '거절' }
];

const listAction = () => {
  router.push({
    query: {
      ...route.query,
      ...listParams.value,
      page: 1,
      time: dayjs().format('YYYYMMDDHHmmssSSS')
    }
  });
};

const resetAction = () => {
  listParams.value = {
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
  };
  router.push({
    query: {
      ...route.query,
      ...listParams.value,
      time: dayjs().format('YYYYMMDDHHmmssSSS')
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
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
      } = route.query;
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
    } else {
      resetAction();
    }
  },
  { immediate: true, deep: true }
);

defineExpose({
  listParams
});
</script>
