<template>
  <u-modal
    v-model:open="isOpen"
    title="고객 등록"
    :ui="{ content: 'sm:max-w-xl w-full' }"
  >
    <template #body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="고객명" required>
            <u-input v-model="formData.customerName" placeholder="고객명 입력" class="w-full" />
          </u-form-field>
          <u-form-field label="전화번호" required>
            <u-input v-model="formData.phone" placeholder="010-0000-0000" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="이메일">
            <u-input v-model="formData.email" placeholder="email@example.com" class="w-full" />
          </u-form-field>
          <u-form-field label="성별">
            <u-select v-model="formData.gender" :items="genderOptions" class="w-full" />
          </u-form-field>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <u-form-field label="생년월일">
            <u-input v-model="formData.birthDate" type="date" class="w-full" />
          </u-form-field>
          <u-form-field label="고객 등급">
            <u-select v-model="formData.customerGrade" :items="gradeOptions" class="w-full" />
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
        <u-form-field label="메모">
          <u-textarea v-model="formData.memo" placeholder="메모 입력 (선택)" :rows="3" class="w-full" />
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
import { useCustomerStore } from '../store/customer.store';
import type { CustomerInsertDto } from '../type/customer.type';

interface Props { open: boolean; }
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'insert-ok': [];
}>();

const customerStore = useCustomerStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<CustomerInsertDto>({
  customerName: '', phone: '', email: '', gender: 'M',
  birthDate: '', address: '', zipcode: '', memo: '', customerGrade: 'C'
});

const genderOptions = [
  { label: '남성', value: 'M' },
  { label: '여성', value: 'F' }
];

const gradeOptions = [
  { label: 'VIP', value: 'A' },
  { label: '우수', value: 'B' },
  { label: '일반', value: 'C' },
  { label: '관심', value: 'D' }
];

const register = async () => {
  if (!formData.value.customerName.trim() || !formData.value.phone.trim()) return;
  await customerStore.insert(formData.value);
  emit('insert-ok');
  close();
};

const close = () => { isOpen.value = false; };

watch(() => props.open, (newValue) => {
  if (newValue) {
    formData.value = {
      customerName: '', phone: '', email: '', gender: 'M',
      birthDate: '', address: '', zipcode: '', memo: '', customerGrade: 'C'
    };
  }
});
</script>
