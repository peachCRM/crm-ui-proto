<template>
  <form @submit.prevent="listAction">
    <div class="space-y-3 p-6">
      <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
        <div class="w-20 shrink-0 font-semibold text-gray-600">키워드</div>
        <div class="flex w-full items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명, 제목, 내용 검색"
            class="w-full lg:w-[220px]"
          />
          <p-nuxt-select
            v-model="listParams.consultationType"
            :options="consultationTypeOptions"
            class="w-full lg:w-[120px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.status"
            :options="statusOptions"
            class="w-full lg:w-[120px]"
            @change="listAction"
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
          <u-button
            color="primary"
            icon="i-lucide-plus"
            label="등록"
            @click="goInsert"
          />
        </div>
      </div>
    </div>
  </form>

  <!-- 상담 등록 모달 -->
  <consultation-insert-modal v-model:open="isOpenInsert" @insert-ok="listAction" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { ConsultationPagingDto } from '../type/consultation.type';
import ConsultationInsertModal from './consultation-insert.modal.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();

const listParams = ref<ConsultationPagingDto>({
  keyword: '',
  consultationType: '',
  status: '',
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  sortBy: 'insertDate',
  sortType: 'desc',
  sortData: 'insertDate,desc',
  row: 10,
  page: 1,
  time: ''
});

const isOpenInsert = ref(false);

const consultationTypeOptions = [
  { text: '전체', value: '' },
  { text: '전화', value: '전화' },
  { text: '방문', value: '방문' },
  { text: '온라인', value: '온라인' }
];

const statusOptions = [
  { text: '전체', value: '' },
  { text: '대기', value: '대기' },
  { text: '진행', value: '진행' },
  { text: '완료', value: '완료' },
  { text: '취소', value: '취소' }
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

const goInsert = () => {
  isOpenInsert.value = true;
};

const resetAction = () => {
  listParams.value = {
    keyword: '',
    consultationType: '',
    status: '',
    startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    sortBy: 'insertDate',
    sortType: 'desc',
    sortData: 'insertDate,desc',
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
      const { keyword, consultationType, status, startDate, endDate, sortBy, sortType, sortData, row, page, time } = route.query;
      Object.assign(listParams.value, {
        keyword: keyword || '',
        consultationType: consultationType || '',
        status: status || '',
        startDate: startDate || '',
        endDate: endDate || '',
        sortBy: sortBy || 'insertDate',
        sortType: sortType || 'desc',
        sortData: sortData || 'insertDate,desc',
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
</script>
