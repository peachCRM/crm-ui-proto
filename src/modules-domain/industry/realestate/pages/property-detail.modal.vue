<template>
  <u-modal
    v-model:open="isOpen"
    title="매물 상세"
    :ui="{ content: 'sm:max-w-2xl w-full' }"
  >
    <template #body>
      <div v-if="detailData.propertySeq" class="border-t">
        <p-form-row label="매물명">
          <span class="font-medium">{{ detailData.propertyName }}</span>
        </p-form-row>
        <div class="flex">
          <p-form-row label="매물유형">
            {{ detailData.propertyType }}
          </p-form-row>
          <p-form-row label="거래유형">
            {{ detailData.transactionType }}
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="상태">
            <u-badge :color="statusBadgeColor" variant="soft" size="sm">
              {{ detailData.status }}
            </u-badge>
          </p-form-row>
          <p-form-row label="면적">
            {{ detailData.area }} m²
          </p-form-row>
        </div>
        <p-form-row label="주소">
          <span v-if="detailData.zipcode">({{ detailData.zipcode }})</span>
          {{ detailData.address }}
        </p-form-row>
        <div class="flex">
          <p-form-row label="가격">
            {{ formatPriceText }}
          </p-form-row>
          <p-form-row label="층">
            {{ detailData.floor }}층 / {{ detailData.totalFloor }}층
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="준공년도">
            {{ detailData.buildYear || '-' }}
          </p-form-row>
          <p-form-row label="소유자">
            {{ detailData.ownerName }}
          </p-form-row>
        </div>
        <p-form-row label="소유자연락처">
          {{ detailData.ownerPhone }}
        </p-form-row>
        <p-form-row label="설명">
          <div class="whitespace-pre-wrap">{{ detailData.description || '-' }}</div>
        </p-form-row>
        <div class="flex">
          <p-form-row label="등록일">
            {{ detailData.insertDate }}
          </p-form-row>
          <p-form-row label="수정일">
            {{ detailData.updateDate }}
          </p-form-row>
        </div>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button color="primary" variant="outline" icon="i-lucide-edit" @click="goUpdate">
        수정
      </u-button>
      <u-button color="error" variant="outline" icon="i-lucide-trash-2" @click="remove">
        삭제
      </u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useRealestateStore } from '../store/realestate.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

interface Props {
  open: boolean;
  propertySeq: number;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'remove-ok': [];
  'go-update': [propertySeq: number];
}>();

const realestateStore = useRealestateStore();
const { propertyDetailData: detailData } = storeToRefs(realestateStore);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const statusBadgeColor = computed(() => {
  const map: Record<string, string> = {
    등록: 'primary',
    계약중: 'warning',
    계약완료: 'success',
    보류: 'neutral'
  };
  return map[detailData.value.status] || 'neutral';
});

const formatPriceText = computed(() => {
  const d = detailData.value;
  if (d.transactionType === '매매') {
    if (d.price >= 10000) return `${Math.floor(d.price / 10000)}억 ${d.price % 10000 ? ` ${d.price % 10000}만` : ''}원`;
    return `${d.price}만원`;
  }
  if (d.transactionType === '전세') {
    if (d.deposit >= 10000) return `${Math.floor(d.deposit / 10000)}억 ${d.deposit % 10000 ? ` ${d.deposit % 10000}만` : ''}원`;
    return `${d.deposit}만원`;
  }
  if (d.transactionType === '월세') {
    return `${d.deposit}만 / ${d.monthlyRent}만원`;
  }
  return '-';
});

const getDetail = async () => {
  await FormService.loading(async () => {
    await realestateStore.propertyDetail(props.propertySeq);
  });
};

const goUpdate = () => {
  emit('go-update', props.propertySeq);
};

const remove = async () => {
  if (!confirm('삭제하시겠습니까?')) return;
  await FormService.loading(async () => {
    await realestateStore.propertySoftDelete(props.propertySeq);
    emit('remove-ok');
    close();
  });
};

const close = () => {
  isOpen.value = false;
};

onUnmounted(() => {
  realestateStore.propertyDetailDataInit();
});

watch(
  () => props.open,
  (newValue) => {
    if (newValue && props.propertySeq) {
      getDetail();
    }
  }
);
</script>
