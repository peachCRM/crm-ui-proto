<template>
  <div class="flex items-center justify-between py-5">
    <div class="flex items-center gap-3">
      <p-nuxt-select
        v-model="listParams.sortData"
        :options="sortList"
        class="w-32"
        @change="handleSortChange"
      />
      <p-nuxt-select
        v-model="listParams.row"
        :options="rowList"
        class="w-20"
        @change="listAction"
      />
      <div class="text-sm text-gray-600">선택({{ listCheckBoxs.length }}개)</div>
    </div>
    <div class="flex space-x-2">
      <u-button variant="solid" color="primary" @click="goInsert">주문 등록</u-button>
    </div>
  </div>

  <div v-if="listData.length > 0">
    <easy-data-table
      v-model:server-options="listParams"
      v-model:items-selected="listCheckBoxs"
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
      <template #item-nIndex="item">
        {{ rowNumber - item.nIndex }}
      </template>
      <template #item-orderNo="item">
        <div class="cursor-pointer font-medium text-primary hover:underline" @click="goDetail(item.orderSeq)">
          {{ item.orderNo }}
        </div>
      </template>
      <template #item-productInfo="item">
        <div class="flex items-center gap-2">
          <img
            v-if="item.productImageUrl"
            :src="item.productImageUrl"
            :alt="item.productName"
            class="h-10 w-10 rounded object-cover"
          />
          <div class="text-left">
            <div class="font-medium">{{ item.productName }}</div>
            <div class="text-xs text-gray-500">{{ item.quantity }}개</div>
          </div>
        </div>
      </template>
      <template #item-ordererName="item">
        <div>
          <div>{{ item.ordererName }}</div>
          <div class="text-xs text-gray-500">{{ item.ordererPhone }}</div>
        </div>
      </template>
      <template #item-receiverName="item">
        <div>
          <div>{{ item.receiverName }}</div>
          <div class="text-xs text-gray-500">{{ item.receiverPhone }}</div>
        </div>
      </template>
      <template #item-totalAmount="item">
        <div class="text-right font-medium">{{ item.totalAmount?.toLocaleString() }}원</div>
      </template>
      <template #item-orderStatus="item">
        <div class="flex justify-center">
          <u-badge :color="getStatusColor(item.orderStatus)" variant="soft">
            {{ getStatusName(item.orderStatus) }}
          </u-badge>
        </div>
      </template>
      <template #item-paymentMethod="item">
        {{ getPaymentMethodName(item.paymentMethod) }}
      </template>
      <template #item-orderDate="item">
        {{ dayjs(item.orderDate).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template #item-handle="item">
        <div class="flex justify-center gap-1">
          <u-button variant="soft" color="primary" size="xs" @click.stop="goDetail(item.orderSeq)">
            보기
          </u-button>
        </div>
      </template>
    </easy-data-table>
  </div>
  <div v-else class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">조회된 주문이 없습니다.</div>
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

  <!-- 모달들 -->
  <insert v-model:open="isOpenInsert" @insert-ok="listAction" />
  <detail :order-seq="selectedKey" v-model:open="isOpenDetail" @remove-ok="listAction" @go-update="goUpdate" />
  <update :order-seq="selectedKey" v-model:open="isOpenUpdate" @update-ok="listAction" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useOrderStore } from '@/modules-guide/order/store/order.store.ts';
import type { OrderListItem, OrderPagingDto } from '@/modules-guide/order/type/order.type';
import { type Header } from 'vue3-easy-data-table';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

// 모달 컴포넌트 임포트
import Detail from '../modals/detail.modal.vue';
import Insert from '../modals/insert.modal.vue';
import Update from '../modals/update.modal.vue';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const listData = computed(() => orderStore.listData);
const listTotalRow = computed(() => orderStore.listTotalRow);

// 페이지별 첫 번호 계산
const rowNumber = computed(() =>
  listTotalRow.value - listParams.value.row * (listParams.value.page - 1)
);

// 체크박스 선택 상태 로컬 관리
const listCheckBoxs = ref<OrderListItem[]>([]);

// selectedKey 로컬 상태로 관리
const selectedKey = ref(0);

// 테이블 파라미터 로컬 상태로 관리
const listParams = ref({} as OrderPagingDto);

// 모달 상태
const isOpenInsert = ref(false);
const isOpenDetail = ref(false);
const isOpenUpdate = ref(false);

// 정렬 옵션
const sortList = [
  { text: '주문일순', value: 'orderDate,asc' },
  { text: '주문일역순', value: 'orderDate,desc' },
  { text: '금액순', value: 'totalAmount,asc' },
  { text: '금액역순', value: 'totalAmount,desc' }
];

// 페이지당 표시 개수 옵션
const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 }
];

