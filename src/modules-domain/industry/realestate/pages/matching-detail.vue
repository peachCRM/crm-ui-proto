<template>
  <u-card class="w-full">
    <!-- 미선택 상태 -->
    <div
      v-if="!route.query.selected"
      class="flex min-h-[400px] flex-grow items-center justify-center"
    >
      <div class="text-center">
        <UIcon name="i-lucide-handshake" class="text-5xl text-gray-300 mb-4" />
        <p class="font-bold text-gray-400">매칭 정보를 선택해주세요</p>
        <p class="text-sm text-gray-300 mt-1">좌측 목록에서 매칭을 클릭하면 상세 정보가 표시됩니다</p>
      </div>
    </div>

    <!-- 상세 정보 -->
    <div v-else class="flex h-full flex-grow flex-col">
      <!-- 헤더 -->
      <div class="flex items-center justify-between py-2 pb-4">
        <div class="text-lg font-semibold">매칭 상세정보</div>
        <u-badge :color="statusBadgeColor" variant="soft" size="sm">
          {{ detailData.status }}
        </u-badge>
      </div>

      <!-- 매칭 점수 -->
      <div class="mb-6 rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
        <div class="text-4xl font-bold text-[#287dff]">{{ detailData.matchScore }}</div>
        <div class="text-sm text-gray-500 mt-1">매칭 점수</div>
      </div>

      <!-- 매칭 사유 -->
      <p-form-row label="매칭 사유">
        <div class="whitespace-pre-wrap">{{ detailData.matchReason || '-' }}</div>
      </p-form-row>

      <!-- 고객 정보 -->
      <div class="border-t mt-2">
        <div class="py-2 font-medium text-gray-700 dark:text-gray-300">고객 정보</div>
        <p-form-row label="고객명">
          {{ detailData.customerName }}
        </p-form-row>
        <p-form-row label="연락처">
          {{ detailData.customerPhone }}
        </p-form-row>
      </div>

      <!-- 매물 정보 -->
      <div class="border-t">
        <div class="py-2 font-medium text-gray-700 dark:text-gray-300">매물 정보</div>
        <p-form-row label="매물명">
          {{ detailData.propertyName }}
        </p-form-row>
        <p-form-row label="주소">
          {{ propertyAddress }}
        </p-form-row>
        <p-form-row label="가격">
          {{ propertyPrice }}
        </p-form-row>
      </div>

      <!-- 상담일, 메모 -->
      <div class="border-t">
        <p-form-row label="상담일">
          {{ detailData.contactDate || '-' }}
        </p-form-row>
        <p-form-row label="메모">
          <div class="whitespace-pre-wrap">{{ detailData.memo || '-' }}</div>
        </p-form-row>
      </div>

      <!-- 상태 변경 -->
      <div class="mt-4 flex flex-wrap gap-2">
        <u-button
          v-for="s in statusOptions"
          :key="s.value"
          :color="detailData.status === s.value ? 'primary' : 'neutral'"
          :variant="detailData.status === s.value ? 'solid' : 'outline'"
          size="sm"
          @click="updateStatus(s.value)"
        >
          {{ s.text }}
        </u-button>
      </div>
    </div>
  </u-card>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useRealestateStore } from '../store/realestate.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

const route = useRoute();
const realestateStore = useRealestateStore();
const { matchingDetailData: detailData } = storeToRefs(realestateStore);

const statusOptions = [
  { text: '추천', value: '추천' },
  { text: '상담예정', value: '상담예정' },
  { text: '상담완료', value: '상담완료' },
  { text: '계약', value: '계약' }
];

const statusBadgeColor = computed(() => {
  const map: Record<string, string> = {
    추천: 'primary',
    상담예정: 'warning',
    상담완료: 'info',
    계약: 'success'
  };
  return map[detailData.value.status] || 'neutral';
});

const propertyAddress = computed(() => {
  const p = realestateStore.propertyListFull.find(
    (x) => x.propertySeq === detailData.value.propertySeq
  );
  return p ? p.address : '-';
});

const propertyPrice = computed(() => {
  const p = realestateStore.propertyListFull.find(
    (x) => x.propertySeq === detailData.value.propertySeq
  );
  if (!p) return '-';
  if (p.transactionType === '매매') {
    if (p.price >= 10000) return `${Math.floor(p.price / 10000)}억 ${p.price % 10000 ? ` ${p.price % 10000}만` : ''}원`;
    return `${p.price}만원`;
  }
  if (p.transactionType === '전세') {
    if (p.deposit >= 10000) return `${Math.floor(p.deposit / 10000)}억 ${p.deposit % 10000 ? ` ${p.deposit % 10000}만` : ''}원`;
    return `${p.deposit}만원`;
  }
  if (p.transactionType === '월세') return `${p.deposit}만 / ${p.monthlyRent}만원`;
  return '-';
});

const getDetail = async () => {
  await FormService.loading(async () => {
    await realestateStore.matchingDetail(Number(route.query.selected));
  });
};

const updateStatus = async (status: string) => {
  await FormService.loading(async () => {
    await realestateStore.matchingUpdate({
      matchingSeq: detailData.value.matchingSeq,
      status
    });
  });
};

onUnmounted(() => {
  realestateStore.matchingDetailDataInit();
});

watch(
  route,
  () => {
    if (route.query && route.query.selected && route.query.selected !== '') {
      getDetail();
    }
  },
  { immediate: true, deep: true }
);
</script>
