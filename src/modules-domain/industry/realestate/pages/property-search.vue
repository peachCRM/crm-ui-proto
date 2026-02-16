<template>
  <form @submit.prevent="listAction">
    <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
      <div class="space-y-2 p-4">
        <!-- 키워드 검색 -->
        <div class="flex flex-row flex-wrap items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="주소, 소유자명 검색"
            class="w-full md:w-64"
          />
          <p-nuxt-select
            v-model="listParams.propertyType"
            placeholder="매물유형"
            :options="propertyTypeOptions"
            class="w-full md:w-32"
            @update:model-value="listAction"
          />
          <p-nuxt-select
            v-model="listParams.transactionType"
            placeholder="거래유형"
            :options="transactionTypeOptions"
            class="w-full md:w-32"
            @update:model-value="listAction"
          />
          <p-nuxt-select
            v-model="listParams.status"
            placeholder="상태"
            :options="statusOptions"
            class="w-full md:w-32"
            @update:model-value="listAction"
          />
        </div>
        <!-- 버튼 -->
        <div class="flex flex-row items-center gap-2">
          <u-button type="submit" color="primary" icon="i-lucide-search">
            검색
          </u-button>
          <u-button
            color="neutral"
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
    <property-insert-modal v-model:open="isOpenInsert" @insert-ok="listAction" />
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { PropertySearchDto } from '../type/realestate.type';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PropertyInsertModal from './property-insert.modal.vue';

const route = useRoute();
const router = useRouter();

const listParams = ref<PropertySearchDto>({
  keyword: '',
  propertyType: '',
  transactionType: '',
  status: ''
});

const isOpenInsert = ref(false);

const propertyTypeOptions = [
  { text: '전체', value: '' },
  { text: '아파트', value: '아파트' },
  { text: '오피스텔', value: '오피스텔' },
  { text: '빌라', value: '빌라' },
  { text: '상가', value: '상가' },
  { text: '토지', value: '토지' }
];

const transactionTypeOptions = [
  { text: '전체', value: '' },
  { text: '매매', value: '매매' },
  { text: '전세', value: '전세' },
  { text: '월세', value: '월세' }
];

const statusOptions = [
  { text: '전체', value: '' },
  { text: '등록', value: '등록' },
  { text: '계약중', value: '계약중' },
  { text: '계약완료', value: '계약완료' },
  { text: '보류', value: '보류' }
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
    propertyType: '',
    transactionType: '',
    status: ''
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
      const { keyword, propertyType, transactionType, status } = route.query;
      Object.assign(listParams.value, { keyword, propertyType, transactionType, status });
    } else {
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
