<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[700px]',
      footer: 'justify-end'
    }"
    title="새 메시지 발송"
  >
    <template #body>
      <div class="space-y-4 border-t pt-4">
        <p-form-row label="고객명" is-required>
          <p-input-box
            v-model="formData.customerName"
            placeholder="고객명을 입력하세요"
            class="w-full"
            @update:model-value="updatePreview"
          />
        </p-form-row>
        <p-form-row label="메시지유형" is-required>
          <p-nuxt-select
            v-model="formData.messageType"
            :options="messageTypeOptions"
            class="w-full"
            @change="updatePreview"
          />
        </p-form-row>
        <p-form-row label="템플릿">
          <p-nuxt-select
            v-model="formData.templateName"
            :options="templateOptions"
            class="w-full"
            @change="updatePreview"
          />
        </p-form-row>
        <p-form-row label="내용" is-required>
          <u-textarea
            v-model="formData.content"
            placeholder="메시지 내용을 입력하세요"
            :rows="5"
            class="w-full"
            @update:model-value="updatePreview"
          />
        </p-form-row>

        <!-- 미리보기 영역 -->
        <p-form-row label="미리보기">
          <div
            class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-2 text-xs text-gray-500">발송 예정 메시지</div>
            <div class="whitespace-pre-wrap text-sm">{{ previewContent }}</div>
          </div>
        </p-form-row>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      <u-button color="primary" @click="send">발송</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['update:open', 'send-ok']);

const consultationStore = useConsultationStore();

const formData = ref({
  customerSeq: 0,
  customerName: '',
  messageType: '알림톡',
  templateName: '기본 템플릿',
  content: ''
});

const previewContent = ref('');

const messageTypeOptions = [
  { text: '알림톡', value: '알림톡' },
  { text: 'SMS', value: 'SMS' },
  { text: '이메일', value: '이메일' }
];

const templateOptions = [
  { text: '기본 템플릿', value: '기본 템플릿' },
  { text: '상담 예약 확인', value: '상담 예약 확인' },
  { text: '상담 완료 안내', value: '상담 완료 안내' },
  { text: '멤버십 갱신 안내', value: '멤버십 갱신 안내' }
];

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const updatePreview = () => {
  if (formData.value.customerName && formData.value.content) {
    previewContent.value = `[${formData.value.customerName} 고객님]\n\n${formData.value.content}`;
  } else {
    previewContent.value = formData.value.content || '(내용을 입력하세요)';
  }
};

const initForm = () => {
  formData.value = {
    customerSeq: 0,
    customerName: '',
    messageType: '알림톡',
    templateName: '기본 템플릿',
    content: ''
  };
  previewContent.value = '';
};

const send = async () => {
  if (!formData.value.customerName.trim()) {
    FormService.toastMessage('고객명을 입력하세요.', 'error');
    return;
  }
  if (!formData.value.content.trim()) {
    FormService.toastMessage('메시지 내용을 입력하세요.', 'error');
    return;
  }

  await FormService.loading(async () => {
    const result = await consultationStore.messageSend({
      customerSeq: formData.value.customerSeq || 1,
      customerName: formData.value.customerName,
      messageType: formData.value.messageType,
      templateName: formData.value.templateName,
      content: formData.value.content
    });
    if (result.isSuccess) {
      FormService.toastMessage('메시지가 발송되었습니다.', 'success');
      emit('send-ok');
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
