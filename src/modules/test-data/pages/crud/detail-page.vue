<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: 'UI 가이드' }, { title: 'CRUD 기본' }]"
      title="CRUD 기본"
      layer
      :subtitle="'CRUD 기본 페이지 입니다.'"
    >
      <p>default dd페이지 입니다.</p>
    </p-bread-crumb>
  </div>
  <u-card>
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
          {{ detailData.bigint }}
        </p-form-row>
        <p-form-row label="사용여부">
          {{ detailData.isUse }}
        </p-form-row>
      </div>
      <p-form-row label="이미지" v-if="detailData.imageList && detailData.imageList.length > 0">
        <img :src="Utils.downUrl(detailData.imageList[0])" class="w-50 object-contain" />
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

    <div class="mt-4 flex justify-end gap-2">
      <u-button color="primary" variant="outline" icon="i-lucide-edit" @click="goUpdate">
        수정
      </u-button>
      <u-button color="primary" variant="outline" icon="i-lucide-trash-2" @click="remove">
        삭제
      </u-button>
      <u-button color="primary" @click="goList">목록</u-button>
    </div>
  </u-card>

  <update
    :testSeq="testSeq"
    v-model:open="isOpenUpdate"
    @update:open="(value) => (isOpenUpdate = value)"
    @close="() => (isOpenUpdate = false)"
    @update-ok="getDetail"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import { useRoute, useRouter } from 'vue-router';
import Update from '../../modals/update.modal.vue';
import { Utils } from '@/utils/utils.ts';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import DetailTabDefault from '@/modules/test-data/components/tab/detail-tab-default.vue';
import DetailTabWait from '@/modules/test-data/components/tab/detail-tab-wait.vue';
import PTabList from '@/modules/_common/components/forms/p-tab-list.vue';
import PTabContent from '@/modules/_common/components/forms/p-tab-content.vue';
import DetailTabExpire from '@/modules/test-data/components/tab/detail-tab-expire.vue';
import DetailTabAddress from '@/modules/test-data/components/tab/detail-tab-address.vue';

const route = useRoute();
const router = useRouter();
const testSeq = Number(route.params.testSeq);

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

const testDataStore = useTestDataStore();
const detailData = computed(() => testDataStore.detailData);
const getDownloadUrl = (file: any) => testDataStore.getDownloadUrl(file);

const isOpenUpdate = ref(false);

const getDetail = async () => {
  await FormService.loading(async () => {
    await testDataStore.detail(testSeq);
  });
};

const goList = () => {
  router.push({ name: 'test-crud-list' });
};

const goUpdate = () => {
  isOpenUpdate.value = true;
};

const remove = () => {
  if (!confirm('삭제하시겠습니까?')) return;
  FormService.loading(async () => {
    const result = await testDataStore.softDelete(testSeq);
    if (result) {
      goList();
    }
  });
};

onMounted(() => {
  getDetail();
});

onUnmounted(() => {
  testDataStore.detailDataInit();
});
</script>

<style scoped lang="scss"></style>
