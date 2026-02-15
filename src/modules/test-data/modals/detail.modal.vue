<template>
  <u-modal
    v-model:open="isOpen"
    :ui="{
      content: 'min-w-sm max-w-[900px]', // 원하는 넓이 지정
      footer: 'justify-end'
    }"
    title="상세"
  >
    <template #body>
      <div class="border-t">
        <p-form-row label="제목">
          {{ detailData.subject }}
        </p-form-row>
        <div class="flex">
          <p-form-row label="날짜">
            {{ detailData.insertDate }}
          </p-form-row>
          <p-form-row label="공지여부">
            {{ detailData.value }}
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="금액">
            {{ detailData.bigint }}
          </p-form-row>
          <p-form-row label="사용여부">
            {{ detailData.isUse }}
          </p-form-row>
        </div>
        <p-form-row label="이미지" v-if="detailData.imageList && detailData.imageList.length > 0">
          <img :src="getDownloadUrl(detailData.imageList[0])" class="w-50 object-contain" />
        </p-form-row>

        <p-tab-list :tab-list="tabs" :active-tab="activeTab" @set-active-tab="setActiveTab" />
        <p-tab-content :tab-id="activeTab" :active-tab="activeTab">
          <detail-tab-default v-if="activeTab === 'default'" />
        </p-tab-content>
        <p-tab-content :tab-id="activeTab" :active-tab="activeTab">
          <detail-tab-expire v-if="activeTab === 'expire'" :active-tab="activeTab" />
        </p-tab-content>
        <p-tab-content :tab-id="activeTab" :active-tab="activeTab">
          <detail-tab-wait v-if="activeTab === 'wait'" :active-tab="activeTab" />
        </p-tab-content>
        <p-tab-content :tab-id="activeTab" :active-tab="activeTab">
          <detail-tab-address v-if="activeTab === 'address'" :active-tab="activeTab" />
        </p-tab-content>

        <div class="mt-4 space-y-4">
          <div v-html="detailData.contents" class="ql-editor min-h-[400px] tinymce-content"></div>
          <div>
            <div class="mb-2 border-b border-gray-200 text-sm text-gray-500">파일 리스트</div>
            <div v-for="(file, index) in detailData.fileList" :key="index">
              <a :href="getDownloadUrl(file)" target="_blank" class="hover:text-primary hover:underline">
                {{ file.fileName }} ({{ Utils.formatBytes(file.fileSize) }})
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <u-button variant="soft" color="primary" @click="close" label="닫기" />
      <u-button
        variant="soft"
        color="primary"
        icon="i-lucide-trash-2"
        @click="remove"
        label="삭제"
      />
      <u-button
        variant="soft"
        color="primary"
        icon="i-lucide-edit"
        @click="goUpdate"
        label="수정"
      />
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { FormService } from '@/modules/_common/services/form.service.ts';
import { Utils } from '@/utils/utils.ts';
import DetailTabDefault from '@/modules/test-data/components/tab/detail-tab-default.vue';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import DetailTabWait from '@/modules/test-data/components/tab/detail-tab-wait.vue';
import PTabList from '@/modules/_common/components/forms/p-tab-list.vue';
import PTabContent from '@/modules/_common/components/forms/p-tab-content.vue';
import DetailTabExpire from '@/modules/test-data/components/tab/detail-tab-expire.vue';
import DetailTabAddress from '@/modules/test-data/components/tab/detail-tab-address.vue';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import { computed, onUnmounted, ref, watch } from 'vue';

// Props 정의
interface Props {
  testSeq: number;
  open: boolean;
}
const props = defineProps<Props>();

const testDataStore = useTestDataStore();
const detailData = computed(() => testDataStore.detailData);
const getDownloadUrl = (file: any) => testDataStore.getDownloadUrl(file);

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'remove-ok', 'go-update']);

const activeTab = ref('default');
const tabs = [
  { id: 'default', text: '기본정보' },
  { id: 'expire', text: '만료' },
  { id: 'wait', text: '대기' },
  { id: 'address', text: '주소' }
];

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await testDataStore.detail(props.testSeq);
  });
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const remove = async () => {
  if (!confirm('삭제하시겠습니까?')) return;
  await FormService.loading(async () => {
    const result = await testDataStore.softDelete(props.testSeq);
    if (result.isSuccess) {
      FormService.toastMessage('삭제가 완료되었습니다.', 'success');
      emit('remove-ok');
      close();
    }
  });
};

const goUpdate = () => {
  emit('go-update', props.testSeq);
  close();
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

onUnmounted(() => {
  testDataStore.detailDataInit();
});
</script>

<style scoped lang="scss"></style>
