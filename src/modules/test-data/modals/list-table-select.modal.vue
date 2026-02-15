<template>
  <u-modal v-model:open="isOpen" :ui="{ content: 'min-w-sm max-w-[900px]' }" title="코드선택">
    <template #body>
      <div class="text-custom_size_24 text-custom_subject pb-[15px] font-semibold">데이터선택</div>

      <form name="searchForm" @submit.prevent="listAction">
        <u-field-group class="w-full">
          <u-input v-model="listParams.keyword" placeholder="키워드를 입력하세요." class="w-full" />
          <u-button
            size="sm"
            color="primary"
            class="w-10 items-center justify-center"
            icon="i-lucide-search"
            @click="listAction"
          />
        </u-field-group>
        <div class="flex items-center justify-between pt-2">
          <div class="flex items-center space-x-2">
            <div class="md:w-[80px]">
              <p-nuxt-select
                v-model="listParams.row"
                :options="rowList"
                value-key="value"
                @change="listAction"
              />
            </div>
            <div>선택({{ checkSelectList.length }}개)</div>
          </div>
        </div>
      </form>

      <div v-if="listData.length > 0" class="mt-2">
        <easy-data-table
          v-model:server-options="listParams"
          v-model:items-selected="checkBoxList"
          class="easy-rounded-table"
          theme-color="#E57E5D"
          :server-items-length="listTotalRow"
          :headers="headers"
          :items="listData"
          header-text-direction="center"
          body-text-direction="center"
          hide-footer
          @update-sort="updateSort"
          @click-row="onTableRowClick"
        >
          <template #item-handle="item">
            <div class="flex justify-center gap-2">
              <u-button size="sm" color="neutral" variant="soft" @click="oneSelect(item)"
                >선택</u-button
              >
            </div>
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

      <div
        class="mt-2 mb-2 flex flex-wrap gap-2 overflow-y-scroll border border-gray-300 p-2"
        style="height: 100px"
      >
        <div v-for="(item, index) in checkSelectList" :key="index" @click="selectRemove(item)">
          <u-badge size="sm" class="mr-2 cursor-pointer" trailing-icon="i-lucide-x" variant="soft">
            {{ item.testSeq }}
          </u-badge>
        </div>
      </div>

      <div class="mt-3 flex justify-center gap-3">
        <u-button color="neutral" @click="close">취소</u-button>
        <u-button @click="checkSelect">선택완료</u-button>
      </div>

      {{ listParams }}

      <div class="mt-2">
        <div class="font-board-title">선택 Data</div>
        {{ checkSelectList }}
      </div>

      <div class="mt-2">
        <div class="font-board-title">리스트 체크 Data</div>
        {{ checkBoxList }}
      </div>
    </template>
  </u-modal>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import EasyDataTable, { type Header } from 'vue3-easy-data-table';
import type { TestDataDetail, TestDataPagingDto } from '@/modules/test-data/type/test-data.type.ts';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import dayjs from 'dayjs';

// Props 정의
interface Props {
  open: boolean;
  selectList?: any[];
}
const props = defineProps<Props>();

const testDataStore = useTestDataStore();

// 컴퓨티드로 store 값 참조
const listData = computed(() => testDataStore.listData);
const listTotalRow = computed(() => testDataStore.listTotalRow);

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// 로컬 검색 파라미터 정의
const listParams = ref({} as TestDataPagingDto);

const emit = defineEmits(['update:open', 'close', 'select-ok']);

const checkBoxList: any = ref<any[]>([]);
const checkSelectList: any = ref<any[]>([]);

const rowList = [
  { text: '3개', value: 3 },
  { text: '5개', value: 5 },
  { text: '7개', value: 7 },
  { text: '8개', value: 8 },
  { text: '10개', value: 10 }
];

const headers: Header[] = [
  { text: '아이디', value: 'testSeq' },
  { text: '제목', value: 'subject' },
  { text: '비고', value: 'handle', width: 150 }
];

