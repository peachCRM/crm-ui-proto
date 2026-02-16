<template>
  <form @submit.prevent="listAction">
    <div class="flex flex-col xl:flex-row">
      <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
        <div class="space-y-2">
          <!-- 검색 입력 -->
          <div class="flex flex-row items-center gap-2">
            <p-input-box
              v-model="listParams.keyword"
              placeholder="이름, 전화번호, 이메일 검색"
              class="w-full"
            />
            <u-button type="submit" color="primary" class="whitespace-nowrap">검색</u-button>
          </div>

          <!-- 등급 필터 -->
          <div class="flex flex-row items-center gap-2">
            <p-nuxt-select
              v-model="listParams.customerGrade"
              placeholder="전체 등급"
              :options="gradeOptions"
              class="w-full"
              @update:model-value="listAction"
            />
            <p-nuxt-select
              v-model="listParams.customerStatus"
              placeholder="전체 상태"
              :options="statusOptions"
              class="w-full"
              @update:model-value="listAction"
            />
          </div>

          <!-- 액션 버튼 -->
          <div class="flex w-full flex-row items-center gap-3">
            <u-button
              class="flex w-1/2 justify-center"
              color="primary"
              variant="soft"
              icon="i-lucide-rotate-ccw"
              label="초기화"
              @click="resetAction"
            />
            <u-button
              class="flex w-1/2 justify-center"
              color="primary"
              icon="i-lucide-plus"
              label="등록"
              @click="goInsert"
            />
          </div>
        </div>
      </div>
    </div>
  </form>

  <!-- 고객 등록 모달 -->
  <customer-insert-modal v-model:open="isOpenInsert" @insert-ok="listAction" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { CustomerSearchDto } from '../type/customer.type';
import CustomerInsertModal from './customer-insert.modal.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();

const listParams = ref<CustomerSearchDto>({
  startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  customerGrade: '',
  customerStatus: '',
  selected: ''
});

const isOpenInsert = ref(false);

const gradeOptions = [
  { text: '전체 등급', value: '' },
  { text: 'VIP', value: 'A' },
  { text: '우수', value: 'B' },
  { text: '일반', value: 'C' },
  { text: '관심', value: 'D' }
];

const statusOptions = [
  { text: '전체 상태', value: '' },
  { text: '활성', value: 'A' },
  { text: '비활성', value: 'I' }
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
    startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    customerGrade: '',
    customerStatus: '',
    selected: ''
  };
  router.push({
    query: {
      ...route.query,
      ...listParams.value,
      sortBy: 'insertDate',
      sortType: 'desc',
      sortData: 'insertDate,desc',
      row: 10,
      page: 1
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      const { keyword, customerGrade, customerStatus, selected } = route.query;
      Object.assign(listParams.value, { keyword, customerGrade, customerStatus, selected });
    } else {
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
