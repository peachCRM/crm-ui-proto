<template>
  <form @submit.prevent="listAction">
    <div class="w-full rounded-lg bg-white">
      <div class="space-y-3 p-6" :class="{ 'pb-0': isSearchExpanded }">
        <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
          <div class="w-20 shrink-0 font-semibold text-gray-600">조회기간</div>
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
          <div class="w-20 shrink-0 text-center font-semibold text-gray-600">키워드</div>
          <div class="flex w-full items-center gap-2">
            <u-input
              v-model="listParams.keyword"
              placeholder="키워드를 입력하세요."
              class="w-full"
            />
            <u-button
              type="submit"
              color="primary"
              class="items-center justify-center whitespace-nowrap"
            >
              검색
            </u-button>
            <u-button
              color="primary"
              variant="soft"
              label="상세검색"
              :trailing-icon="isSearchExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              @click="toggleSearch"
              class="transition-all duration-200"
            />
          </div>
        </div>
        <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
          <div class="w-20 shrink-0 font-semibold text-gray-600">거래처</div>
          <p-nuxt-select
            v-model="listParams.opt"
            :options="optList"
            class="w-full lg:w-[160px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.opt"
            :options="optList"
            class="w-full lg:w-[110px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.opt"
            :options="optList"
            class="w-full lg:w-[80px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.opt"
            :options="optList"
            class="w-full lg:w-[100px]"
            @change="listAction"
          />
          <p-nuxt-select
            v-model="listParams.opt"
            :options="optList"
            class="w-full lg:w-[100px]"
            @change="listAction"
          />
          <p-input-box
            v-model="listParams.keyword"
            placeholder="거래처를 입력하세요."
            class="w-full lg:w-[220px]"
          />
        </div>
      </div>
      <div v-if="isSearchExpanded" class="overflow-hidden">
        <div class="mt-3 flex flex-col gap-3 p-6 pt-0">
          <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
            <div class="w-20 shrink-0 font-semibold text-gray-600">상세검색</div>
            <div class="flex flex-col gap-2 lg:flex-row">
              <p-nuxt-select
                v-model="listParams.opt"
                :options="optList"
                class="w-full lg:w-1/5"
                @change="listAction"
              />
              <p-nuxt-select
                v-model="listParams.opt"
                :options="optList"
                class="w-full lg:w-1/5"
                @change="listAction"
              />
              <p-nuxt-select
                v-model="listParams.opt"
                :options="optList"
                class="w-full lg:w-1/5"
                @change="listAction"
              />
              <p-nuxt-select
                v-model="listParams.opt"
                :options="optList"
                class="w-full lg:w-1/5"
                @change="listAction"
              />
              <p-nuxt-select
                v-model="listParams.opt"
                :options="optList"
                class="w-full lg:w-1/5"
                @change="listAction"
              />
            </div>
            <div class="w-20 shrink-0 text-center font-semibold text-gray-600">거래처</div>
            <u-input v-model="listParams.keyword" placeholder="거래처를 입력하세요." />
          </div>
          <div class="flex w-full flex-col items-center gap-3 lg:flex-row">
            <div class="w-20 shrink-0 font-semibold text-gray-600">사용여부</div>
            <u-radio-group
              v-model="listParams.isUse"
              :items="optIsUseList"
              variant="list"
              orientation="horizontal"
              @change="listAction"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isSearchExpanded"
        class="flex justify-between overflow-hidden rounded-b-lg border-t border-gray-300 bg-gray-50 p-3"
      >
        <u-button
          icon="i-lucide-rotate-ccw"
          color="neutral"
          variant="ghost"
          size="sm"
          label="초기화"
          @click="resetAction"
        />
        <div class="flex items-center gap-2">
          <u-button
            color="primary"
            type="submit"
            icon="i-lucide-search"
            size="sm"
            label="상세조건 검색"
          />
          <u-button
            variant="outline"
            color="neutral"
            size="sm"
            label="닫기"
            @click="toggleSearch"
            class="transition-all duration-200 hover:scale-105"
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
import type { TestDataSearchDto } from '@/modules/test-data/type/test-data.type';
import PDaySelect from '@/modules/_common/components/date-picker/p-day-select.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
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

// 검색 영역 확장/축소 상태
const isSearchExpanded = ref(false);

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};

const optList = ref([
  { text: '전체', value: '' },
  { text: '예시1', value: 'example1' },
  { text: '예시2', value: 'example2' },
  { text: '예시3', value: 'example3' }
]);

const optIsUseList = ref([
  { label: '전체', value: '' },
  { label: '사용', value: 'Y' },
  { label: '미사용', value: 'N' }
]);

const setDate = (date: any) => {
  listParams.value.startDate = date.startDate;
  listParams.value.endDate = date.endDate;
};

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
      //검색 파라미터 초기화
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
