<template>
  <!-- 오버레이 -->
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <!-- 모달 -->
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[800px]',
      footer: 'justify-end'
    }"
    :modal="false"
    title="주문 등록"
  >
    <template #body>
      <u-form
        ref="formRef"
        :schema="OrderInsertValidator"
        :state="detailData"
        @submit="register"
        @error="handleFormError"
      >
        <div class="space-y-6">
          <!-- 주문자 정보 -->
          <div>
            <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">주문자 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <u-form-field label="주문자명" name="ordererName" required>
                <u-input v-model="detailData.ordererName" placeholder="주문자명" />
              </u-form-field>
              <u-form-field label="연락처" name="ordererPhone" required>
                <u-input v-model="detailData.ordererPhone" placeholder="010-0000-0000" />
              </u-form-field>
            </div>
            <u-form-field label="이메일" name="ordererEmail" class="mt-4">
              <u-input v-model="detailData.ordererEmail" placeholder="email@example.com" />
            </u-form-field>
          </div>

          <!-- 상품 정보 -->
          <div>
            <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">상품 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <u-form-field label="상품명" name="productName" required>
                <u-input v-model="detailData.productName" placeholder="상품명 입력" />
              </u-form-field>
              <u-form-field label="상품코드" name="productCode">
                <u-input v-model="detailData.productCode" placeholder="상품코드" />
              </u-form-field>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <u-form-field label="단가" name="unitPrice">
                <p-input-box v-model="detailData.unitPrice" is-comma align="right" placeholder="0" />
              </u-form-field>
              <u-form-field label="수량" name="quantity" required>
                <p-input-box v-model="detailData.quantity" is-comma align="right" placeholder="1" />
              </u-form-field>
            </div>
            <u-form-field label="상품 이미지 URL" name="productImageUrl" class="mt-4">
              <u-input v-model="detailData.productImageUrl" placeholder="이미지 URL" />
            </u-form-field>
          </div>

          <!-- 받는사람 정보 -->
          <div>
            <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">받는사람 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <u-form-field label="받는사람" name="receiverName" required>
                <u-input v-model="detailData.receiverName" placeholder="받는사람" />
              </u-form-field>
              <u-form-field label="연락처" name="receiverPhone" required>
                <u-input v-model="detailData.receiverPhone" placeholder="010-0000-0000" />
              </u-form-field>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-4">
              <u-form-field label="우편번호" name="receiverZipcode">
                <u-input v-model="detailData.receiverZipcode" placeholder="우편번호" />
              </u-form-field>
              <u-form-field label="주소" name="receiverAddress" required class="col-span-2">
                <u-input v-model="detailData.receiverAddress" placeholder="주소" />
              </u-form-field>
            </div>
            <u-form-field label="상세주소" name="receiverAddressDetail" class="mt-4">
              <u-input v-model="detailData.receiverAddressDetail" placeholder="상세주소" />
            </u-form-field>
            <u-form-field label="배송메모" name="deliveryMemo" class="mt-4">
              <u-input v-model="detailData.deliveryMemo" placeholder="배송 시 요청사항" />
            </u-form-field>
          </div>

          <!-- 결제 정보 -->
          <div>
            <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">결제 정보</h3>
            <div class="grid grid-cols-2 gap-4">
              <u-form-field label="결제수단" name="paymentMethod" required>
                <p-nuxt-select
                  v-model="detailData.paymentMethod"
                  :options="paymentMethodList"
                />
              </u-form-field>
              <u-form-field label="배송비" name="shippingFee">
                <p-input-box v-model="detailData.shippingFee" is-comma align="right" placeholder="0" />
              </u-form-field>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <u-form-field label="할인금액" name="discountAmount">
                <p-input-box v-model="detailData.discountAmount" is-comma align="right" placeholder="0" />
              </u-form-field>
              <u-form-field label="총 결제금액" name="totalAmount">
                <div class="rounded bg-gray-100 p-2 text-right font-bold text-lg">
                  {{ calculatedTotal.toLocaleString() }}원
                </div>
              </u-form-field>
            </div>
          </div>
        </div>

        <u-button type="submit" class="hidden">저장</u-button>
      </u-form>
    </template>

    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button @click="formSubmit">주문 등록</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { useOrderStore } from '@/modules-guide/order/store/order.store.ts';
import { OrderInsertValidator } from './_order.validator.ts';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';

// Props 정의
interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const orderStore = useOrderStore();
const { detailData } = storeToRefs(orderStore);
const formRef = ref();

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'insert-ok']);

const paymentMethodList = ref([
  { text: '카드결제', value: 'card' },
  { text: '계좌이체', value: 'bank' },
  { text: '무통장입금', value: 'cash' }
]);

// 총 결제금액 계산
const calculatedTotal = computed(() => {
  const unitPrice = Number(detailData.value.unitPrice) || 0;
  const quantity = Number(detailData.value.quantity) || 0;
  const shippingFee = Number(detailData.value.shippingFee) || 0;
  const discountAmount = Number(detailData.value.discountAmount) || 0;
  return (unitPrice * quantity) + shippingFee - discountAmount;
});

// 폼 에러 핸들링
const handleFormError = (event: FormErrorEvent) => {
  FormService.onError(event);
};

const formSubmit = () => {
  if (formRef.value) {
    formRef.value.submit();
  }
};

const register = async () => {
  await FormService.loading(async () => {
    const insertData = {
      orderDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      orderStatus: 'pending',
      ordererName: detailData.value.ordererName,
      ordererPhone: detailData.value.ordererPhone,
      ordererEmail: detailData.value.ordererEmail || '',
      productSeq: detailData.value.productSeq || 0,
      productName: detailData.value.productName,
      productCode: detailData.value.productCode || '',
      productImageUrl: detailData.value.productImageUrl || '',
      quantity: Number(detailData.value.quantity) || 1,
      unitPrice: Number(detailData.value.unitPrice) || 0,
      receiverName: detailData.value.receiverName,
      receiverPhone: detailData.value.receiverPhone,
      receiverZipcode: detailData.value.receiverZipcode || '',
      receiverAddress: detailData.value.receiverAddress,
      receiverAddressDetail: detailData.value.receiverAddressDetail || '',
      deliveryMemo: detailData.value.deliveryMemo || '',
      paymentMethod: detailData.value.paymentMethod,
      totalAmount: calculatedTotal.value,
      shippingFee: Number(detailData.value.shippingFee) || 0,
      discountAmount: Number(detailData.value.discountAmount) || 0
    };
    const result = await orderStore.insert(insertData);
    if (result.isSuccess) {
      FormService.toastMessage('주문이 등록되었습니다.', 'success');
      emit('insert-ok');
      close();
    }
  });
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const initOnCreated = () => {
  orderStore.detailDataInit();
};

// 모달이 열릴 때 초기화
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      initOnCreated();
    }
  }
);

onUnmounted(() => {
  orderStore.detailDataInit();
});
</script>
