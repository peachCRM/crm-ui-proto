<template>
  <u-modal
    v-model:open="isOpen"
    title="매물 등록"
    :ui="{ content: 'sm:max-w-2xl w-full' }"
  >
    <template #body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="매물명" required>
            <u-input v-model="formData.propertyName" placeholder="매물명 입력" class="w-full" />
          </u-form-field>
          <u-form-field label="매물유형" required>
            <u-select v-model="formData.propertyType" :items="propertyTypeItems" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="거래유형" required>
            <u-select v-model="formData.transactionType" :items="transactionTypeItems" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <u-form-field label="우편번호">
            <u-input v-model="formData.zipcode" placeholder="우편번호" class="w-full" />
          </u-form-field>
          <u-form-field label="주소" class="col-span-2">
            <u-input v-model="formData.address" placeholder="주소 입력" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="면적(m²)">
            <u-input v-model.number="formData.area" type="number" placeholder="0" class="w-full" />
          </u-form-field>
          <u-form-field label="가격(만원)">
            <u-input v-model.number="formData.price" type="number" placeholder="0" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="보증금(만원)">
            <u-input v-model.number="formData.deposit" type="number" placeholder="0" class="w-full" />
          </u-form-field>
          <u-form-field label="월세(만원)">
            <u-input v-model.number="formData.monthlyRent" type="number" placeholder="0" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="층">
            <u-input v-model.number="formData.floor" type="number" placeholder="0" class="w-full" />
          </u-form-field>
          <u-form-field label="총층수">
            <u-input v-model.number="formData.totalFloor" type="number" placeholder="0" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="준공년도">
            <u-input v-model.number="formData.buildYear" type="number" placeholder="0" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="소유자명">
            <u-input v-model="formData.ownerName" placeholder="소유자명" class="w-full" />
          </u-form-field>
          <u-form-field label="소유자연락처">
            <u-input v-model="formData.ownerPhone" placeholder="010-0000-0000" class="w-full" />
          </u-form-field>
        </div>
        <u-form-field label="설명">
          <u-textarea v-model="formData.description" placeholder="매물 설명" :rows="3" class="w-full" />
        </u-form-field>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      <u-button color="primary" @click="register">등록</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRealestateStore } from '../store/realestate.store';
import type { PropertyInsertDto } from '../type/realestate.type';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'insert-ok': [];
}>();

const realestateStore = useRealestateStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<PropertyInsertDto>({
  propertyName: '',
  propertyType: '아파트',
  transactionType: '매매',
  address: '',
  zipcode: '',
  area: 0,
  price: 0,
  deposit: 0,
  monthlyRent: 0,
  floor: 0,
  totalFloor: 0,
  buildYear: 0,
  description: '',
  ownerName: '',
  ownerPhone: ''
});

const propertyTypeItems = [
  { label: '아파트', value: '아파트' },
  { label: '오피스텔', value: '오피스텔' },
  { label: '빌라', value: '빌라' },
  { label: '상가', value: '상가' },
  { label: '토지', value: '토지' }
];

const transactionTypeItems = [
  { label: '매매', value: '매매' },
  { label: '전세', value: '전세' },
  { label: '월세', value: '월세' }
];

const register = async () => {
  if (!formData.value.propertyName.trim()) return;
  await realestateStore.propertyInsert(formData.value);
  emit('insert-ok');
  close();
};

const close = () => {
  isOpen.value = false;
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      formData.value = {
        propertyName: '',
        propertyType: '아파트',
        transactionType: '매매',
        address: '',
        zipcode: '',
        area: 0,
        price: 0,
        deposit: 0,
        monthlyRent: 0,
        floor: 0,
        totalFloor: 0,
        buildYear: 0,
        description: '',
        ownerName: '',
        ownerPhone: ''
      };
    }
  }
);
</script>
