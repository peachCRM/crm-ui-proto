<template>
  <div class="rounded-custom8 dark:bg-black141414 w-[340px] bg-white p-6">
    <!-- S : SEARCH -->
    <div class="mb-3">
      <div class="flex flex-col gap-2">
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex-grow">
            <WorkSelectboxComponent
              v-model="listParams.bizType"
              title="개인/법인"
              :options="platformStore.optTaxiClientBizType"
              @change="listAction"
            />
          </div>
          <div class="flex-grow">
            <WorkSelectboxComponent
              v-model="listParams.empSeq"
              title="담당직원"
              :options="platformStore.optTaxiEmpListSearch"
              @change="listAction"
            />
          </div>
        </div>
        <!-- E : ROW -->
        <!-- S : ROW -->
        <div class="flex flex-row justify-between gap-1.5">
          <div class="flex-grow">
            <WorkInputboxComponent
              v-model="listParams.keyword"
              name="keyword"
              placeholder="이름/연락처/수임업체명"
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
          <div class="flex-grow">수임업체(담당자, 연락처)</div>
        </div>
        <PerfectScrollbar>
          <div class="content flex flex-col overflow-y-auto">
            <template v-for="item in list" :key="item.addrSeq">
              <div
                class="text-fontsize14 text-customGray1f1 hover:bg-customSkyBlue1 dark:text-grayd9d9d9 dark:hover:bg-black111a2c dark:border-gray303030 flex min-h-[46px] cursor-pointer items-center border-b border-[#F0F0F0] text-center leading-[22px]"
                :class="{ 'bg-customSkyBlue1 dark:bg-black111a2c': item.chk }"
                @click="selectOnly(item)"
              >
                <div v-if="props.showCheckbox" class="mx-1 w-4 shrink-0">
                  <input v-model="item.chk" type="checkbox" @change="handleInput($event, item)" />
                </div>
                <div class="w-14">
                  <TaxiBizType v-if="item.taxiClient.bizType" :biz-type="item.taxiClient.bizType" />
                </div>
                <div class="flex items-center gap-1 pl-0.5 text-left">
                  <span
                    :class="{
                      'text-redF52':
                        ItaxClientAcceptState.DIS === String(item.taxiClient.acceptState)
                    }"
                    class="text-xs"
                    >{{ item.taxiClient.clientName }}<br />({{ item.addrName }},
                    {{ item.hpNumber }})</span
                  >
                  <!-- ({{ item.addrName }}, {{ item.hpNumber }}) -->
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
      </div>
    </div>
    <!-- E : TABLE -->
  </div>

  <ModalClientInsert v-model="isOpenInsert" @insert-ok="listAction" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import PPaginationWork from '@/modules/_common/components/pagination/p-pagination-work.vue';
import ModalClientInsert from '@/pages/taxi/client/modal-clientInsert.vue';
import TaxiBizType from '@/modules/_common/components/layouts/itax/bizType.vue';
import { useMessagingPopbillStore } from '@/modules/common/store/messagingPopbill.store.ts';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
import { ItaxClientAcceptState } from '@/modules/_common/constants/itax.client.constants.ts';
import { TaxiClientAddrService } from '@/modules-domain/client-addr/store/taxiClientAddr.service.ts';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type {
  TaxiClientAddr,
  TaxiClientAddrPagingDto
} from '@/modules-domain/client-addr/type/taxiClientAddr.dto.ts';

const isOpenInsert = ref(false);

const clientStore = useMessagingPopbillStore();
const platformStore = usePlatformStore();

const list = ref<TaxiClientAddr[]>([]);
const totalRow = ref<number>(0);
const isSelected = ref(false);

const props = defineProps({
  showCheckbox: {
    type: Boolean,
    default: false
  },
  isSelectView: {
    type: Boolean,
    default: false
  },
  searchScrapReqSeqList: {
    type: Array,
    default: () => []
  },
  searchClientSeqList: {
    type: Array,
    default: () => []
  }
});

type ListParamsType = TaxiClientAddrPagingDto & {
  row: number;
  page: number;
  sortData: string;
  sortBy: string;
  sortType: string;
};
const listParams = ref<ListParamsType>({
  row: 50,
  page: 1,
  sortData: '`insertDate,desc`',
  sortBy: '',
  sortType: '',
  keyword: '',
  clientDivision: 0,
  bizType: 0,
  empSeq: 0,
  groupSeq: 0
} as ListParamsType);

const containerHeight = ref(500);

onMounted(() => {
  initStore();
  initChecked();
});

// clientStore 초기화
const initStore = () => {
  clientStore.selectList = [];
  clientStore.selectOnly = {};
  clientStore.receiverList = [];
};

