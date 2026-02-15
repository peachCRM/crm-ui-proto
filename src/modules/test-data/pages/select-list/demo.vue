<template>
  <div class="p-6">
    <div class="mb-6">
      <p-bread-crumb
        :breadcrumbs="[{ title: 'UI 가이드' }, { title: '선택목록' }]"
        title="선택목록"
      >
      </p-bread-crumb>
    </div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">데이터 선택 모달 데모</h1>
      <p class="text-gray-600">
        list-table-select.modal.vue 컴포넌트를 테스트할 수 있는 페이지입니다.
      </p>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center gap-4 mb-6">
        <u-button variant="solid" color="primary" icon="i-lucide-list" @click="openSelectModal">
          데이터 선택 모달 열기
        </u-button>

        <u-button variant="outline" color="neutral" @click="clearSelected"> 선택 초기화 </u-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-3">선택된 데이터</h3>
          <div class="bg-gray-50 rounded-lg p-4 min-h-[200px]">
            <div v-if="selectedData.length === 0" class="text-gray-500 text-center py-8">
              선택된 데이터가 없습니다.
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(item, index) in selectedData"
                :key="index"
                class="bg-white rounded p-3 border border-gray-200"
              >
                <div class="font-medium">ID: {{ item.testSeq }}</div>
                <div class="text-sm text-gray-600">제목: {{ item.subject }}</div>
                <div class="text-xs text-gray-500 mt-1">등록일: {{ item.insertDate }}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3">선택 통계</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">총 선택된 항목:</span>
                <span class="font-medium">{{ selectedData.length }}개</span>
              </div>
              <div v-if="selectedData.length > 0" class="flex justify-between">
                <span class="text-gray-600">선택된 ID 목록:</span>
                <span class="font-medium text-sm">
                  {{ selectedData.map((item) => item.testSeq).join(', ') }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="text-md font-medium mb-2">선택된 데이터 JSON</h4>
            <div class="bg-gray-900 text-gray-100 rounded p-3 text-xs overflow-auto max-h-96">
              <pre>{{ JSON.stringify(selectedData, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 선택 모달 -->
    <list-table-select-modal
      v-model:open="isOpenSelect"
      :select-list="selectedData"
      @select-ok="onSelectOk"
      @close="onModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListTableSelectModal from '@/modules/test-data/modals/list-table-select.modal.vue';

// 모달 상태
const isOpenSelect = ref(false);

// 선택된 데이터
const selectedData = ref<any[]>([]);

/**
 * 선택 모달 열기
 */
const openSelectModal = () => {
  isOpenSelect.value = true;
};

/**
 * 모달에서 선택 완료 시 호출
 */
const onSelectOk = (selectList: any[]) => {
  selectedData.value = [...selectList];

  // 토스트 메시지 표시
  useToast().add({
    title: '선택 완료',
    description: `${selectList.length}개 항목이 선택되었습니다.`,
    color: 'success'
  });
};

/**
 * 모달 닫기 시 호출
 */
const onModalClose = () => {
  console.log('모달이 닫혔습니다.');
};

/**
 * 선택 초기화
 */
const clearSelected = () => {
  selectedData.value = [];

  useToast().add({
    title: '초기화 완료',
    description: '선택된 데이터가 초기화되었습니다.',
    color: 'neutral'
  });
};
</script>
