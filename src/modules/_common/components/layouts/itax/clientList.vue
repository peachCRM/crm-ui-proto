<template>
  <div class="rounded-custom8 dark:bg-black141414 w-[340px] bg-white p-6">
    <!-- S : SEARCH -->
    <div class="mb-3">
      <div class="flex flex-col gap-2">
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex flex-shrink-0 flex-row">
            <div
              :class="[
                'text-fontsize14 rounded-tl-custom4 rounded-bl-custom4 flex h-8 cursor-pointer items-center border px-[15px] leading-[22px]',
                selectedTab === 'all'
                  ? 'text-colorPrimary border-colorPrimary dark:border-customBlue167 dark:text-customBlue167'
                  : 'text-customGray1f1 border-customGrayE4E hover:border-colorPrimary hover:text-colorPrimary dark:border-gray424242 dark:text-grayd9d9d9'
              ]"
              @click="selectTab('all')"
            >
              전체
            </div>

            <div
              :class="[
                'text-fontsize14 rounded-tr-custom4 rounded-br-custom4 flex h-8 cursor-pointer items-center border px-[15px] leading-[22px]',
                selectedTab === 'person'
                  ? 'text-colorPrimary border-colorPrimary dark:border-customBlue167 dark:text-customBlue167'
                  : 'text-customGray1f1 border-customGrayE4E hover:border-colorPrimary hover:text-colorPrimary dark:border-gray424242 dark:text-grayd9d9d9'
              ]"
              @click="selectTab('person')"
            >
              내 담당
            </div>
          </div>
          <div class="flex-grow">
            <PSelectBox
              v-model="listParams.empSeq"
              :options="platformStore.optEmpList"
              @change="listAction"
            />
          </div>
        </div>
        <!-- E : ROW -->
        <!-- S : ROW -->
        <div class="flex gap-1.5">
          <div class="flex-grow">
            <PSelectBox
              v-model="listParams.groupSeq"
              :options="platformStore.optTaxiClientGroup"
              @change="listAction"
            />
          </div>
        </div>
        <!-- E : ROW -->
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex-grow">
            <PSelectBox
              v-model="listParams.clientDivision"
              :options="platformStore.optTaxiClientDivision"
              @change="listAction"
            />
          </div>
          <div class="flex-grow">
            <PSelectBox
              v-model="listParams.bizType"
              :options="platformStore.optTaxiClientBizType"
              @change="listAction"
            />
          </div>
        </div>
        <!-- E : ROW -->
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex-grow">
            <PInputBox
              v-model="listParams.keyword"
              name="keyword"
              placeholder="회사코드/수임업체명/대표자 입력"
              @keydown.enter="listAction"
            />
          </div>
          <div class="flex flex-shrink-0 flex-row">
            <WorkButtonComponent color="btn_search_md" @click="listAction"
              >검색</WorkButtonComponent
            >
          </div>
        </div>
        <!-- E : ROW -->
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex-grow">
            <PSelectBox
              v-model="listParams.sortData"
              placeholder="회사코드순"
              :options="optSortBy"
              @change="listAction"
            />
          </div>
          <div class="flex-grow">
            <PSelectBox v-model="listParams.row" :options="optRow" @change="listAction" />
          </div>
        </div>
        <div v-if="props.strBtnView === 'insert'">
          <WorkButtonComponent
            color="btn_secondary_md"
            class="flex w-full items-center justify-center"
            @click="isOpenInsert = true"
            >수임업체 등록</WorkButtonComponent
          >
        </div>
        <div v-if="props.strBtnView === 'autoSearch'">
          <WorkButtonComponent
            color="btn_search_md"
            class="flex w-full items-center justify-center"
          >
            <img src="../../../../../assets/images/workspace/inc/button_add.svg" class="" alt="" />
            자동조회 대상추가
          </WorkButtonComponent>
        </div>
        <!-- E : ROW -->
      </div>
    </div>
    <!-- E : SEARCH -->

    <!-- S : TABLE -->
    <div class="flex min-h-[300px] flex-col gap-4" :style="{ height: containerHeight + 'px' }">
      <div class="flex flex-col overflow-y-auto">
        <div
          class="header text-fontsize14 text-customGray1f1 border-customGrayE4E dark:bg-black141414 dark:border-gray424242 dark:text-grayd9d9d9 flex min-h-[46px] items-center border-t border-b bg-[#F5F5F5] text-center leading-[22px] font-semibold"
        >
          <div v-if="props.showCheckbox" class="mx-1 w-4 shrink-0">
            <input v-model="selectAll" type="checkbox" @change="toggleSelectAll" />
          </div>
          <div class="w-14">구분</div>
          <div class="flex-grow">업체명</div>
        </div>
        <PerfectScrollbar>
          <div class="content flex flex-col overflow-y-auto">
            <template v-for="item in list" :key="item.id">
              <div
                class="text-fontsize14 text-customGray1f1 hover:bg-customSkyBlue1 dark:text-grayd9d9d9 dark:hover:bg-black111a2c dark:border-gray303030 flex min-h-[46px] cursor-pointer items-center border-b border-[#F0F0F0] text-center leading-[22px]"
                :class="{ 'bg-customSkyBlue1 dark:bg-black111a2c': item.chk }"
                @click="selectOnly(item)"
              >
                <div v-if="props.showCheckbox" class="mx-1 w-4 shrink-0">
                  <input v-model="item.chk" type="checkbox" />
                </div>
                <div class="w-14">
                  <TaxiBizType v-if="item.bizType" :biz-type="item.bizType" />
                </div>
                <div class="flex items-center gap-1 pl-0.5">
                  <TaxiBizType :biz-type="999" :text="item.clientCode" />
                  <span
                    :class="{
                      'text-redF52': ItaxClientAcceptState.DIS === String(item.acceptState)
                    }"
                    >{{ item.clientName }}</span
                  >
                </div>
              </div>
            </template>
          </div>
        </PerfectScrollbar>
      </div>

      <p-pagination-work
        v-if="list.length"
        v-model:current-page="listParams.page"
        :items-per-page="listParams.row"
        :total-count="totalRow"
        @move="movePage"
      />
      <div v-else class="flex flex-col items-center justify-center">
        <div class="text-fontsize16 mt-10 text-center leading-6">수임업체 정보가 없습니다.</div>
        <WorkButtonComponent v-if="false" class="mt-10" color="btn_primary_md" @click="goScraping"
          >수임업체 등록</WorkButtonComponent
        >
      </div>
    </div>
    <!-- E : TABLE -->
  </div>

  <Insert v-model="isOpenInsert" @insert-ok="listAction" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import PPaginationWork from '@/modules/_common/components/pagination/p-pagination-work.vue';
