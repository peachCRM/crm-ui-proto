<template>
  <div class="flex items-center justify-between py-5">
    <div class="flex items-center gap-2">
      <p-nuxt-select
        v-model="listParams.sortData"
        :options="sortList"
        class="w-[140px]"
        @change="handleSortChange"
      />
      <p-nuxt-select
        v-model="listParams.row"
        :options="rowList"
        class="w-20"
        @change="listAction"
      />
    </div>
    <div class="text-sm text-gray-500">
      총 <span class="font-semibold text-gray-900 dark:text-white">{{ listTotalRow }}</span>건
    </div>
  </div>

  <div v-if="listData.length > 0">
    <easy-data-table
      v-model:server-options="listParams"
      :server-items-length="listTotalRow"
      :headers="headers"
      :items="listData"
      :sort-by="listParams.sortBy"
      :sort-type="listParams.sortType"
      server-side-sorting
      hide-footer
      @update-sort="updateSort"
      @click-row="onTableRowClick"
    >
      <!-- 번호 -->
      <template #item-nIndex="{ nIndex }">
        {{ nIndex }}
      </template>

      <!-- 플랫폼 -->
      <template #item-platform="{ platform }">
        <u-badge
          :color="platform === 'naver' ? 'success' : 'warning'"
          variant="subtle"
        >
          {{ platform === 'naver' ? '네이버' : '카카오톡' }}
        </u-badge>
      </template>

      <!-- 배너 이미지 미리보기 -->
      <template #item-bannerImageUrl="{ bannerImageUrl }">
        <div class="py-1">
          <img
            :src="bannerImageUrl"
            alt="배너 이미지"
            class="h-10 max-w-[120px] rounded border object-cover"
            loading="lazy"
          />
        </div>
      </template>

      <!-- 배너 링크 -->
      <template #item-bannerLinkUrl="{ bannerLinkUrl }">
        <a
          :href="bannerLinkUrl"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'inline-flex items-center gap-1',
            'text-primary hover:underline'
          ]"
        >
          <span class="max-w-[200px] truncate">{{ bannerLinkUrl }}</span>
          <i class="i-lucide-external-link h-3 w-3" />
        </a>
      </template>

      <!-- 크롤링 일시 -->
      <template #item-crawledDate="{ crawledDate }">
        {{ formatDate(crawledDate) }}
      </template>
    </easy-data-table>
  </div>
  <div v-else class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
    </u-card>
  </div>

  <div v-if="listData.length > 0" class="flex justify-center py-3">
    <u-pagination
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
      @update:page="listMovePage"
    />
  </div>

  <!-- 상세 모달 -->
  <detail-modal
    :banner-seq="selectedKey"
    v-model:open="isOpenDetail"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useNgoBannerStore } from '@/modules-guide/ngo-banner/store/ngo-banner.store.ts';
import type { NgoBannerPagingDto } from '@/modules-guide/ngo-banner/type/ngo-banner.type';
import { type Header } from 'vue3-easy-data-table';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import DetailModal from '../modals/detail.modal.vue';

const route = useRoute();
const router = useRouter();
const ngoBannerStore = useNgoBannerStore();
const listData = computed(() => ngoBannerStore.listData);
const listTotalRow = computed(() => ngoBannerStore.listTotalRow);

// selectedKey 로컬 상태로 관리
const selectedKey = ref(0);

// 테이블 파라미터 로컬 상태로 관리
const listParams = ref({} as NgoBannerPagingDto);

// 모달 상태
const isOpenDetail = ref(false);

// 정렬 옵션
const sortList = [
  { text: '크롤링일순', value: 'crawledDate,asc' },
  { text: '크롤링일역순', value: 'crawledDate,desc' },
  { text: 'NGO명순', value: 'ngoName,asc' },
  { text: 'NGO명역순', value: 'ngoName,desc' }
];

// 페이지당 표시 개수 옵션
const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 },
  { text: '100개', value: 100 }
];

const headers: Header[] = [
  { text: '번호', value: 'nIndex', width: 70, fixed: true },
  { text: '플랫폼', value: 'platform', width: 100 },
  { text: 'NGO 단체명', value: 'ngoName', width: 150, sortable: true },
  { text: '배너 제목', value: 'bannerTitle', width: 250, sortable: true },
  { text: '배너 이미지', value: 'bannerImageUrl', width: 150 },
  { text: '배너 링크', value: 'bannerLinkUrl', width: 250 },
  { text: '크롤링 일시', value: 'crawledDate', width: 160, sortable: true }
];

// 날짜 포맷
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm');
};

// 상세 모달 열기
const goDetail = (bannerSeq: number) => {
  selectedKey.value = bannerSeq;
  isOpenDetail.value = true;
};

// 테이블 행 클릭
const onTableRowClick = (item: any) => {
  goDetail(item.bannerSeq);
};

const listMovePage = async (page: number) => {
  listParams.value.page = page;
  listAction();
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

// 정렬 변경 핸들러
const handleSortChange = () => {
  listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
  listParams.value.sortType = listParams.value.sortData?.split(',')[1];
  listAction();
};

// 테이블 헤더 정렬 클릭
const updateSort = (sortBy: string, sortType: string) => {
  listParams.value.sortBy = sortBy;
  listParams.value.sortType = sortType;
  listParams.value.sortData = `${sortBy},${sortType}`;
  listAction();
};

const getList = async () => {
  await FormService.loading(async () => {
    await ngoBannerStore.paging(listParams.value);

    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
      return;
    }
  });
};

// URL watch 패턴 (필수)
watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      // route 파라미터를 listParams에 적용
      Object.assign(listParams.value, route.query);
      listParams.value.page = Number(listParams.value.page);
      listParams.value.row = Number(listParams.value.row);

      // route 파라미터가 있고 특정 페이지일 때만 조회
      if (route.path === '/guide/domain/ngo-banner/list') {
        getList();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
