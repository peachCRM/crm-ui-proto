<template>
  <u-modal v-model:open="isOpen" title="삭제">
    <template #body>
      <div class="mb-5 text-xl font-semibold">삭제</div>

      <div class="w-full rounded bg-gray-200">
        <div
          class="rounded bg-blue-500 p-0.5 text-center text-xs leading-none font-medium text-blue-100"
          role="progressbar"
          :style="{ width: progressBarWidth }"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {{ progress }}%
        </div>
      </div>
      <div class="text-center">{{ progressCnt + '/' + list.length }}</div>

      <div class="mt-2 overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                아이디
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                제목
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                비고
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="(item, index) in list" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">{{ item.testSeq }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.subject }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ !item.isDone ? '처리중' : '완료' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-5 flex justify-end">
        <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      </div>
    </template>
  </u-modal>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';

// Props 정의
interface Props {
  open: boolean;
  list: any[];
}
const props = defineProps<Props>();

const testDataStore = useTestDataStore();
const progressCnt = ref(0);
const progress = ref(0);
const progressBarWidth = ref('0%');

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'update:complete']);

let isStop = false;
let idx: number = 0;
let increment: number = 0;

const onModalOpen = () => {
  progressCnt.value = 0;
  progress.value = 0;
  progressBarWidth.value = '0%';

  props.list.map((item: any) => {
    item.isDone = false;
    return item;
  });

  isStop = false;
  idx = 0;
  increment = Math.round((100 / props.list.length) * 10) / 10;
  execProgress();
};

const execProgress = async () => {
  if (isStop) {
    finish();
    return;
  }

  const list = props.list;
  const item = list[idx];

  // 실제 삭제 처리 실행
  await testDataStore.softDelete(item.testSeq);

  item.isDone = true;
  progressCnt.value += 1;
  progress.value += increment;
  progressBarWidth.value = `${progress.value}%`;

  idx++;
  if (idx <= list.length - 1) {
    setTimeout(execProgress);
    return;
  }
  finish();
};

const finish = () => {
  progress.value = 100;
  progressBarWidth.value = `${progress.value}%`;
  setTimeout(() => {
    close();
  }, 1000);
};

const close = () => {
  isStop = true;
  isOpen.value = false;
  emit('update:complete');
};

// 모달이 열릴 때 진행 시작
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      onModalOpen();
    }
  }
);
</script>
