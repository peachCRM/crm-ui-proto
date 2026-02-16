<template>
  <div class="flex items-center justify-between py-5">
    <div class="flex items-center gap-2">
      <u-button variant="outline" color="neutral" @click="checkChangeUse">선택사용</u-button>
      <p-nuxt-select
        v-model="listParams.sortData"
        :options="sortList"
        value-key="value"
        class="w-[120px]"
        @change="handleSortChange"
      />
      <p-nuxt-select
        v-model="listParams.row"
        :options="rowList"
        value-key="value"
        class="w-20"
        @change="listAction"
      />
      <div>선택({{ listCheckBoxs.length }}개)</div>
    </div>
    <div class="flex space-x-2">
      <u-button icon="i-heroicons-document-arrow-down" color="success" @click="downloadExcel"
        >엑셀 다운로드</u-button
      >
      <u-button variant="solid" color="primary" @click="openExcelUpload">엑셀 업로드</u-button>
    </div>
  </div>

  <div v-if="listData.length > 0">
    <easy-data-table
      v-model:server-options="listParams"
      v-model:items-selected="listCheckBoxs"
      :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
      class="easy-rounded-table"
      theme-color="#2B7FFF"
      :server-items-length="listTotalRow"
      :headers="headers"
      :items="listData"
      :sort-by="listParams.sortBy"
      :sort-type="listParams.sortType"
      server-side-sorting
      header-text-direction="center"
      body-text-direction="center"
      hide-footer
      @update-sort="updateSort"
      @click-row="onTableRowClick"
    >
      <template #header-value="header">
        {{ header.text }}
      </template>
      <template #item-nIndex="item">
        {{ rowNumber - item.nIndex }}
      </template>
      <template #item-subject="item">
        <div class="d-flex align-items-center text-start">
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

  <excel-upload-modal
    v-if="isOpenExcelUpload"
    v-model:open="isOpenExcelUpload"
    @upload-ok="handleExcelUpload"
    @close="closeExcelUpload"
  />
</template>

<script setup lang="ts">
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useThemeStore } from '@/modules/_common/store/theme.store.ts';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import type { TestDataListItem, TestDataPagingDto } from '@/modules/test-data/type/test-data.type';
import dayjs from 'dayjs';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type Header } from 'vue3-easy-data-table';
import ExcelUploadModal from '../../modals/excel-upload.modal.vue';

const route = useRoute();
const router = useRouter();
const testDataStore = useTestDataStore();
const themeStore = useThemeStore();
const listData = computed(() => testDataStore.listData);
const listTotalRow = computed(() => testDataStore.listTotalRow);

// 페이지별 첫 번호 계산 (현재 페이지의 시작 순번)
const rowNumber = computed(() =>
    listTotalRow.value - listParams.value.row * (listParams.value.page - 1)
);

// 체크박스 선택 상태 로컬 관리
const listCheckBoxs = ref<TestDataListItem[]>([]);

// 테이블 파라미터 로컬 상태로 관리
const listParams = ref({} as TestDataPagingDto);

const isOpenExcelUpload = ref(false);

const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '아이디', value: 'testSeq,asc' },
  { text: '아이디역순', value: 'testSeq,desc' }
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 },
  { text: '100개', value: 100 }
];

const headers: Header[] = [
  { text: '번호', value: 'nIndex', width: 100, fixed: true },
  { text: '아이디', value: 'testSeq', width: 100, sortable: true },
  { text: '제목', value: 'subject', width: 300, sortable: true },
  { text: 'value', value: 'value', width: 100 },
  { text: '사용여부', value: 'isUse', width: 100 },
  { text: '등록일', value: 'insertDate', width: 100, sortable: true }
];

const isUse = ref<Record<number, boolean>>({});
const getIsUse = (item: any) => {
  return isUse.value[item.testSeq] ?? false;
};

const checkChangeUse = async () => {
  if (!listCheckBoxs.value || !listCheckBoxs.value.length) return alert('선택된 항목이 없습니다.');

  const testSeqList = listCheckBoxs.value.map((item) => item.testSeq);
  await FormService.loading(async () => {
    await testDataStore.updateUse(testSeqList, 'Y');

    // 반응형 상태 즉시 업데이트
    testSeqList.forEach((item) => {
      isUse.value[item] = true;
    });

    // 사용여부 변경 완료
    useToast().add({
      title: '사용여부',
      description: '변경되었습니다.',
      color: 'success'
    });
  });
};

const changeIsUse = async (item: any, value: boolean) => {
  // 반응형 상태 즉시 업데이트
  isUse.value[item.testSeq] = value;
  console.log(item, value);
  await FormService.loading(async () => {
    await testDataStore.updateUse(item.testSeq, value ? 'Y' : 'N');

    useToast().add({
      title: '사용여부',
      description: '변경되었습니다.',
      color: 'success'
    });
  });
};

const onTableRowClick = (_item: any, event: Event) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'input') return;
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'button') return;
  const checkbox: HTMLElement | null = (event.currentTarget as HTMLElement).querySelector(
    'input[type=checkbox]'
  );
  if (checkbox) checkbox.click();
};

const downloadExcel = async () => {
  await FormService.loading(async () => {
    try {
      const blob = await testDataStore.downloadExcel(listParams.value);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `test-data-${dayjs().format('YYYY-MM-DD')}.xlsx`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      useToast().add({
        title: '엑셀 다운로드',
        description: '엑셀 파일이 성공적으로 다운로드되었습니다.',
        color: 'success'
      });
    } catch (error) {
      console.error('❌ 엑셀 다운로드 오류:', error);

      useToast().add({
        title: '엑셀 다운로드 오류',
        description: `엑셀 파일 다운로드 중 오류가 발생했습니다: ${error}`,
        color: 'error'
      });
    }
  });
};

const openExcelUpload = () => {
  isOpenExcelUpload.value = true;
};

const closeExcelUpload = () => {
  isOpenExcelUpload.value = false;
};

const handleExcelUpload = () => {
  useToast().add({
    title: '엑셀 업로드',
    description: '엑셀 데이터가 성공적으로 업로드되었습니다.',
    color: 'success'
  });
  listAction();
};

const handleSortChange = () => {
  listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
  listParams.value.sortType = listParams.value.sortData?.split(',')[1];
  listAction();
};

const updateSort = (sort: any) => {
  if (sort.sortType == null) sort.sortType = 'asc';
  listParams.value.sortData = `${sort.sortBy},${sort.sortType}`;
  router.push({ query: { ...route.query, ...listParams.value, ...sort } });
};

const listMovePage = async (page: number) => {
  listParams.value.page = page;
  listAction();
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const getList = async () => {
  await FormService.loading(async () => {
    await testDataStore.paging(listParams.value);

    //데이터가 없을 경우 첫페이지로 강제 이동 처리
    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
      return;
    }

    listData.value.forEach((item) => {
      isUse.value[item.testSeq] = item.isUse === 'Y';
    });
  });
};

watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      //route 파라미터를 listParams에 적용
      Object.assign(listParams.value, route.query);
      listParams.value.page = Number(listParams.value.page);
      listParams.value.row = Number(listParams.value.row);

      //route 파라미터가 있고 특정 페이지 일때만 조회
      if (route.path == '/guide/pattern/crud-excel/list') {
        getList();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
