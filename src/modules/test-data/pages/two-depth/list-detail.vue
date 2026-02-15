<template>
  <u-card class="w-full">
    <div
      v-if="!route.query.selected"
      class="flex min-h-[900px] flex-grow items-center justify-center"
    >
      <p class="text-center font-bold">데이터를 선택해주세요.</p>
    </div>
    <div v-else class="flex h-full flex-grow flex-col">
      <div class="py-0.5 pb-2 text-lg font-semibold">상세보기</div>
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
            {{ detailData.bigint?.toLocaleString() }}
          </p-form-row>
          <p-form-row label="사용여부">
            {{ detailData.isUse }}
          </p-form-row>
        </div>
        <p-form-row label="이미지" v-if="detailData.imageList?.length > 0">
          <img :src="Utils.downUrl(detailData.imageList[0])" class="w-50 object-contain" />
        </p-form-row>
      </div>
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
        <div v-if="detailData.fileList?.length > 0">
          <div class="mb-2 border-b border-gray-200 text-sm text-gray-500">파일 리스트</div>
          <div v-for="(file, index) in detailData.fileList" :key="index">
            <a :href="getDownloadUrl(file)" target="_blank" class="hover:text-primary hover:underline">
              {{ file.fileName }} ({{ Utils.formatBytes(file.fileSize) }})
            </a>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <u-button color="primary" variant="outline" icon="i-lucide-edit" @click="goUpdate">
          수정
        </u-button>
        <u-button color="primary" variant="outline" icon="i-lucide-trash-2" @click="remove">
          삭제
        </u-button>
      </div>
    </div>
  </u-card>

  <update :test-seq="Number(route.query.selected)" v-model:open="isOpenUpdate" @update-ok="handleUpdateOk" />
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import Update from '@/modules/test-data/modals/update.modal.vue';
import { Utils } from '@/utils/utils.ts';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PTabContent from '@/modules/_common/components/forms/p-tab-content.vue';
import PTabList from '@/modules/_common/components/forms/p-tab-list.vue';
import DetailTabDefault from '@/modules/test-data/components/tab/detail-tab-default.vue';
import DetailTabExpire from '@/modules/test-data/components/tab/detail-tab-expire.vue';
import DetailTabWait from '@/modules/test-data/components/tab/detail-tab-wait.vue';
import DetailTabAddress from '@/modules/test-data/components/tab/detail-tab-address.vue';

const route = useRoute();
const router = useRouter();
const testDataStore = useTestDataStore();
const { detailData } = storeToRefs(testDataStore);
const getDownloadUrl = (file: any) => testDataStore.getDownloadUrl(file);

const isOpenUpdate = ref(false);

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
    await testDataStore.detail(Number(route.query.selected));
  });
};

const goUpdate = () => {
  isOpenUpdate.value = true;
};

const remove = async () => {
  if (!confirm('삭제 하시겠습니까?')) return;
  await FormService.loading(async () => {
    const result = await testDataStore.softDelete(Number(route.query.selected));
    if (result) {
      //리스트 reload
      router.push({ query: { ...route.query, selected: '' } });
    }
  });
};

const handleUpdateOk = () => {
  isOpenUpdate.value = false;
  // 상세 데이터 다시 조회
  getDetail();
};

onUnmounted(() => {
  // 컴포넌트 언마운트 시 초기화
  testDataStore.detailDataInit();
});

watch(
  route,
  () => {
    if (route.query && route.query.selected && route.query.selected != '') {
      getDetail();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped></style>