import Insert from '@/modules-domain/client/pages/insert.vue';
import { useTaxiClientStore } from '@/modules/hometax/client/store/client.store.ts';
import { TaxiClientService } from '@/modules-domain/client/store/taxiClient.service.ts';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
import type { TaxiClient, TaxiClientPagingDto } from '@/modules-domain/client/types/taxiClient.dto.ts';
import { ItaxClientAcceptState } from '@/modules/_common/constants/itax.client.constants.ts';
import WorkButtonComponent from '@/modules/_common/components/forms/p-button.vue';
import PSelectBox from '@/modules/_common/components/forms/p-select-box.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import TaxiBizType from './bizType.vue';
import { useRouter } from 'vue-router';

const isOpenInsert = ref(false);

const router = useRouter();
const clientStore = useTaxiClientStore();
const platformStore = usePlatformStore();

const list = ref([] as (TaxiClient & { rowNum: number; chk: boolean })[]);
const totalRow = ref<number>(0);
const isSelected = ref(false);
const emit = defineEmits(['selectClient']);

const props = defineProps({
  showCheckbox: {
    type: Boolean,
    default: false
  },
  isSelectView: {
    type: Boolean,
    default: false
  },
  topHeight: {
    type: [Number, String],
    default: 550
  },
  strBtnView: {
    type: String,
    default: ''
  }
});

type ListParamsType = TaxiClientPagingDto & {
  sortData: string;
};
const listParams = ref({
  row: 50,
  page: 1,
  sortData: 'clientCode,asc',
  sortBy: '',
  sortType: '',
  keyword: ''
} as ListParamsType);

