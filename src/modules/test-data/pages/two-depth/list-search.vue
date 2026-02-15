<template>
  <form @submit.prevent="listAction">
    <div class="flex flex-col xl:flex-row">
      <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
        <div class="space-y-2">
          <div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
            <p-date-picker
              v-model="listParams.startDate"
              class="w-full lg:w-[130px]"
              @update:modelValue="listAction"
            />
            <span class="hidden lg:block">~</span>
            <p-date-picker
              v-model="listParams.endDate"
              class="w-full lg:w-[130px]"
              @update:modelValue="listAction"
            />
          </div>
          <div class="flex flex-row items-center gap-2">
            <p-input-box
              v-model="listParams.keyword"
              placeholder="키워드를 입력하세요."
              class="w-full"
            />
            <u-button type="submit" color="primary" class="whitespace-nowrap"> 검색 </u-button>
          </div>

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

  <insert v-model:open="isOpenInsert" @insert-ok="listAction"/>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { TestDataSearchDto } from '@/modules/test-data/type/test-data.type';
import Insert from '@/modules/test-data/modals/insert.modal.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';

const route = useRoute();
const router = useRouter();

// 검색 파라미터 로컬 상태로 관리
const listParams = ref<TestDataSearchDto>({
  startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  opt: 'all',
  isUse: '',
  selected: ''
});

const isOpenInsert = ref(false);

const listAction = () => {
  // 기존 query 파라미터를 유지하면서 검색 파라미터만 업데이트
  router.push({
    query: {
      ...route.query, // 기존 query 파라미터 유지
      ...listParams.value, // 검색 파라미터 업데이트
      page: 1, // 검색 시 페이지 초기화
      time: dayjs().format('YYYYMMDDHHmmssSSS')
    }
  });
};

const goInsert = () => {
  isOpenInsert.value = true;
};

const resetAction = () => {
  // 검색 파라미터 초기화
  listParams.value = {
    startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    opt: 'all',
    isUse: '',
    selected: ''
  };
  // 기존 query 파라미터를 유지하면서 검색 파라미터만 초기화
  router.push({
    query: {
      ...route.query, // 기존 query 파라미터 유지
      ...listParams.value, // 초기화된 검색 파라미터

      // 기본 정렬 설정
      sortBy: 'insertDate',
      sortType: 'desc',
      sortData: 'insertDate,desc',
      row: 10, // row 값
      page: 1 // 페이지 초기화
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      // 검색 관련 파라미터만 listParams에 적용
      const { startDate, endDate, keyword, opt, isUse, selected } = route.query;
      Object.assign(listParams.value, { startDate, endDate, keyword, opt, isUse, selected });
    } else {
      // 검색 파라미터 초기화
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
