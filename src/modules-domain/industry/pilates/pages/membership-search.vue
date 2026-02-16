<template>
  <form @submit.prevent="listAction">
    <div class="flex flex-col gap-4 rounded-custom8 bg-white dark:bg-black141414">
      <div class="space-y-2">
        <!-- 키워드 검색 -->
        <div class="flex flex-row items-center gap-2">
          <p-input-box
            v-model="listParams.keyword"
            placeholder="고객명 검색"
            class="w-full"
          />
          <u-button type="submit" color="primary" class="whitespace-nowrap">검색</u-button>
        </div>
        <!-- 필터 -->
        <div class="flex flex-row flex-wrap items-center gap-2">
          <p-nuxt-select
            v-model="listParams.membershipType"
            placeholder="전체 멤버십유형"
            :options="membershipTypeOptions"
            class="w-full md:w-40"
            @update:model-value="listAction"
          />
          <p-nuxt-select
            v-model="listParams.status"
            placeholder="전체 상태"
            :options="statusOptions"
            class="w-full md:w-40"
            @update:model-value="listAction"
          />
        </div>
        <!-- 액션 버튼 -->
        <div class="flex w-full flex-row items-center gap-3">
          <u-button
            class="flex flex-1 justify-center"
            color="neutral"
            variant="soft"
            icon="i-lucide-rotate-ccw"
            label="초기화"
            @click="resetAction"
          />
          <u-button
            class="flex flex-1 justify-center"
            color="primary"
            icon="i-lucide-plus"
            label="등록"
            @click="goInsert"
          />
        </div>
      </div>
    </div>
  </form>

  <membership-insert-modal v-model:open="isOpenInsert" @insert-ok="listAction" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import type { MembershipPagingDto } from '../type/pilates.type';
import MembershipInsertModal from './membership-insert.modal.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

const route = useRoute();
const router = useRouter();

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

const isOpenInsert = ref(false);

const membershipTypeOptions = [
  { text: '전체 멤버십유형', value: '' },
  { text: '기본', value: '기본' },
  { text: '프리미엄', value: '프리미엄' },
  { text: 'VIP', value: 'VIP' }
];

const statusOptions = [
  { text: '전체 상태', value: '' },
  { text: '활성', value: '활성' },
  { text: '만료', value: '만료' },
  { text: '일시정지', value: '일시정지' }
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
    membershipType: '',
    status: '',
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
      ...listParams.value
    }
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      const { keyword, membershipType, status } = route.query;
      Object.assign(listParams.value, { keyword, membershipType, status });
    } else {
      resetAction();
    }
  },
  { immediate: true, deep: true }
);
</script>
