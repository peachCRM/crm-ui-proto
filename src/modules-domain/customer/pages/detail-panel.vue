<template>
  <u-card class="w-full">
    <!-- 미선택 상태 -->
    <div
      v-if="!route.query.selected"
      class="flex min-h-[900px] flex-grow items-center justify-center"
    >
      <div class="text-center">
        <UIcon name="i-lucide-user-search" class="text-5xl text-gray-300 mb-4" />
        <p class="font-bold text-gray-400">고객을 선택해주세요</p>
        <p class="text-sm text-gray-300 mt-1">좌측 목록에서 고객을 클릭하면 상세 정보가 표시됩니다</p>
      </div>
    </div>

    <!-- 상세 정보 -->
    <div v-else class="flex h-full flex-grow flex-col">
      <!-- 헤더 -->
      <div class="flex items-center justify-between py-0.5 pb-4">
        <div class="flex items-center gap-3">
          <div class="text-lg font-semibold">고객 상세정보</div>
          <UBadge :color="gradeBadgeColor" variant="soft" size="sm">
            {{ gradeLabel }}
          </UBadge>
          <UBadge :color="statusBadgeColor" variant="soft" size="sm">
            {{ statusLabel }}
          </UBadge>
        </div>
      </div>

      <!-- 기본 정보 -->
      <div class="border-t">
        <p-form-row label="고객명">
          <span class="font-medium">{{ detailData.customerName }}</span>
        </p-form-row>
        <div class="flex">
          <p-form-row label="전화번호">
            {{ detailData.phone }}
          </p-form-row>
          <p-form-row label="이메일">
            {{ detailData.email }}
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="성별">
            {{ detailData.gender === 'M' ? '남성' : '여성' }}
          </p-form-row>
          <p-form-row label="생년월일">
            {{ detailData.birthDate }}
          </p-form-row>
        </div>
        <p-form-row label="주소">
          <span v-if="detailData.zipcode">({{ detailData.zipcode }})</span>
          {{ detailData.address }}
        </p-form-row>
        <p-form-row label="메모">
          <div class="whitespace-pre-wrap">{{ detailData.memo }}</div>
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

      <!-- 액션 버튼 -->
      <div class="mt-4 flex justify-end gap-2">
        <u-button color="primary" variant="outline" icon="i-lucide-edit" @click="goUpdate">
          수정
        </u-button>
        <u-button color="error" variant="outline" icon="i-lucide-trash-2" @click="remove">
          삭제
        </u-button>
      </div>
    </div>
  </u-card>

  <!-- 수정 모달 -->
  <customer-update-modal
    :customer-seq="Number(route.query.selected)"
    v-model:open="isOpenUpdate"
    @update-ok="handleUpdateOk"
  />
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useCustomerStore } from '../store/customer.store';
import CustomerUpdateModal from './customer-update.modal.vue';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

const route = useRoute();
const router = useRouter();
const customerStore = useCustomerStore();
const { detailData } = storeToRefs(customerStore);

const isOpenUpdate = ref(false);

// 등급 라벨
const gradeLabel = computed(() => {
  const labels: Record<string, string> = { A: 'VIP', B: '우수', C: '일반', D: '관심' };
  return labels[detailData.value.customerGrade] || '';
});

const gradeBadgeColor = computed(() => {
  const colors: Record<string, string> = { A: 'error', B: 'primary', C: 'neutral', D: 'info' };
  return colors[detailData.value.customerGrade] || 'neutral';
});

// 상태 라벨
const statusLabel = computed(() => {
  const labels: Record<string, string> = { A: '활성', I: '비활성', D: '탈퇴' };
  return labels[detailData.value.customerStatus] || '';
});

const statusBadgeColor = computed(() => {
  const colors: Record<string, string> = { A: 'success', I: 'warning', D: 'error' };
  return colors[detailData.value.customerStatus] || 'neutral';
});

const getDetail = async () => {
  await FormService.loading(async () => {
    await customerStore.detail(Number(route.query.selected));
  });
};

const goUpdate = () => {
  isOpenUpdate.value = true;
};

const remove = async () => {
  if (!confirm('삭제 하시겠습니까?')) return;
  await FormService.loading(async () => {
    const result = await customerStore.softDelete(Number(route.query.selected));
    if (result) {
      router.push({ query: { ...route.query, selected: '' } });
    }
  });
};

const handleUpdateOk = () => {
  isOpenUpdate.value = false;
  getDetail();
};

onUnmounted(() => {
  customerStore.detailDataInit();
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
