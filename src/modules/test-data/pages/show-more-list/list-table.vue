<template>
  <div class="flex items-center justify-between py-5">
    <div class="flex items-center gap-3">
      <div>총 {{ listData.length }}개의 항목</div>
    </div>
  </div>

  <div v-if="listData.length > 0">
    <easy-data-table
      :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
      class="easy-rounded-table"
      theme-color="#2B7FFF"
      :headers="headers"
      :items="listData"
      :rows-per-page="999999"
      header-text-direction="center"
      body-text-direction="center"
      hide-footer
      @click-row="onTableRowClick"
    >
      <template #header-value="header">
        {{ header.text }}
      </template>
      <template #item-subject="item">
        <div
          class="d-flex align-items-center cursor-pointer text-start"
          @click="goDetail(item.testSeq)"
        >
          {{ item.subject }}

          <template v-if="item.fileList.length > 0">
            <u-icon name="i-lucide-paperclip" class="inline" />
          </template>
        </div>
      </template>
      <template #item-isUse="item">
        <div class="flex justify-center">
          <u-switch
            :model-value="getIsUse(item)"
            @update:model-value="(value: boolean) => changeIsUse(item, value)"
          />
        </div>
      </template>
      <template #item-insertDate="item">
        {{ dayjs(item.insertDate).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template #item-handle="item">
        <div class="flex justify-center gap-1">
          <u-button variant="soft" color="primary" size="xs" @click.stop="goDetail(item.testSeq)">
            보기
          </u-button>
        </div>
      </template>
    </easy-data-table>

    <!-- Show More 버튼 -->
    <div v-if="hasMore" class="mt-6 flex justify-center">
      <u-button :loading="isLoading" color="primary" variant="outline" size="lg" @click="loadMore">
        더 보기
      </u-button>
    </div>
  </div>

  <div v-else-if="!isLoading" class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">조회된 내역이 없습니다.</div>
    </u-card>
  </div>

  <!-- 로딩 상태 -->
  <div v-if="isLoading && listData.length === 0" class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">
        <u-icon name="i-lucide-loader-2" class="animate-spin" />
        데이터를 불러오는 중...
      </div>
    </u-card>
  </div>

  <!-- Detail Modal -->
  <detail :test-seq="selectedKey" v-model:open="isOpenDetail" />
</template>

<script setup lang="ts">
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import { useThemeStore } from '@/modules/_common/store/theme.store.ts';
import type { TestDataCursorSearchDto, TestDataDetail } from '@/modules/test-data/type/test-data.type';
import { FormService } from '@/modules/_common/services/form.service.ts';
import dayjs from 'dayjs';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type Header } from 'vue3-easy-data-table';
import Detail from '../../modals/detail.modal.vue';

const route = useRoute();
const router = useRouter();
const testDataStore = useTestDataStore();
const themeStore = useThemeStore();

// 로컬 상태로 cursor-based 리스트 데이터 관리
const listData = ref<TestDataDetail[]>([]);
const currentCursor = ref<string | null>(null);
const hasMore = ref<boolean>(true);
const isLoading = ref<boolean>(false);

// Modal 상태
const isOpenDetail = ref(false);
const selectedKey = ref(0);

// 검색 파라미터 로컬 상태로 관리
const listParams = ref<TestDataCursorSearchDto>({
  startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  opt: 'all',
  isUse: '',
  selected: '',
  limit: 10
});

// 테이블 헤더 설정
const headers: Header[] = [
  { text: '아이디', value: 'testSeq', width: 100, sortable: true },
  { text: '제목', value: 'subject', width: 300, sortable: true },
  { text: 'value', value: 'value', width: 100 },
  { text: 'value', value: 'value', width: 100 },
  { text: '사용여부', value: 'isUse', width: 100 },
  { text: '등록일', value: 'insertDate', width: 150, sortable: true },
  { text: '비고', value: 'handle', width: 80 }
];

const isUse = ref<Record<number, boolean>>({});
const getIsUse = (item: TestDataDetail) => {
  return isUse.value[item.testSeq] ?? false;
};

const changeIsUse = async (item: TestDataDetail, value: boolean) => {
  // 반응형 상태 즉시 업데이트
  isUse.value[item.testSeq] = value;
  console.log(item, value);
  await FormService.loading(async () => {
    await testDataStore.updateUse(item.testSeq, value ? 'Y' : 'N');

    FormService.toastMessage('사용여부가 변경되었습니다.', 'success');
  });
};

// 테이블 행 클릭 처리
const onTableRowClick = (item: TestDataDetail, event: Event) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'button') return;
  goDetail(item.testSeq);
};

// 더 보기 데이터 로드
const loadMore = async () => {
  if (!hasMore.value || isLoading.value) return;

  isLoading.value = true;
  try {
    const params = {
      limit: listParams.value.limit,
      cursor: currentCursor.value || undefined,
      keyword: listParams.value.keyword || undefined
    };

    const result = await testDataStore.cursorList(params);

    // 기존 데이터에 새 데이터 추가
    listData.value = [...listData.value, ...result.list];
    currentCursor.value = result.nextCursor;
    hasMore.value = !!result.nextCursor;

    // isUse 상태 설정
    result.list.forEach((item) => {
      isUse.value[item.testSeq] = item.isUse === 'Y';
    });
  } catch (error) {
    console.error('Failed to load more data:', error);
  } finally {
    isLoading.value = false;
  }
};

// 상세 보기
const goDetail = (testSeq: number) => {
  selectedKey.value = testSeq;
  isOpenDetail.value = true;
};

// 검색 초기화 (부모 컴포넌트에서 호출)
const handleReset = () => {
  const params = {
    startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    opt: 'all',
    isUse: '',
    selected: '',
    limit: 10
  };
  router.push({
    query: {
      ...route.query,
      ...params
    }
  });
};

// 초기 데이터 조회
const getList = async () => {
  await FormService.loading(async () => {
    isLoading.value = true;
    try {
      const params = {
        limit: listParams.value.limit,
        cursor: undefined,
        keyword: listParams.value.keyword || undefined
      };

      const result = await testDataStore.cursorList(params);

      // 새로운 검색이므로 기존 데이터 초기화
      listData.value = result.list;
      currentCursor.value = result.nextCursor;
      hasMore.value = !!result.nextCursor;

      // isUse 상태 설정
      result.list.forEach((item) => {
        isUse.value[item.testSeq] = item.isUse === 'Y';
      });
    } finally {
      isLoading.value = false;
    }
  });
};

// 라우트 변경 감지 및 데이터 로드
watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      // 검색 관련 파라미터만 listParams에 적용
      const { startDate, endDate, keyword, opt, isUse, selected, limit } = route.query;
      Object.assign(listParams.value, { startDate, endDate, keyword, opt, isUse, selected });

      // 숫자 타입 변환
      if (limit) listParams.value.limit = Number(limit);

      // 라우트 파라미터가 있고 특정 페이지일 때만 조회
      if (route.path === '/test/show-more-list/list') {
        getList();
      }
    } else {
      // 파라미터가 없으면 초기화
      handleReset();
    }
  },
  { immediate: true, deep: true }
);
</script>
