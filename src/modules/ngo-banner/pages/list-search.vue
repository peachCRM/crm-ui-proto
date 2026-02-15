<template>
  <form @submit.prevent="listAction">
    <div class="w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div class="p-3">
        <div class="flex w-full flex-col gap-3 lg:flex-row">
          <!-- 조회기간 -->
          <u-form-field label="조회기간">
            <div class="flex flex-col items-center gap-2 lg:flex-row">
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
              <p-day-select
                v-model="listParams.startDate"
                class="w-full lg:w-[160px]"
                @setDate="setDate"
              />
            </div>
          </u-form-field>

          <!-- 플랫폼 -->
          <u-form-field label="플랫폼">
            <p-nuxt-select
              v-model="listParams.platform"
              :options="platformList"
              class="w-full lg:w-[160px]"
              @change="listAction"
            />
          </u-form-field>

          <!-- 키워드 -->
          <u-form-field label="키워드" class="flex-1">
            <div class="flex items-center gap-2">
              <u-field-group class="w-full">
                <p-nuxt-select
                  v-model="listParams.opt"
                  :options="optList"
                  class="w-full lg:w-[160px]"
                  @change="listAction"
                />
                <u-input v-model="listParams.keyword" placeholder="NGO명, 배너 제목으로 검색" />
                <u-button type="submit" size="sm" color="primary" icon="i-lucide-search" />
              </u-field-group>
            </div>
          </u-form-field>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { NgoBannerSearchDto } from '@/modules/ngo-banner/type/ngo-banner.type';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import PDaySelect from '@/modules/_common/components/date-picker/p-day-select.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();

// 플랫폼 옵션
const platformList = ref([
  { text: '전체', value: '' },
  { text: '네이버', value: 'naver' },
  { text: '카카오톡', value: 'kakao' }
]);

// 검색 옵션
const optList = ref([
  { text: '전체', value: '' },
  { text: 'NGO명', value: 'ngoName' },
  { text: '배너제목', value: 'bannerTitle' }
]);

// 검색 파라미터 로컬 상태로 관리
const listParams = ref<NgoBannerSearchDto>({
  startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  opt: '',
  platform: ''
});

const setDate = (date: any) => {
  listParams.value.startDate = date.startDate;
  listParams.value.endDate = date.endDate;
};

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
    startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    opt: '',
    platform: ''
  };
  router.push({
    query: {
      ...route.query,
      ...listParams.value,
      sortBy: 'crawledDate',
      sortType: 'desc',
      sortData: 'crawledDate,desc',
      row: 10,
      page: 1
    }
  });
};

// URL watch 패턴 (필수)
watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      // 검색 관련 파라미터만 listParams에 적용
      const { startDate, endDate, keyword, opt, platform } = route.query;
      Object.assign(listParams.value, { startDate, endDate, keyword, opt, platform });
    } else {
      // 검색 파라미터 초기화
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
