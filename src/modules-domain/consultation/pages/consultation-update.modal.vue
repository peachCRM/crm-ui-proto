<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[600px]',
      footer: 'justify-end'
    }"
    title="상담 수정"
  >
    <template #body>
      <div v-if="formData.consultationSeq > 0" class="space-y-4 border-t pt-4">
        <p-form-row label="고객명" is-required>
          <p-input-box
            v-model="formData.customerName"
            placeholder="고객명을 입력하세요"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="상담유형" is-required>
          <p-nuxt-select
            v-model="formData.consultationType"
            :options="consultationTypeOptions"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="제목" is-required>
          <p-input-box
            v-model="formData.title"
            placeholder="제목을 입력하세요"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="내용">
          <u-textarea
            v-model="formData.content"
            placeholder="상담 내용을 입력하세요"
            :rows="4"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="상태">
          <p-nuxt-select
            v-model="formData.status"
            :options="statusOptions"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="상담사명">
          <p-input-box
            v-model="formData.counselorName"
            placeholder="상담사명을 입력하세요"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="예약일시">
          <p-date-picker
            v-model="formData.reservationDate"
            :enable-time-picker="true"
            date-format="yyyy-MM-dd HH:mm"
            date-model="yyyy-MM-dd HH:mm"
            class="w-full"
            placeholder="예약일시 선택"
          />
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
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import type { ConsultationUpdateDto } from '../type/consultation.type';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';

interface Props {
  consultationSeq: number;
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['update:open', 'update-ok']);

const consultationStore = useConsultationStore();
const formData = ref<ConsultationUpdateDto>({} as ConsultationUpdateDto);

const consultationTypeOptions = [
  { text: '전화', value: '전화' },
  { text: '방문', value: '방문' },
  { text: '온라인', value: '온라인' }
];

const statusOptions = [
  { text: '대기', value: '대기' },
  { text: '진행', value: '진행' },
  { text: '완료', value: '완료' },
  { text: '취소', value: '취소' }
];

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const register = async () => {
  if (!formData.value.customerName || !formData.value.title) {
    FormService.toastMessage('고객명과 제목은 필수입니다.', 'error');
    return;
  }

  await FormService.loading(async () => {
    const result = await consultationStore.update(formData.value);
    if (result.isSuccess) {
      FormService.toastMessage('수정이 완료되었습니다.', 'success');
      emit('update-ok');
      close();
    }
  });
};

const close = () => {
  isOpen.value = false;
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await consultationStore.detail(props.consultationSeq);
    const d = consultationStore.detailData;
    formData.value = {
      consultationSeq: d.consultationSeq,
      customerSeq: d.customerSeq,
      customerName: d.customerName,
      consultationType: d.consultationType,
      title: d.title,
      content: d.content,
      status: d.status,
      counselorName: d.counselorName,
      reservationDate: d.reservationDate
    };
  });
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue && props.consultationSeq > 0) {
      getDetail();
    }
  }
);
</script>
