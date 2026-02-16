<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[600px]',
      footer: 'justify-end'
    }"
    title="상담 상세"
  >
    <template #body>
      <div v-if="Object.keys(detailData).length > 0" class="border-t pt-4">
        <p-form-row label="고객명">
          {{ detailData.customerName }}
        </p-form-row>
        <p-form-row label="상담유형">
          {{ detailData.consultationType }}
        </p-form-row>
        <p-form-row label="제목">
          {{ detailData.title }}
        </p-form-row>
        <p-form-row label="내용">
          <div class="whitespace-pre-wrap">{{ detailData.content }}</div>
        </p-form-row>
        <div class="flex">
          <p-form-row label="상태">
            <u-badge :color="statusColor(detailData.status)" variant="soft" size="sm">
              {{ detailData.status }}
            </u-badge>
          </p-form-row>
          <p-form-row label="상담사">
            {{ detailData.counselorName }}
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="예약일시">
            {{ detailData.reservationDate }}
          </p-form-row>
          <p-form-row label="등록일">
            {{ detailData.insertDate }}
          </p-form-row>
        </div>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button color="error" variant="soft" icon="i-lucide-trash-2" @click="remove" label="삭제" />
      <u-button color="primary" icon="i-lucide-edit" @click="goUpdate" label="수정" />
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useConsultationStore } from '../store/consultation.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

interface Props {
  consultationSeq: number;
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['update:open', 'remove-ok', 'go-update']);

const consultationStore = useConsultationStore();
const detailData = computed(() => consultationStore.detailData);

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    대기: 'warning',
    진행: 'info',
    완료: 'success',
    취소: 'error'
  };
  return map[status] || 'neutral';
};

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const getDetail = async () => {
  await FormService.loading(async () => {
    await consultationStore.detail(props.consultationSeq);
  });
};

const close = () => {
  isOpen.value = false;
  emit('update:open', false);
};

const remove = async () => {
  if (!confirm('삭제하시겠습니까?')) return;
  await FormService.loading(async () => {
    const result = await consultationStore.softDelete(props.consultationSeq);
    if (result.isSuccess) {
      FormService.toastMessage('삭제가 완료되었습니다.', 'success');
      emit('remove-ok');
      close();
    }
  });
};

const goUpdate = () => {
  emit('go-update', props.consultationSeq);
  close();
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue && props.consultationSeq > 0) {
      getDetail();
    }
  }
);

onUnmounted(() => {
  consultationStore.detailDataInit();
});
</script>
