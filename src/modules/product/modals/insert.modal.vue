<template>
  <!-- 오버레이 -->
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <!-- 모달 -->
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[700px]',
      footer: 'justify-end'
    }"
    :modal="false"
    title="상품 등록"
  >
    <template #body>
      <u-form
        ref="formRef"
        :schema="ProductInsertValidator"
        :state="detailData"
        @submit="register"
        @error="handleFormError"
      >
        <div class="space-y-4">
          <u-form-field label="상품코드" name="productCode" required>
            <u-input v-model="detailData.productCode" placeholder="상품코드를 입력하세요." />
          </u-form-field>

          <u-form-field label="상품명" name="productName" required>
            <u-input v-model="detailData.productName" placeholder="상품명을 입력하세요." />
          </u-form-field>

          <u-form-field label="카테고리" name="category" required>
            <p-nuxt-select
              v-model="detailData.category"
              :options="categoryList"
              placeholder="카테고리를 선택하세요."
            />
          </u-form-field>

          <div class="grid grid-cols-2 gap-4">
            <u-form-field label="판매가" name="price" required>
              <p-input-box v-model="detailData.price" is-comma align="right" placeholder="0" />
            </u-form-field>

            <u-form-field label="원가" name="costPrice">
              <p-input-box v-model="detailData.costPrice" is-comma align="right" placeholder="0" />
            </u-form-field>
          </div>

          <u-form-field label="재고수량" name="stockQty" required>
            <p-input-box v-model="detailData.stockQty" is-comma align="right" placeholder="0" />
          </u-form-field>

          <u-form-field label="상품 이미지 URL" name="imageUrl">
            <u-input v-model="detailData.imageUrl" placeholder="이미지 URL을 입력하세요." />
          </u-form-field>

          <div v-if="detailData.imageUrl" class="flex justify-center">
            <img :src="detailData.imageUrl" alt="상품 이미지" class="h-32 w-32 rounded object-cover" />
          </div>

          <u-form-field label="상품설명" name="description">
            <u-textarea v-model="detailData.description" placeholder="상품 설명을 입력하세요." :rows="4" />
          </u-form-field>
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
import { computed, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { useProductStore } from '@/modules/product/store/product.store.ts';
import { ProductInsertValidator } from './_product.validator.ts';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';

// Props 정의
interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const productStore = useProductStore();
const { detailData } = storeToRefs(productStore);
const formRef = ref();

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'insert-ok']);

const categoryList = ref([
  { text: '의류', value: 'clothing' },
  { text: '전자기기', value: 'electronics' },
  { text: '식품', value: 'food' },
  { text: '가구', value: 'furniture' },
  { text: '뷰티', value: 'beauty' }
]);

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
      productName: detailData.value.productName,
      productCode: detailData.value.productCode,
      category: detailData.value.category,
      price: Number(detailData.value.price) || 0,
      costPrice: Number(detailData.value.costPrice) || 0,
      stockQty: Number(detailData.value.stockQty) || 0,
      description: detailData.value.description || '',
      imageUrl: detailData.value.imageUrl || '',
      fileUuidList: [],
      imageUuidList: []
    };
    const result = await productStore.insert(insertData);
    if (result.isSuccess) {
      FormService.toastMessage('상품이 등록되었습니다.', 'success');
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
  productStore.detailDataInit();
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
  productStore.detailDataInit();
});
</script>
