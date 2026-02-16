<template>
  <u-modal
    v-model:open="isOpen"
    title="멤버십 등록"
    :ui="{ content: 'sm:max-w-xl w-full' }"
  >
    <template #body>
      <div class="space-y-4">
        <p-form-row label="고객명" is-required>
          <p-input-box v-model="formData.customerName" placeholder="고객명 입력" class="w-full" />
        </p-form-row>
        <p-form-row label="멤버십유형" is-required>
          <p-nuxt-select
            v-model="formData.membershipType"
            placeholder="선택"
            :options="membershipTypeOptions"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="총횟수" is-required>
          <p-input-box v-model="formData.totalSessions" class="w-full" is-number-only />
        </p-form-row>
        <div class="grid grid-cols-2 gap-4">
          <p-form-row label="시작일" is-required>
            <u-input v-model="formData.startDate" type="date" class="w-full" />
          </p-form-row>
          <p-form-row label="종료일" is-required>
            <u-input v-model="formData.endDate" type="date" class="w-full" />
          </p-form-row>
        </div>
        <p-form-row label="가격">
          <p-input-box v-model="formData.price" class="w-full" is-comma />
        </p-form-row>
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
import dayjs from 'dayjs';
import { usePilatesStore } from '../store/pilates.store';
import type { MembershipInsertDto } from '../type/pilates.type';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'insert-ok': [];
}>();

const pilatesStore = usePilatesStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<MembershipInsertDto>({
  customerName: '',
  membershipType: '기본',
  totalSessions: 10,
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().add(3, 'month').format('YYYY-MM-DD'),
  price: 150000
});

const membershipTypeOptions = [
  { text: '기본', value: '기본' },
  { text: '프리미엄', value: '프리미엄' },
  { text: 'VIP', value: 'VIP' }
];

const register = () => {
  if (!formData.value.customerName.trim()) return;
  pilatesStore.membershipInsert({
    ...formData.value,
    totalSessions: Number(formData.value.totalSessions) || 10,
    price: typeof formData.value.price === 'number' ? formData.value.price : Number(String(formData.value.price).replace(/,/g, '')) || 0
  });
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
        customerName: '',
        membershipType: '기본',
        totalSessions: 10,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(3, 'month').format('YYYY-MM-DD'),
        price: 150000
      };
    }
  }
);
</script>