// 초기 체크 값 처리
const initChecked = async () => {
  if (props.searchScrapReqSeqList.length === 0 && props.searchClientSeqList.length === 0) {
    getList();
    return;
  }

  const param: Partial<TaxiClientAddrPagingDto> = {
    searchScrapReqSeqList: props.searchScrapReqSeqList?.join(',') || '',
    searchClientSeqList: props.searchClientSeqList?.join(',') || '',
    pagingMode: false
  };
  const result = await TaxiClientAddrService.paging(param as TaxiClientAddrPagingDto);

  result?.content?.list.forEach((item: any) => {
    const selectListConvertItem = {
      addrName: item.addrName,
      addrSeq: item.addrSeq,
      chk: true,
      clientSeq: item.clientSeq,
      email: item.email,
      hpNumber: item.hpNumber,
      clientName: item.taxiClient?.clientName
    };
    clientStore.selectList.push(selectListConvertItem);
  });
  getList();
};

const selectAll = computed({
  get() {
    const filterList = list.value.filter((e) => isValidPhoneNumber(e.hpNumber));
    const chkList = list.value.filter((e) => e.chk === true);

    return filterList.length > 0 && filterList.length === chkList.length;
  },
  set(value) {
    list.value.forEach((item) => {
      if (isValidPhoneNumber(item.hpNumber)) {
        item.chk = value;
      }
    });
  }
});

const toggleSelectAll = (e: any) => {
  const newValue = !selectAll.value;
  list.value.forEach((item) => {
    item.chk = newValue;
  });

  if (e.target.checked) {
    list.value.forEach((item: any) => {
      if (!isValidPhoneNumber(item.hpNumber)) {
        FormService.toastMessage('유효하지 않은 휴대폰번호가 있습니다.', 'error');
        item.chk = false;
      } else {
        item.chk = true;
        const isDuplicate = clientStore.selectList.some(
          (selectedItem: any) => selectedItem.addrSeq === item.addrSeq
        );
        if (!isDuplicate) {
          const selectListConvertItem = {
            addrName: item.addrName,
            addrSeq: item.addrSeq,
            chk: item.chk,
            clientSeq: item.clientSeq,
            email: item.email,
            hpNumber: item.hpNumber,
            clientName: item.taxiClient?.clientName
          };
          clientStore.selectList.push(selectListConvertItem);
          // clientStore.selectList.push(item);
        }
      }
    });
  } else {
    list.value.forEach((item) => {
      item.chk = false;
    });

    clientStore.selectList = clientStore.selectList.filter(
      (client: any) => !list.value.some((item: any) => item.addrSeq === client.addrSeq) // addrSeq로 비교해서 같은 항목을 제외
    );
  }
};

// @input 이벤트에서 상태 변경
const handleInput = (event: any, item: any) => {
  if (!isValidPhoneNumber(item.hpNumber)) {
    event.target.checked = false;
    item.chk = false;
    return;
  }
  item.chk = event.target.checked;
};

const selectRow = (item: any) => {
  isSelected.value = true;

  const isDuplicate = clientStore.selectList.some(
    (selectedItem: any) => selectedItem.addrSeq === item.addrSeq
  );

  if (item.chk && !isDuplicate) {
    const selectListConvertItem = {
      addrName: item.addrName,
      addrSeq: item.addrSeq,
      chk: item.chk,
      clientSeq: item.clientSeq,
      email: item.email,
      hpNumber: item.hpNumber,
      clientName: item.taxiClient?.clientName
    };

    clientStore.selectList.push(selectListConvertItem);
    // clientStore.selectList.push(item);
  } else if (!item.chk && isDuplicate) {
    clientStore.selectList = clientStore.selectList.filter(
      (selectedItem: any) => selectedItem.addrSeq !== item.addrSeq
    );
  }
};
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
};
const selectOnly = (item: any) => {
  if (!isValidPhoneNumber(item.hpNumber)) {
    FormService.toastMessage('받는 분 휴대폰번호가 유효하지 않습니다.', 'error');
    return;
  }

  if (!props.showCheckbox) {
    clientStore.selectOnly = item;
    list.value.forEach((listItem) => {
      listItem.chk = listItem === item;
    });
    return;
  }
  item.chk = !item.chk;
  selectRow(item);
};

const getList = async () => {
  listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
  listParams.value.sortType = listParams.value.sortData?.split(',')[1];
  const result = await TaxiClientAddrService.paging(listParams.value);

  list.value = result.content.list;
  totalRow.value = result.content.totalRow;
  list.value.forEach((item) => {
    if (clientStore.selectList.some((selectedItem: any) => selectedItem.addrSeq === item.addrSeq)) {
      item.chk = true;
    }
  });
};

const listAction = () => {
  if (listParams.value.sortBy === 'insertDate') {
    listParams.value.sortType = 'desc';
  } else {
    listParams.value.sortType = 'asc';
  }
  getList();
};

watch(
  () => clientStore.selectList,
  (newList) => {
    list.value.forEach((item) => {
      if (!newList.some((selectedItem: any) => selectedItem.addrSeq === item.addrSeq)) {
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

defineExpose({
  getList
});
</script>

<style scoped lang="scss">
input[type='checkbox'] {
  cursor: pointer;
}
</style>