// 로컬 검색 파라미터 초기화 함수
const listParamsInit = () => {
  listParams.value = {
    startDate: dayjs().subtract(5, 'year').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    opt: 'all',
    isUse: '',
    selected: '',

    // 기본 정렬 설정
    sortBy: 'insertDate',
    sortType: 'desc',
    sortData: 'insertDate,desc',
    row: 10, // row 값
    page: 1, // 페이지 초기화
    time: new Date().getTime().toString()
  };
};

const onTableRowClick = (_item: any, event: Event) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'input') return;
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'button') return;
  const checkbox: HTMLElement | null = (event.currentTarget as HTMLElement).querySelector(
    'input[type=checkbox]'
  );
  if (checkbox) checkbox.click();
};

const updateSort = (sort: any) => {
  if (sort.sortType == null) sort.sortType = 'asc';
  listParams.value.sortData = `${sort.sortBy},${sort.sortType}`;
  listParams.value.sortBy = sort.sortBy;
  listParams.value.sortType = sort.sortType;
  listAction();
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  getList();
};

const listAction = () => {
  listParams.value.page = 1;
  getList();
};

/**
 * 한건 선택
 * @param selectData
 */
const oneSelect = (selectData: TestDataDetail) => {
  emit('select-ok', [selectData]);
  close();
};

/**
 * 선택 제거
 * @param selectData
 */
const selectRemove = (selectData: TestDataDetail) => {
  const checkBoxIndex = checkBoxList.value.findIndex(
    (item: any) => item.testSeq === selectData.testSeq
  );
  if (checkBoxIndex !== -1) checkBoxList.value.splice(checkBoxIndex, 1);

  const checkSelectIndex = checkSelectList.value.findIndex(
    (item: any) => item.testSeq === selectData.testSeq
  );
  if (checkSelectIndex !== -1) checkSelectList.value.splice(checkSelectIndex, 1);
};

/**
 * 선택 완료
 */
const checkSelect = () => {
  emit('select-ok', checkSelectList.value);
  close();
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const onModalOpen = () => {
  //체크박스 초기화
  checkBoxList.value = [];
  checkSelectList.value = [];

  //검색 파라미터 초기화
  listParamsInit();

  // 모달용 검색 파라미터 설정
  listParams.value.keyword = '';
  listParams.value.page = 1;
  listParams.value.row = 10;
  listParams.value.sortData = 'insertDate,desc';

  Object.assign(checkSelectList.value, props.selectList || []);

  getList();
};

const getList = async () => {
  console.log('getList 호출 - listParams:', listParams.value);

  await FormService.loading(async () => {
    try {
      // store의 paging 함수에 파라미터 전달
      await testDataStore.paging(listParams.value);

      console.log('API 호출 완료 - listData:', listData.value);
      console.log('API 호출 완료 - listTotalRow:', listTotalRow.value);

      //체크박스 선택 처리
      checkSelectList.value.forEach((foItem: any) => {
        const matchingItem = listData.value.find(
          (listItem: any) => listItem.testSeq === foItem.testSeq
        );
        if (!matchingItem) return;

        const isAlreadyInCheckBoxList = checkBoxList.value.some(
          (item: any) => item.testSeq === matchingItem.testSeq
        );
        if (!isAlreadyInCheckBoxList) {
          const copiedItem = { ...matchingItem }; //값 복사(참조복사 방지)
          checkBoxList.value.push(copiedItem);
        }
      });
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  });
};

watch(
  () => checkBoxList.value,
  () => {
    listData.value.forEach((listItem: any) => {
      const isItemInCheckBoxList = checkBoxList.value.some(
        (item: any) => item.testSeq === listItem.testSeq
      );

      const indexInCheckSelectList = checkSelectList.value.findIndex(
        (item: any) => item.testSeq === listItem.testSeq
      );

      if (isItemInCheckBoxList) {
        // Add if not already in checkSelectList
        if (indexInCheckSelectList === -1) {
          const copiedItem = { ...listItem }; //값 복사(참조복사 방지)
          checkSelectList.value.push(copiedItem);
        }
      } else {
        // Remove only from checkSelectList
        if (indexInCheckSelectList !== -1) {
          checkSelectList.value.splice(indexInCheckSelectList, 1);
        }
      }
    });
  },
  { deep: true }
);

// 모달이 열릴 때 초기화
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      onModalOpen();
    }
  }
);
</script>