const headers: Header[] = [
  { text: '번호', value: 'nIndex', width: 60 },
  { text: '주문번호', value: 'orderNo', width: 140 },
  { text: '상품정보', value: 'productInfo', width: 200 },
  { text: '주문자', value: 'ordererName', width: 120 },
  { text: '받는사람', value: 'receiverName', width: 120 },
  { text: '결제금액', value: 'totalAmount', width: 120, sortable: true },
  { text: '결제수단', value: 'paymentMethod', width: 100 },
  { text: '주문상태', value: 'orderStatus', width: 100 },
  { text: '주문일시', value: 'orderDate', width: 140, sortable: true },
  { text: '관리', value: 'handle', width: 70 }
];

// 상태 관련 헬퍼 함수
const statusMap: Record<string, { name: string; color: string }> = {
  pending: { name: '주문접수', color: 'warning' },
  confirmed: { name: '결제완료', color: 'info' },
  shipped: { name: '배송중', color: 'primary' },
  delivered: { name: '배송완료', color: 'success' },
  cancelled: { name: '주문취소', color: 'error' }
};

const getStatusName = (status: string) => statusMap[status]?.name || status;
const getStatusColor = (status: string) => (statusMap[status]?.color || 'neutral') as 'warning' | 'info' | 'primary' | 'success' | 'error' | 'neutral';

const paymentMethodMap: Record<string, string> = {
  card: '카드결제',
  bank: '계좌이체',
  cash: '무통장입금'
};
const getPaymentMethodName = (method: string) => paymentMethodMap[method] || method;

// 액션 메서드들
const goDetail = (orderSeq: number) => {
  selectedKey.value = orderSeq;
  isOpenDetail.value = true;
};

const goInsert = () => {
  isOpenInsert.value = true;
};

const goUpdate = (orderSeq: number) => {
  if (isOpenDetail.value) isOpenDetail.value = false;
  selectedKey.value = orderSeq;
  isOpenUpdate.value = true;
};

const listMovePage = (page: number) => {
  listParams.value.page = page;
  listAction();
};

const listAction = () => {
  listParams.value.time = dayjs().format('YYYYMMDDHHmmssSSS');
  router.push({ query: { ...route.query, ...listParams.value } });
};

const handleSortChange = () => {
  listParams.value.sortBy = listParams.value.sortData?.split(',')[0];
  listParams.value.sortType = listParams.value.sortData?.split(',')[1];
  listAction();
};

const updateSort = (sortBy: string, sortType: string) => {
  listParams.value.sortBy = sortBy;
  listParams.value.sortType = sortType;
  listParams.value.sortData = `${sortBy},${sortType}`;
  listAction();
};

const onTableRowClick = (item: OrderListItem, event: Event) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'button') return;
  goDetail(item.orderSeq);
};

const getList = async () => {
  await FormService.loading(async () => {
    await orderStore.paging(listParams.value);

    if (listData.value.length === 0 && listParams.value.page > 1) {
      await router.push({ query: { ...route.query, page: 1 } });
      return;
    }
  });
};

// URL watch 패턴
watch(
  route,
  () => {
    if (route.query && Object.keys(route.query).length > 0) {
      Object.assign(listParams.value, route.query);
      listParams.value.page = Number(listParams.value.page);
      listParams.value.row = Number(listParams.value.row);

      if (route.path === '/guide/domain/order/list') {
        getList();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
