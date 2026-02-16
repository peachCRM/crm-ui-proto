<template>
  <u-modal
    v-model:open="isOpen"
    title="멤버십 수정"
    :ui="{ content: 'sm:max-w-xl w-full' }"
  >
    <template #body>
      <div v-if="formData.membershipSeq" class="space-y-4">
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
        <div class="grid grid-cols-2 gap-4">
          <p-form-row label="총횟수" is-required>
            <p-input-box v-model="formData.totalSessions" class="w-full" is-number-only />
          </p-form-row>
          <p-form-row label="잔여횟수" is-required>
            <p-input-box v-model="formData.remainingSessions" class="w-full" is-number-only />
          </p-form-row>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <p-form-row label="시작일" is-required>
            <u-input v-model="formData.startDate" type="date" class="w-full" />
          </p-form-row>
          <p-form-row label="종료일" is-required>
            <u-input v-model="formData.endDate" type="date" class="w-full" />
          </p-form-row>
        </div>
        <p-form-row label="상태">
          <p-nuxt-select
            v-model="formData.status"
            placeholder="선택"
            :options="statusOptions"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="가격">
          <p-input-box v-model="formData.price" class="w-full" is-comma />
        </p-form-row>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      <u-button color="primary" @click="register">수정</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePilatesStore } from '../store/pilates.store';
import type { MembershipUpdateDto } from '../type/pilates.type';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

interface Props {
  open: boolean;
  membershipSeq: number;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update-ok': [];
}>();

const pilatesStore = usePilatesStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<MembershipUpdateDto>({
  membershipSeq: 0,
  customerName: '',
  membershipType: '기본',
  totalSessions: 10,
  remainingSessions: 10,
  startDate: '',
  endDate: '',
  status: '활성',
  price: 0
});

const membershipTypeOptions = [
  { text: '기본', value: '기본' },
  { text: '프리미엄', value: '프리미엄' },
  { text: 'VIP', value: 'VIP' }
];

const statusOptions = [
  { text: '활성', value: '활성' },
  { text: '만료', value: '만료' },
  { text: '일시정지', value: '일시정지' }
];

const register = () => {
  if (!formData.value.customerName.trim()) return;
  pilatesStore.membershipUpdate({
    ...formData.value,
    totalSessions: Number(formData.value.totalSessions) || 10,
    remainingSessions: Number(formData.value.remainingSessions) || 0,
    price: typeof formData.value.price === 'number' ? formData.value.price : Number(String(formData.value.price).replace(/,/g, '')) || 0
  });
  emit('update-ok');
  close();
};

const close = () => {
  isOpen.value = false;
};

watch(
  () => [props.open, props.membershipSeq],
  ([open, seq]) => {
    if (open && seq) {
      const detail = pilatesStore.membershipDetail(seq);
      if (detail.membershipSeq) {
        formData.value = {
          membershipSeq: detail.membershipSeq,
          customerName: detail.customerName,
          membershipType: detail.membershipType,
          totalSessions: detail.totalSessions,
          remainingSessions: detail.remainingSessions,
          startDate: detail.startDate,
          endDate: detail.endDate,
          status: detail.status,
          price: detail.price
        };
      }
    }
  },
  { immediate: true }
);
</script>
