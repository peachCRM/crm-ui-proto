<template>
  <!-- 오버레이 -->
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/80" @click.stop></div>

  <!-- 모달 -->
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[900px]',
      footer: 'justify-end'
    }"
    :modal="false"
    title="배너 상세"
  >
    <template #body>
      <div class="space-y-6">
        <!-- 기본 정보 -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <u-form-field label="NGO 단체명">
              <div class="rounded bg-gray-50 p-2 dark:bg-gray-800">{{ detailData.ngoName }}</div>
            </u-form-field>

            <u-form-field label="플랫폼">
              <div class="rounded bg-gray-50 p-2 dark:bg-gray-800">
                <u-badge
                  :color="detailData.platform === 'naver' ? 'success' : 'warning'"
                  variant="subtle"
                >
                  {{ detailData.platform === 'naver' ? '네이버' : '카카오톡' }}
                </u-badge>
              </div>
            </u-form-field>
          </div>

          <u-form-field label="배너 제목">
            <div class="rounded bg-gray-50 p-2 dark:bg-gray-800">{{ detailData.bannerTitle }}</div>
          </u-form-field>

          <u-form-field label="크롤링 일시">
            <div class="rounded bg-gray-50 p-2 dark:bg-gray-800">{{ formatDate(detailData.crawledDate) }}</div>
          </u-form-field>
        </div>

        <!-- 배너 이미지 -->
        <div>
          <u-form-field label="배너 이미지">
            <div class="rounded border bg-gray-50 p-4 dark:bg-gray-800">
              <img
                v-if="detailData.bannerImageUrl"
                :src="detailData.bannerImageUrl"
                alt="배너 이미지"
                class="mx-auto max-h-[300px] rounded object-contain"
              />
              <div v-else class="py-8 text-center text-gray-400">이미지가 없습니다.</div>
            </div>
          </u-form-field>
        </div>

        <!-- 배너 링크 -->
        <div>
          <u-form-field label="배너 링크 URL">
            <div class="rounded bg-gray-50 p-2 dark:bg-gray-800">
              <a
                v-if="detailData.bannerLinkUrl"
                :href="detailData.bannerLinkUrl"
                target="_blank"
                rel="noopener noreferrer"
                :class="[
                  'inline-flex items-center gap-1',
                  'text-primary hover:underline'
                ]"
              >
                {{ detailData.bannerLinkUrl }}
                <i class="i-lucide-external-link h-4 w-4" />
              </a>
              <span v-else class="text-gray-400">링크가 없습니다.</span>
            </div>
          </u-form-field>
        </div>
      </div>
    </template>

    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useNgoBannerStore } from '@/modules-guide/ngo-banner/store/ngo-banner.store.ts';

interface Props {
  open: boolean;
  bannerSeq: number;
}
const props = defineProps<Props>();

const ngoBannerStore = useNgoBannerStore();
const { detailData } = storeToRefs(ngoBannerStore);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close']);

// 날짜 포맷
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await ngoBannerStore.detail(props.bannerSeq);
  });
};

// 모달이 열릴 때 데이터 로드
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      getDetail();
    }
  }
);
</script>
