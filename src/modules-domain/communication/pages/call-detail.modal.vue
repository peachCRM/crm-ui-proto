<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[600px]',
      footer: 'justify-end'
    }"
    title="통화 상세"
  >
    <template #body>
      <div v-if="Object.keys(detailData).length > 0" class="border-t pt-4">
        <p-form-row label="고객명">
          {{ detailData.customerName }}
        </p-form-row>
        <p-form-row label="전화번호">
          {{ detailData.customerPhone }}
        </p-form-row>
        <div class="flex">
          <p-form-row label="통화유형">
            <u-badge :color="callTypeColor(detailData.callType)" variant="soft" size="sm">
              {{ detailData.callType }}
            </u-badge>
          </p-form-row>
          <p-form-row label="통화결과">
            <u-badge :color="callResultColor(detailData.callResult)" variant="soft" size="sm">
              {{ detailData.callResult }}
            </u-badge>
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="통화시작">
            {{ formatDateTime(detailData.startTime) }}
          </p-form-row>
          <p-form-row label="통화종료">
            {{ formatDateTime(detailData.endTime) }}
          </p-form-row>
        </div>
        <p-form-row label="통화시간">
          {{ formatDuration(detailData.duration) }}
        </p-form-row>
        <p-form-row label="상담사">
          {{ detailData.counselorName }}
        </p-form-row>
        <p-form-row label="메모" v-if="detailData.memo">
          <div class="whitespace-pre-wrap">{{ detailData.memo }}</div>
        </p-form-row>
        <p-form-row
          label="녹취"
          v-if="detailData.hasRecording === 'Y' && findRecordSeq(detailData.callSeq) > 0"
        >
          <router-link
            :to="{
              name: 'communication-record-detail',
              params: { recordSeq: String(findRecordSeq(detailData.callSeq)) }
            }"
            class="text-primary hover:underline"
          >
            녹취 청취
          </router-link>
        </p-form-row>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button color="error" variant="soft" icon="i-lucide-trash-2" @click="remove" label="삭제" />
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useCommunicationStore } from '../store/communication.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

interface Props {
  callSeq: number;
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits(['update:open', 'remove-ok']);

const communicationStore = useCommunicationStore();
const detailData = computed(() => communicationStore.callDetailData);

const callTypeColor = (type: string) => {
  const map: Record<string, string> = {
    인바운드: 'primary',
    아웃바운드: 'warning'
  };
  return map[type] || 'neutral';
};

const callResultColor = (result: string) => {
  const map: Record<string, string> = {
    연결: 'success',
    부재: 'warning',
    통화중: 'info',
    거절: 'error'
  };
  return map[result] || 'neutral';
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return dateStr.replace('T', ' ').substring(0, 19);
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
};

/** callSeq에 해당하는 recordSeq 찾기 */
const findRecordSeq = (callSeq: number): number => {
  return communicationStore.getRecordSeqByCallSeq(callSeq);
};

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const getDetail = async () => {
  await FormService.loading(async () => {
    communicationStore.callDetail(props.callSeq);
  });
};

const close = () => {
  isOpen.value = false;
};

const remove = async () => {
  if (!confirm('삭제하시겠습니까?')) return;
  await FormService.loading(async () => {
    const result = communicationStore.callSoftDelete(props.callSeq);
    if (result.isSuccess) {
      FormService.toastMessage('삭제가 완료되었습니다.', 'success');
      emit('remove-ok');
      close();
    }
  });
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue && props.callSeq > 0) {
      getDetail();
    }
  }
);

onUnmounted(() => {
  communicationStore.callDetailInit();
});
</script>
