<template>
  <!-- S : CONTENT -->
  <div class="flex flex-col gap-3 px-6">
    <!-- S : SEARCH -->
    <div class="mb-3">
      <div class="flex flex-col gap-2">
        <!-- S : ROW -->
        <div class="flex flex-row gap-1.5">
          <div class="flex-grow">
            <WorkInputboxComponent
              v-model="listParams.keyword"
              name="keyword"
              placeholder="수임업체명/대표자명"
              @keydown.enter="getList"
            />
          </div>
          <div class="flex-grow">
            <WorkSelectboxComponent
              v-model="listParams.bizType"
              title="개인/법인"
              :options="platformStore.optTaxiClientBizType"
              @change="getList"
            />
          </div>
          <div class="flex-grow">
            <WorkSelectboxComponent
              v-model="listParams.empSeq"
              title="담당직원"
              :options="platformStore.optTaxiEmpListSearch"
              @change="getList"
            />
          </div>
          <div class="flex flex-shrink-0 flex-row">
            <WorkButtonComponent color="btn_search_md" @click="getList">검색</WorkButtonComponent>
          </div>
        </div>
        <!-- E : ROW -->
      </div>
    </div>
    <!-- E : SEARCH -->
    <!-- S : 수임업체 조회 -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-6">
        <!-- S : CONTENT -->
        <div class="flex flex-row items-start">
          <div
            class="table_work scrollbar-thin flex h-[450px] w-full min-w-[328px] flex-col gap-4 overflow-y-auto"
          >
            <table class="relative w-full">
              <colgroup>
                <col style="width: 45px" />
                <col style="width: 45px" />
                <col style="width: auto" />
                <col style="width: 140px" />
                <col style="width: 90px" />
              </colgroup>
              <thead>
                <tr>
                  <th class="sticky top-0">
                    <input
                      ref="allCheckbox"
                      v-model="selectAll"
                      type="checkbox"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th class="sticky top-0">구분</th>
                  <th class="sticky top-0">수임업체</th>
                  <th class="sticky top-0">대표자명</th>
                  <th class="sticky top-0">담당 연락처</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in list" :key="item.id">
                  <tr style="cursor: pointer" @click="selectOnly(item)">
                    <td><input v-model="item.chk" type="checkbox" /></td>
                    <td><TaxiBizType v-if="item.bizType" :biz-type="item.bizType" /></td>
                    <td class="text-left">
                      <TaxiBizType :biz-type="999" :text="item.clientCode" /> {{ item.clientName }}
                    </td>
                    <td>{{ item.ceoName }}</td>
                    <td>
                      <div class="flex items-center justify-center">
                        <template v-if="item.isUnregistered">
                          <WorkButtonComponent color="btn_tertiary_del_sm" class="flex-shrink-0">
                            미등록
                          </WorkButtonComponent>
                        </template>
                        <template v-else>
                          <span>{{ item.addrs.length }} 명</span>
                        </template>
                      </div>
                    </td>
                  </tr>
                </template>
                <template v-if="list.length === 0">
                  <tr>
                    <td colspan="5" class="h-[100px] text-center">
                      <span class="text-customgray8c8">조회된 내역이 없습니다.</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!-- E : CONTENT -->
      </div>
    </div>
    <!-- E : 수임업체 조회 -->

    <p-pagination-work
      v-if="list.length"
      v-model:current-page="listParams.page"
      :items-per-page="listParams.row"
      :total-count="totalRow"
      @move="movePage"
    />

    <div
      class="border-customGrayE4E rounded-custom8 dark:border-gray424242 scrollbar-thin mb-3 h-[120px] overflow-y-auto border p-4"
    >
      <div class="flex flex-wrap gap-2.5">
        <div
          v-for="item in useMessaging.selectList"
          :key="item.clientSeq"
          class="text-fontsize12 text-customBlue167 bg-customSkyBlue1 rounded-custom4 dark:bg-black111a2c dark:text-customBlue167 flex h-[22px] items-center gap-1 border border-[#91CAFF] px-2 dark:border-[#15325B]"
        >
          {{ item.clientName }}
          <img
            src="../../../../../assets/images/workspace/scraping/close.svg"
            class="block cursor-pointer dark:hidden"
            alt="닫기"
            @click="removeItem(item)"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- E : CONTENT -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useMessagingPopbillStore } from '@/modules/common/store/messagingPopbill.store.ts';