const containerHeight = ref(0);

const updateContainerHeight = () => {
  containerHeight.value = window.innerHeight - Number(props.topHeight);
};
onMounted(() => {
  updateContainerHeight();
  window.addEventListener('resize', updateContainerHeight);
  getList();
  clientStore.selectList = [];
  clientStore.selectOnly = {};
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerHeight);
});

const selectedTab = ref('all');

const selectTab = (tab: string) => {
  selectedTab.value = tab;
  if (tab === 'all') {
    listParams.value.empSeq = 0;
  } else {
    listParams.value.empSeq = platformStore.empSeq;
  }
  listAction();
};

const selectAll = computed(() => list.value.every((item) => item.chk) && list.value.length > 0);
const toggleSelectAll = () => {
  const newValue = !selectAll.value;

  list.value.forEach((item) => {
    item.chk = newValue;
  });

  if (selectAll.value) {
    list.value.forEach((item) => {
      item.chk = true;
      const isDuplicate = clientStore.selectList.some(
        (selectedItem: any) => selectedItem.clientSeq === item.clientSeq
      );
      if (!isDuplicate) {
        clientStore.selectList.push(item);
      }
    });
  } else {
    list.value.forEach((item) => {
      item.chk = false;
    });
    clientStore.selectList = [];
  }
};

const selectRow = (item: any) => {
  isSelected.value = true;

  const isDuplicate = clientStore.selectList.some(
    (selectedItem: any) => selectedItem.clientSeq === item.clientSeq
  );

  if (item.chk && !isDuplicate) {
    clientStore.selectList.push(item);
  } else if (!item.chk && isDuplicate) {
    clientStore.selectList = clientStore.selectList.filter(
      (selectedItem: any) => selectedItem.clientSeq !== item.clientSeq
    );
  }
};

const selectOnly = (item: any) => {
  // 선택된 아이템을 부모 컴포넌트로 전달
  if (props.isSelectView) {
    emit('selectClient', item);
  }

  if (!props.showCheckbox) {
    clientStore.selectOnly = item;
    list.value.forEach((listItem) => {
      listItem.chk = listItem === item;
    });
    // item.chk = !item.chk;
    return;
  }
  item.chk = !item.chk;
  selectRow(item);
};

const getList = async () => {
  listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
  listParams.value.sortType = listParams.value.sortData?.split(',')[1];
  const result = await TaxiClientService.paging(listParams.value);
  list.value = result.content.list.map((item: any, index: number) => ({
    ...item,
    rowNum: totalRow.value - (index + (listParams.value.page - 1) * listParams.value.row),
    chk: clientStore.selectList.some(
      (selectedItem: any) => selectedItem.clientSeq === item.clientSeq
    )
  }));

  totalRow.value = result.content.totalRow;
};

const listAction = () => {
  if (listParams.value.sortBy === 'insertDate') {
    listParams.value.sortType = 'desc';
  } else {
    listParams.value.sortType = 'asc';
  }
  getList();
};

const goScraping = () => {
  router.push('/client/list');
};

watch(
  () => clientStore.selectList,
  (newList) => {
    list.value.forEach((item) => {
      if (!newList.some((selectedItem: any) => selectedItem.clientSeq === item.clientSeq)) {
        item.chk = false;
      }
    });
  },
  { deep: true }
);

const movePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

// 조회 리스트수
const optRow = ref<object[]>([
  { text: '12개', value: '12' },
  { text: '15개', value: '15' },
  { text: '20개', value: '20' },
  { text: '50개', value: '50' },
  { text: '100개', value: '100' },
  { text: '500개', value: '500' }
]);

// 회사코드
const optSortBy = ref<object[]>([
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '수임업체명순', value: 'clientName,asc' },
  { text: '수임업체명역순', value: 'clientName,desc' },
  { text: '개인/법인순', value: 'bizType,asc' },
  { text: '회사코드순', value: 'clientCode,asc' },
  { text: '회사코드역순', value: 'clientCode,desc' },
  { text: '수임업체구분순', value: 'clientDivision,asc' }
]);

defineExpose({
  getList
});
</script>

<style scoped lang="scss"></style>
