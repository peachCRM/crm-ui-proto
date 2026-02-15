<template>
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{ content: 'min-w-sm max-w-[700px]', footer: 'justify-end' }"
    :modal="false"
    title="상품 상세"
  >
    <template #body>
      <div class="space-y-4">
        <div v-if="detailData.imageUrl" class="flex justify-center">
          <img :src="detailData.imageUrl" alt="상품 이미지" class="h-48 w-48 rounded object-cover" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="상품코드">
            <div class="rounded bg-gray-50 p-2">{{ detailData.productCode }}</div>
          </u-form-field>

          <u-form-field label="카테고리">
            <div class="rounded bg-gray-50 p-2">{{ getCategoryName(detailData.category) }}</div>
          </u-form-field>
        </div>

        <u-form-field label="상품명">
          <div class="rounded bg-gray-50 p-2">{{ detailData.productName }}</div>
        </u-form-field>

        <div class="grid grid-cols-3 gap-4">
          <u-form-field label="판매가">
            <div class="rounded bg-gray-50 p-2 text-right">{{ detailData.price?.toLocaleString() }}원</div>
          </u-form-field>

          <u-form-field label="원가">
            <div class="rounded bg-gray-50 p-2 text-right">{{ detailData.costPrice?.toLocaleString() }}원</div>
          </u-form-field>

          <u-form-field label="재고수량">
            <div class="rounded bg-gray-50 p-2 text-right">{{ detailData.stockQty?.toLocaleString() }}개</div>
          </u-form-field>
        </div>

        <u-form-field label="상품설명">
          <div class="min-h-[100px] rounded bg-gray-50 p-2 whitespace-pre-wrap">{{ detailData.description || '-' }}</div>
        </u-form-field>

        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="등록일">
            <div class="rounded bg-gray-50 p-2">{{ detailData.insertDate }}</div>
          </u-form-field>

          <u-form-field label="상태">
            <div class="rounded bg-gray-50 p-2">
              <u-badge :color="detailData.isUse === 'Y' ? 'success' : 'error'" variant="soft">
                {{ detailData.isUse === 'Y' ? '판매중' : '판매중지' }}
              </u-badge>
            </div>
          </u-form-field>
        </div>
      </div>
    </template>

    <template #footer>
      <u-button color="error" variant="outline" @click="remove">삭제</u-button>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button @click="goUpdate">수정</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useProductStore } from '@/modules/product/store/product.store.ts';

interface Props {
  open: boolean;
  productSeq: number;
}
const props = defineProps<Props>();

const productStore = useProductStore();
const { detailData } = storeToRefs(productStore);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'remove-ok', 'go-update']);

const categoryMap: Record<string, string> = {
  clothing: '의류',
  electronics: '전자기기',
  food: '식품',
  furniture: '가구',
  beauty: '뷰티'
};

const getCategoryName = (category: string) => {
  return categoryMap[category] || category;
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const goUpdate = () => {
  emit('go-update', props.productSeq);
};

const remove = async () => {
  if (!confirm('이 상품을 삭제하시겠습니까?')) return;

  await FormService.loading(async () => {
    const result = await productStore.softDelete(props.productSeq);
    if (result.isSuccess) {
      FormService.toastMessage('상품이 삭제되었습니다.', 'success');
      emit('remove-ok');
      close();
    }
  });
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await productStore.detail(props.productSeq);
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
