<template>
  <form @submit.prevent="listAction">
    <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
      <div class="space-y-2 p-4">
        <!-- 키워드 검색 -->
        <div class="flex flex-row flex-wrap items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명, 매물명 검색"
            class="w-full"
          />
        </div>
        <!-- 상태 필터 -->
        <div class="flex flex-row flex-wrap items-center gap-2">
          <p-nuxt-select
            v-model="listParams.status"
            placeholder="상태"
            :options="statusOptions"
            class="w-full"
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
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { MatchingSearchDto } from '../type/realestate.type';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();

const listParams = ref<MatchingSearchDto>({
  keyword: '',
  status: ''
});

const statusOptions = [
  { text: '전체', value: '' },
  { text: '추천', value: '추천' },
  { text: '상담예정', value: '상담예정' },
  { text: '상담완료', value: '상담완료' },
  { text: '계약', value: '계약' }
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
      page: 1,
      selected: ''
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      const { keyword, status } = route.query;
      Object.assign(listParams.value, { keyword, status });
    } else {
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