import PPaginationWork from '@/modules/_common/components/pagination/p-pagination-work.vue';
import { TaxiClientAddrService } from '@/modules-domain/client-addr/store/taxiClientAddr.service.ts';
import type {
  TaxiClientAddr,
  TaxiClientAddrPagingDto
} from '@/modules-domain/client-addr/type/taxiClientAddr.dto.ts';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
import type { TaxiClient } from '@/modules-domain/client/types/taxiClient.dto.ts';
const allCheckbox = ref<HTMLInputElement | null>(null);
import TaxiBizType from '@/modules/_common/components/layouts/itax/bizType.vue';

const useMessaging = useMessagingPopbillStore();
const platformStore = usePlatformStore();

type ListItemType = TaxiClient & {
  isUnregistered: boolean;
  chk: boolean;
  addrs: TaxiClientAddr[];
};
const list = ref<ListItemType[]>([]);
const totalRow = ref<number>(0);
type ListParamsType = TaxiClientAddrPagingDto & {
  row: number;
  page: number;
  addrs: string;
};
const listParams = ref({
  row: 20,
  page: 1,
  keyword: ''
} as ListParamsType);

defineProps<{
  modalProps: number;
}>();

const selectAll = computed(() => list.value.every((item) => item.chk) && list.value.length > 0);
const toggleSelectAll = () => {
  const newValue = !selectAll.value;
  list.value.forEach((item: any) => {
    item.chk = newValue;

    if (newValue) {
      useSelectList(item);
    }
  });

  if (!selectAll.value) {
    useMessaging.selectList = useMessaging.selectList.filter(
      (selectedItem: any) => !list.value.some((item) => item.clientSeq === selectedItem.clientSeq)
    );
  }
};

const selectRow = (item: any) => {
  if (item.chk) {
    useSelectList(item);
  } else {
    useMessaging.selectList = useMessaging.selectList.filter(
      (selectedItem: any) => selectedItem.clientSeq !== item.clientSeq
    );
  }
};

// 선택 항목 store 저장
const useSelectList = (item: any) => {
  const isDuplicate = useMessaging.selectList.some(
    (selectedItem: any) => selectedItem.clientSeq === item.clientSeq
  );
  if (!isDuplicate) {
    const selectListConvertItem = {
      chk: item.chk,
      clientSeq: item.clientSeq,
      bizType: item.bizType,
      clientCode: item.clientCode,
      clientName: item.clientName,
      addrs: item.addrs,
      messageContent: '' // 내용
    };
    useMessaging.selectList.push(selectListConvertItem);
  }
};

const selectOnly = (item: any) => {
  item.chk = !item.chk;

  selectRow(item);
};

// 선택된 항목을 제거
const removeItem = (item: any) => {
  useMessaging.selectList = useMessaging.selectList.filter(
    (selectedItem: any) => selectedItem.clientSeq !== item.clientSeq
  );
};

const getList = async () => {
  const result = await TaxiClientAddrService.addrs(listParams.value);

  list.value = result.content.list.map((item: any) => ({
    ...item,
    isUnregistered: !item.addrs || item.addrs.length === 0,
    chk: useMessaging.selectList.some(
      (selectedItem: any) => selectedItem.clientSeq === item.clientSeq
    )
  }));

  totalRow.value = result.content.totalRow;
};

onMounted(() => {
  getList();
});

const movePage = (page: number) => {
  listParams.value.page = page;
  getList();
};

// 일부 체크 상태 계산
const isSomeChecked = computed(() => list.value.some((item) => item.chk) && !selectAll.value);

// 전체 체크박스 상태 관리
watch([selectAll, isSomeChecked], ([some]) => {
  if (allCheckbox.value) {
    allCheckbox.value.indeterminate = some;
  }
});

watch(
  () => useMessaging.selectList,
  (newList) => {
    list.value.forEach((item) => {
      if (!newList.some((selectedItem: any) => selectedItem.clientSeq === item.clientSeq)) {
        item.chk = false;
      }
    });
  },
  { deep: true }
);
/**
 * 모달창 저장 실행 후 닫기 처리
 */
const emit = defineEmits(['close', 'fnSaveLoad']);
const fnSave = () => {
  useMessaging.sendSelectList = [...useMessaging.selectList];
  emit('fnSaveLoad');
  emit('close');
};
defineExpose({ fnSave });
</script>

<style scoped></style>
