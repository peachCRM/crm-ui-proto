<template>
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[700px]',
      footer: 'justify-end'
    }"
    :modal="false"
    title="주문 수정"
  >
    <template #body>
      <u-form
        ref="formRef"
        :schema="OrderUpdateValidator"
        :state="detailData"
        @submit="save"
        @error="handleFormError"
      >
        <div class="space-y-6">
          <!-- 주문 상태 -->
          <div>
            <h3 class="mb-3 font-semibold text-gray-700 border-b pb-2">주문 상태</h3>
            <u-form-field label="주문상태" name="orderStatus" required>
              <p-nuxt-select
                v-model="detailData.orderStatus"
                :options="orderStatusList"
              />
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
        </div>

        <u-button type="submit" class="hidden">저장</u-button>
      </u-form>
    </template>

    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button @click="formSubmit">저장</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { useOrderStore } from '@/modules/order/store/order.store.ts';
import { OrderUpdateValidator } from './_order.validator.ts';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

interface Props {
  open: boolean;
  orderSeq: number;
}
const props = defineProps<Props>();

const orderStore = useOrderStore();
const { detailData } = storeToRefs(orderStore);
const formRef = ref();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'update-ok']);

const orderStatusList = ref([
  { text: '주문접수', value: 'pending' },
  { text: '결제완료', value: 'confirmed' },
  { text: '배송중', value: 'shipped' },
  { text: '배송완료', value: 'delivered' },
  { text: '주문취소', value: 'cancelled' }
]);

const handleFormError = (event: FormErrorEvent) => {
  FormService.onError(event);
};

const formSubmit = () => {
  if (formRef.value) {
    formRef.value.submit();
  }
};

const save = async () => {
  await FormService.loading(async () => {
    const updateData = {
      orderStatus: detailData.value.orderStatus,
      receiverName: detailData.value.receiverName,
      receiverPhone: detailData.value.receiverPhone,
      receiverZipcode: detailData.value.receiverZipcode || '',
      receiverAddress: detailData.value.receiverAddress,
      receiverAddressDetail: detailData.value.receiverAddressDetail || '',
      deliveryMemo: detailData.value.deliveryMemo || ''
    };
    const result = await orderStore.update(props.orderSeq, updateData);
    if (result.isSuccess) {
      FormService.toastMessage('주문 정보가 수정되었습니다.', 'success');
      emit('update-ok');
      close();
    }
  });
};

const close = () => {
  isOpen.value = false;
  emit('close');
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
