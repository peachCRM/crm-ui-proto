<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[600px]',
      footer: 'justify-end'
    }"
    title="상담 등록"
  >
    <template #body>
      <div class="space-y-4 border-t pt-4">
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
      <u-button color="primary" @click="register">등록</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import type { ConsultationInsertDto } from '../type/consultation.type';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['update:open', 'insert-ok']);

const consultationStore = useConsultationStore();

const formData = ref<ConsultationInsertDto>({
  customerSeq: 0,
  customerName: '',
  consultationType: '전화',
  title: '',
  content: '',
  counselorName: '',
  reservationDate: dayjs().format('YYYY-MM-DD HH:mm')
});

const consultationTypeOptions = [
  { text: '전화', value: '전화' },
  { text: '방문', value: '방문' },
  { text: '온라인', value: '온라인' }
];

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const initForm = () => {
  formData.value = {
    customerSeq: 0,
    customerName: '',
    consultationType: '전화',
    title: '',
    content: '',
    counselorName: '',
    reservationDate: dayjs().format('YYYY-MM-DD HH:mm')
  };
};

const register = async () => {
  if (!formData.value.customerName.trim()) {
    FormService.toastMessage('고객명을 입력하세요.', 'error');
    return;
  }
  if (!formData.value.title.trim()) {
    FormService.toastMessage('제목을 입력하세요.', 'error');
    return;
  }

  await FormService.loading(async () => {
    const result = await consultationStore.insert(formData.value);
    if (result.isSuccess) {
      FormService.toastMessage('등록이 완료되었습니다.', 'success');
      emit('insert-ok');
      close();
    }
  });
};

const close = () => {
  isOpen.value = false;
  initForm();
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      initForm();
    }
  }
);
</script>
