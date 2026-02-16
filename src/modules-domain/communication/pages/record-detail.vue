<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[
        { title: '통신' },
        { title: '녹취 청취' },
        { title: '상세' }
      ]"
      title="녹취 상세"
    />
  </div>

  <div v-if="Object.keys(detailData).length > 0" class="space-y-6">
    <!-- 상단: 고객 정보 + 통화 정보 카드 -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <u-card class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">고객 정보</h3>
        <div class="space-y-2">
          <p-form-row label="고객명">{{ detailData.customerName }}</p-form-row>
          <p-form-row label="전화번호">{{ detailData.customerPhone }}</p-form-row>
        </div>
      </u-card>
      <u-card class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">통화 정보</h3>
        <div class="space-y-2">
          <p-form-row label="상담사">{{ detailData.counselorName }}</p-form-row>
          <p-form-row label="통화유형">{{ detailData.callType }}</p-form-row>
          <p-form-row label="통화시간">{{ formatDuration(detailData.duration) }}</p-form-row>
          <p-form-row label="녹취일시">{{ formatDateTime(detailData.recordDate) }}</p-form-row>
        </div>
      </u-card>
    </div>

    <!-- 중간: 음성 플레이어 UI (Mock) -->
    <u-card class="p-6">
      <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">녹취 재생</h3>
      <div class="flex items-center gap-4">
        <u-button
          color="primary"
          variant="soft"
          icon="i-lucide-play"
          size="lg"
          disabled
        >
          재생
        </u-button>
        <div class="flex-1">
          <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-2 rounded-full bg-primary transition-all"
              :style="{ width: '0%' }"
            />
          </div>
          <div class="mt-1 flex justify-between text-xs text-gray-500">
            <span>0:00</span>
            <span>{{ formatDuration(detailData.duration) }}</span>
          </div>
        </div>
      </div>
    </u-card>

    <!-- 하단: 좌측 STT 텍스트, 우측 AI 분석 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 좌측: STT 변환 텍스트 (채팅 UI 스타일) -->
      <u-card class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">대화 내용 (STT)</h3>
        <div class="max-h-[400px] overflow-y-auto space-y-3">
          <template v-for="(line, idx) in sttLines" :key="idx">
            <div
              v-if="line.role"
              :class="[
                'rounded-lg p-3',
                line.role === '상담사'
                  ? 'ml-8 bg-primary/10 text-right'
                  : 'mr-8 bg-gray-100 dark:bg-gray-800 text-left'
              ]"
            >
              <span class="text-xs font-medium text-gray-500">{{ line.role }}</span>
              <div class="mt-1 whitespace-pre-wrap text-sm">{{ line.text }}</div>
            </div>
            <div v-else class="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
              {{ line.text }}
            </div>
          </template>
        </div>
      </u-card>

      <!-- 우측: AI 분석 결과 카드 -->
      <u-card class="p-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">AI 분석 결과</h3>
        <div class="space-y-4">
          <div>
            <div class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">감정 분석</div>
            <u-badge
              :color="sentimentColor(detailData.sentiment)"
              variant="soft"
              size="md"
            >
              {{ detailData.sentiment }}
            </u-badge>
          </div>
          <div>
            <div class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">AI 요약</div>
            <div class="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
              {{ detailData.summary }}
            </div>
          </div>
        </div>
      </u-card>
    </div>

    <!-- 목록으로 버튼 -->
    <div class="flex justify-start">
      <u-button
        color="neutral"
        variant="outline"
        icon="i-lucide-arrow-left"
        label="목록으로"
        @click="goList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useCommunicationStore } from '../store/communication.store';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';

const route = useRoute();
const router = useRouter();
const communicationStore = useCommunicationStore();

const detailData = computed(() => communicationStore.recordDetailData);

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return dateStr.replace('T', ' ').substring(0, 19);
};

const sentimentColor = (sentiment: string) => {
  const map: Record<string, string> = {
    긍정: 'success',
    부정: 'error',
    중립: 'neutral'
  };
  return map[sentiment] || 'neutral';
};

/** STT 텍스트를 대화 형태로 파싱 */
const sttLines = computed(() => {
  const text = detailData.value.sttText || '';
  const lines: { role?: string; text: string }[] = [];
  const parts = text.split('\n').filter((p) => p.trim());

  for (const part of parts) {
    const match = part.match(/^\[(상담사|고객)\]\s*(.*)$/);
    if (match) {
      lines.push({ role: match[1], text: match[2].trim() });
    } else {
      lines.push({ text: part });
    }
  }
  return lines;
});

const getDetail = async () => {
  const recordSeq = Number(route.params.recordSeq);
  if (!recordSeq) return;
  await FormService.loading(async () => {
    communicationStore.recordDetail(recordSeq);
  });
};

const goList = () => {
  router.push({ name: 'communication-record' });
};

onMounted(() => {
  communicationStore.recordDetailInit();
  getDetail();
});
</script>
