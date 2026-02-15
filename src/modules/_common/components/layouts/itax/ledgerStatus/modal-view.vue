<template>
  <!-- S : CONTENT -->
  <div class="flex flex-col px-6 min-h-[800px]">
    <div>
      <perfect-scrollbar class="w-full h-[800px]">
        <!-- 수임업체 기본 정보 -->
        <div class="mb-6 w-[99%]">
          <h2 class="text-lg font-medium py-3">수임업체 기본 정보</h2>
          <div class="table_work dark:table_work_dark">
            <table class="w-full">
              <colgroup>
                <col style="width: 120px" />
                <col style="width: 120px" />
                <col style="width: 120px" />
                <col style="width: 120px" />
                <col style="width: 120px" />
              </colgroup>
              <thead>
                <tr>
                  <th>등록번호</th>
                  <th>기수</th>
                  <th>회계기간</th>
                  <th>대표자</th>
                  <th>업태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ taxClient.clientCode }}</td>
                  <td>{{ taxClient.accountOrdinal }}</td>
                  <td>{{ taxClient.accountPeriodFrom }} ~ {{ taxClient.accountPeriodTo }}</td>
                  <td>{{ taxClient.ceoName }}</td>
                  <td>{{ taxClient.bizCategory }}</td>
                </tr>
                <tr>
                  <th colspan="2">품목</th>
                  <th>수임구분</th>
                  <th>월수임계약금액</th>
                  <th>담당자</th>
                </tr>
                <tr>
                  <td colspan="2">{{ taxClient.bizItem }}</td>
                  <td>{{ taxClient.clientDivision }}</td>
                  <td>{{ taxClient.chargeAmt }}</td>
                  <td>{{ taxClient.empName }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 기장전도형황 상세 정보 -->
        <div class="mb-6 w-[99%]">
          <h2 class="text-lg font-medium py-3">기장진도현황 상세 정보</h2>
          <div class="w-full">
            <table class="w-full border-collapse border border-customGrayE4E">
              <!-- 테이블 헤더 -->
              <thead>
                <tr class="bg-gray-100">
                  <th colspan="2" rowspan="2" class="border border-customGrayE4E p-2">기간</th>
                  <th colspan="2" class="border border-customGrayE4E p-2">일반전표</th>
                  <th colspan="4" class="border border-customGrayE4E p-2">매입매출전표</th>
                </tr>
                <tr class="bg-gray-100">
                  <th class="p-2">건수</th>
                  <th class="border border-customGrayE4E p-2">금액</th>
                  <th class="border border-customGrayE4E p-2">매입건수</th>
                  <th class="border border-customGrayE4E p-2">매입금액</th>
                  <th class="border border-customGrayE4E p-2">매출건수</th>
                  <th class="border border-customGrayE4E p-2">매출금액</th>
                </tr>
              </thead>
              <!-- 테이블 바디 -->
              <tbody>
                <template v-for="(month, index) in 12" :key="index">
                  <!-- 전기 행 -->
                  <tr>
                    <th rowspan="2" class="border border-customGrayE4E p-2 text-center bg-gray-100">
                      {{ month }}월
                    </th>
                    <th class="border border-customGrayE4E p-2 text-center bg-gray-100">전기</th>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.generalStateNumArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.generalStateAmountArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.purchaseNumArray[month - 1]?.toLocaleString() ||
                        '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.purchaseAmountArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.salesNumArray[month - 1]?.toLocaleString() ||
                        '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.prevYearProgress.salesAmountArray[month - 1]?.toLocaleString() ||
                        '-'
                      }}
                    </td>
                  </tr>
                  <!-- 당기 행 -->
                  <tr>
                    <th class="border border-customGrayE4E p-2 text-center bg-gray-100">당기</th>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.generalStateNumArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.generalStateAmountArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.purchaseNumArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.purchaseAmountArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.salesNumArray[month - 1]?.toLocaleString() ||
                        '-'
                      }}
                    </td>
                    <td class="border border-customGrayE4E p-2 text-right">
                      {{
                        modalProps.currentYearProgress.salesAmountArray[
                          month - 1
                        ]?.toLocaleString() || '-'
                      }}
                    </td>
                  </tr>
                </template>

                <!-- 합계 행 -->
                <tr class="bg-gray-50">
                  <th
                    rowspan="2"
                    class="border border-customGrayE4E p-2 text-center font-bold bg-gray-100"
                  >
                    합계
                  </th>
                  <th class="border border-customGrayE4E p-2 text-center font-bold bg-gray-100">
                    전기
                  </th>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.prevYearProgress.generalStateNumTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{
                      modalProps.prevYearProgress.generalStateAmountTotal?.toLocaleString() || '-'
                    }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.prevYearProgress.purchaseNumTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.prevYearProgress.purchaseAmountTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.prevYearProgress.salesNumTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.prevYearProgress.salesAmountTotal?.toLocaleString() || '-' }}
                  </td>
                </tr>
                <tr class="bg-gray-50">
                  <th class="border border-customGrayE4E p-2 text-center font-bold bg-gray-100">
                    당기
                  </th>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{
                      modalProps.currentYearProgress.generalStateNumTotal?.toLocaleString() || '-'
                    }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{
                      modalProps.currentYearProgress.generalStateAmountTotal?.toLocaleString() ||
                      '-'
                    }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.currentYearProgress.purchaseNumTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{
                      modalProps.currentYearProgress.purchaseAmountTotal?.toLocaleString() || '-'
                    }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.currentYearProgress.salesNumTotal?.toLocaleString() || '-' }}
                  </td>
                  <td class="border border-customGrayE4E p-2 text-right font-bold">
                    {{ modalProps.currentYearProgress.salesAmountTotal?.toLocaleString() || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'vue3-perfect-scrollbar/style.css';
import dayjs from 'dayjs';
import { usePlatformStore } from '@/modules/platform/store/platform.store.ts';
const platformStore = usePlatformStore();

// 인터페이스 정의
interface TaxClient {
  accountOrdinal: number | string;
  clientCode: string;
  clientName: string;
  accountPeriodFrom: string;
  accountPeriodTo: string;
  ceoName: string;
  bizCategory: string;
  bizItem: string;
  chargeAmt: number | string;
  empName: string;
  clientDivision: string;
}

const props = defineProps<{
  modalProps: any;
}>();

const taxClient = ref<TaxClient>({
  accountOrdinal: '',
  clientCode: '',
  clientName: '',
  accountPeriodFrom: '',
  accountPeriodTo: '',
  ceoName: '',
  bizCategory: '',
  bizItem: '',
  chargeAmt: '',
  empName: '',
  clientDivision: ''
});

onMounted(() => {
  if (props.modalProps.taxiClient) {
    taxClient.value.clientCode = props.modalProps.taxiClient.clientCode || '';
    taxClient.value.clientName = props.modalProps.taxiClient.clientName || '';
    taxClient.value.ceoName = props.modalProps.taxiClient.ceoName || '';
    taxClient.value.bizCategory = props.modalProps.taxiClient.bizCategory || '';
    taxClient.value.bizItem = props.modalProps.taxiClient.bizItem || '';
    taxClient.value.chargeAmt = props.modalProps.taxiClient.chargeAmt.toLocaleString() + '원' || '';
    taxClient.value.empName =
      platformStore.optEmpList.find(
        (item) => item.value === props.modalProps.taxiClient.empSeq.toString()
      )?.text || '';
    taxClient.value.clientDivision =
      platformStore.optTaxiClientDivision.find(
        (item) => item.value === props.modalProps.taxiClient.clientDivision.toString()
      )?.text || '';
  }
  taxClient.value.accountOrdinal = props.modalProps.currentYearProgress.accountOrdinal + '기' || '';
  taxClient.value.accountPeriodFrom =
    dayjs(props.modalProps.currentYearProgress.accountPeriodFrom).format('YYYY.MM.DD') || '';
  taxClient.value.accountPeriodTo =
    dayjs(props.modalProps.currentYearProgress.accountPeriodTo).format('YYYY.MM.DD') || '';
});

/**
 * 모달창 저장 실행 후 닫기 처리
 */
const emit = defineEmits(['close']);
const fnSave = () => {
  emit('close');
};
defineExpose({ fnSave });
</script>

<style scoped></style>
