<template>
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{ content: 'min-w-sm max-w-[800px]', footer: 'justify-end' }"
    :modal="false"
    title="주문 상세"
  >
    <template #body>
      <div class="space-y-6">
        <!-- 주문 기본 정보 -->
        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <div class="text-sm text-gray-500">주문번호</div>
            <div class="text-lg font-bold">{{ detailData.orderNo }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">주문일시</div>
            <div>{{ detailData.orderDate }}</div>
          </div>
          <u-badge :color="getStatusColor(detailData.orderStatus)" variant="soft" size="lg">
            {{ getStatusName(detailData.orderStatus) }}
          </u-badge>
        </div>

        <!-- 상품 정보 -->
        <div>
          <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">상품 정보</h3>
          <div class="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
            <img
              v-if="detailData.productImageUrl"
              :src="detailData.productImageUrl"
              :alt="detailData.productName"
              class="h-20 w-20 rounded object-cover"
            />
            <div v-else class="flex h-20 w-20 items-center justify-center rounded bg-gray-200">
              <u-icon name="i-lucide-image" class="text-2xl text-gray-400" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-lg">{{ detailData.productName }}</div>
              <div class="text-sm text-gray-500">상품코드: {{ detailData.productCode }}</div>
              <div class="mt-2">
                <span class="text-gray-600">{{ detailData.unitPrice?.toLocaleString() }}원</span>
                <span class="mx-2 text-gray-400">×</span>
                <span class="text-gray-600">{{ detailData.quantity }}개</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 주문자 정보 -->
        <div>
          <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">주문자 정보</h3>
          <div class="grid grid-cols-3 gap-4">
            <u-form-field label="주문자명">
              <div class="rounded bg-gray-50 p-2">{{ detailData.ordererName }}</div>
            </u-form-field>
            <u-form-field label="연락처">
              <div class="rounded bg-gray-50 p-2">{{ detailData.ordererPhone }}</div>
            </u-form-field>
            <u-form-field label="이메일">
              <div class="rounded bg-gray-50 p-2">{{ detailData.ordererEmail || '-' }}</div>
            </u-form-field>
          </div>
        </div>

        <!-- 받는사람 정보 -->
        <div>
          <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">받는사람 정보</h3>
          <div class="grid grid-cols-2 gap-4">
            <u-form-field label="받는사람">
              <div class="rounded bg-gray-50 p-2">{{ detailData.receiverName }}</div>
            </u-form-field>
            <u-form-field label="연락처">
              <div class="rounded bg-gray-50 p-2">{{ detailData.receiverPhone }}</div>
            </u-form-field>
          </div>
          <u-form-field label="배송지" class="mt-4">
            <div class="rounded bg-gray-50 p-2">
              <span v-if="detailData.receiverZipcode">[{{ detailData.receiverZipcode }}] </span>
              {{ detailData.receiverAddress }} {{ detailData.receiverAddressDetail }}
            </div>
          </u-form-field>
          <u-form-field label="배송메모" class="mt-4">
            <div class="rounded bg-gray-50 p-2">{{ detailData.deliveryMemo || '-' }}</div>
          </u-form-field>
        </div>

        <!-- 결제 정보 -->
        <div>
          <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">결제 정보</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex justify-between py-2">
              <span class="text-gray-600">상품금액</span>
              <span>{{ ((detailData.unitPrice || 0) * (detailData.quantity || 0)).toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">배송비</span>
              <span>{{ detailData.shippingFee?.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">할인금액</span>
              <span class="text-error">-{{ detailData.discountAmount?.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between py-2 border-t mt-2 pt-2">
              <span class="font-bold">총 결제금액</span>
              <span class="font-bold text-lg text-primary">{{ detailData.totalAmount?.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between py-2 text-sm text-gray-500">
              <span>결제수단</span>
              <span>{{ getPaymentMethodName(detailData.paymentMethod) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <u-button color="error" variant="outline" @click="remove">주문취소</u-button>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button @click="goUpdate">수정</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useOrderStore } from '@/modules-guide/order/store/order.store.ts';

interface Props {
  open: boolean;
  orderSeq: number;
}
const props = defineProps<Props>();

const orderStore = useOrderStore();
const { detailData } = storeToRefs(orderStore);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'remove-ok', 'go-update']);

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

const close = () => {
  isOpen.value = false;
  emit('close');
};

const goUpdate = () => {
  emit('go-update', props.orderSeq);
};

const remove = async () => {
  if (!confirm('이 주문을 취소하시겠습니까?')) return;

  await FormService.loading(async () => {
    const result = await orderStore.updateStatus(props.orderSeq, 'cancelled');
    if (result.isSuccess) {
      FormService.toastMessage('주문이 취소되었습니다.', 'success');
      emit('remove-ok');
      close();
    }
  });
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await orderStore.detail(props.orderSeq);
  });
};

// 모달이 열릴 때 데이터 로드
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      getDetail();
    }
  }
);
</script>
