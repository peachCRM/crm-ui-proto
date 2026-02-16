<template>
  <div class="flex items-center justify-between py-5">
    <div class="flex items-center gap-3">
      <u-button variant="outline" size="sm" @click="removeCheck">선택삭제</u-button>
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
      <u-button variant="solid" color="primary" @click="goInsert">상품 등록</u-button>
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
      <template #item-imageUrl="item">
        <div class="flex justify-center py-2">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.productName"
            class="h-12 w-12 rounded object-cover"
          />
          <div v-else class="flex h-12 w-12 items-center justify-center rounded bg-gray-200">
            <u-icon name="i-lucide-image" class="text-gray-400" />
          </div>
        </div>
      </template>
      <template #item-productName="item">
        <div class="cursor-pointer text-start hover:text-primary" @click="goDetail(item.productSeq)">
          {{ item.productName }}
        </div>
      </template>
      <template #item-price="item">
        <div class="text-right">{{ item.price?.toLocaleString() }}원</div>
      </template>
      <template #item-stockQty="item">
        <div class="text-right">{{ item.stockQty?.toLocaleString() }}개</div>
      </template>
      <template #item-isUse="item">
        <div class="flex justify-center">
          <u-badge :color="item.isUse === 'Y' ? 'success' : 'error'" variant="soft">
            {{ item.isUse === 'Y' ? '판매중' : '판매중지' }}
          </u-badge>
        </div>
      </template>
      <template #item-insertDate="item">
        {{ dayjs(item.insertDate).format('YYYY-MM-DD') }}
      </template>
      <template #item-handle="item">
        <div class="flex justify-center gap-1">
          <u-button variant="soft" color="primary" size="xs" @click.stop="goDetail(item.productSeq)">
            보기
          </u-button>
        </div>
      </template>
    </easy-data-table>
  </div>
  <div v-else class="py-5 text-center">
    <u-card>
      <div class="mt-5 mb-5">조회된 상품이 없습니다.</div>
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
  <detail :product-seq="selectedKey" v-model:open="isOpenDetail" @remove-ok="listAction" @go-update="goUpdate" />
  <update :product-seq="selectedKey" v-model:open="isOpenUpdate" @update-ok="listAction" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useProductStore } from '@/modules-guide/product/store/product.store.ts';
import type { ProductListItem, ProductPagingDto } from '@/modules-guide/product/type/product.type';
import { type Header } from 'vue3-easy-data-table';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

// 모달 컴포넌트 임포트
import Detail from '../modals/detail.modal.vue';
import Insert from '../modals/insert.modal.vue';
import Update from '../modals/update.modal.vue';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const listData = computed(() => productStore.listData);
const listTotalRow = computed(() => productStore.listTotalRow);

// 페이지별 첫 번호 계산
const rowNumber = computed(() =>
  listTotalRow.value - listParams.value.row * (listParams.value.page - 1)
);

// 체크박스 선택 상태 로컬 관리
const listCheckBoxs = ref<ProductListItem[]>([]);

// selectedKey 로컬 상태로 관리
const selectedKey = ref(0);

// 테이블 파라미터 로컬 상태로 관리
const listParams = ref({} as ProductPagingDto);

// 모달 상태
const isOpenInsert = ref(false);
const isOpenDetail = ref(false);
const isOpenUpdate = ref(false);

// 정렬 옵션
const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' },
  { text: '상품명순', value: 'productName,asc' },
  { text: '가격순', value: 'price,asc' },
  { text: '가격역순', value: 'price,desc' }
];

// 페이지당 표시 개수 옵션
const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '30개', value: 30 },
  { text: '50개', value: 50 }
];

const headers: Header[] = [
  { text: '번호', value: 'nIndex', width: 80 },
  { text: '이미지', value: 'imageUrl', width: 100 },
  { text: '상품코드', value: 'productCode', width: 120 },
  { text: '상품명', value: 'productName', width: 250, sortable: true },
  { text: '카테고리', value: 'category', width: 100 },
  { text: '판매가', value: 'price', width: 120, sortable: true },
  { text: '재고', value: 'stockQty', width: 100 },
  { text: '상태', value: 'isUse', width: 100 },
  { text: '등록일', value: 'insertDate', width: 120, sortable: true },
  { text: '관리', value: 'handle', width: 80 }
];

// 액션 메서드들
const goDetail = (productSeq: number) => {
  selectedKey.value = productSeq;
  isOpenDetail.value = true;
};

const goInsert = () => {
  isOpenInsert.value = true;
};

const goUpdate = (productSeq: number) => {
  if (isOpenDetail.value) isOpenDetail.value = false;
  selectedKey.value = productSeq;
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

const onTableRowClick = (item: ProductListItem, event: Event) => {
  if ((event.target as HTMLElement).tagName.toLowerCase() === 'button') return;
  goDetail(item.productSeq);
};

const removeCheck = async () => {
  if (listCheckBoxs.value.length === 0) {
    FormService.toastMessage('삭제할 상품을 선택해주세요.', 'warning');
    return;
  }
  if (!confirm('선택한 상품을 삭제하시겠습니까?')) return;

  await FormService.loading(async () => {
    const seqs = listCheckBoxs.value.map((item) => item.productSeq);
    await productStore.softDelete(seqs);
    FormService.toastMessage('삭제되었습니다.', 'success');
    listCheckBoxs.value = [];
    listAction();
  });
};

const getList = async () => {
  await FormService.loading(async () => {
    await productStore.paging(listParams.value);

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

      if (route.path === '/guide/domain/product/list') {
        getList();
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
