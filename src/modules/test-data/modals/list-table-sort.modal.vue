<template>
  <u-modal v-model:open="isOpen" title="정렬">
    <template #body>
      <div class="sort_list">
        <draggable
          class="dragArea"
          tag="div"
          drag-class="dragging"
          chosen-class="chosen"
          :list="localListData"
          item-key="id"
        >
          <template #item="{ element }">
            <div
              class="w-full flex items-center h-[45px] leading-[45px] border-b border-gray-200 cursor-pointer"
            >
              <u-icon name="i-lucide-menu" class="mr-2" />
              <div>{{ element.testSeq }} - {{ element.subject }}</div>
            </div>
          </template>
        </draggable>
      </div>

      <div class="mt-3 flex justify-center gap-3">
        <u-button variant="outline" size="sm" @click="close">닫기</u-button>
        <u-button size="sm" @click="checkSelect">저장</u-button>
      </div>
    </template>
  </u-modal>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { TestData } from '@/modules/test-data/type/test-data.type.ts';

// Props 정의
interface Props {
  open: boolean;
  list: TestData[];
}
const props = defineProps<Props>();

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'sort-ok']);

// props로 받은 list를 로컬 변수로 복사
const localListData = ref([...props.list]);

// props가 변경될 때 로컬 데이터도 업데이트
watch(
  () => props.list,
  (newData) => {
    localListData.value = [...newData];
  },
  { deep: true }
);

const checkSelect = async () => {
  await FormService.loading(async () => {
    //list 데이터 정렬 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
  emit('sort-ok', localListData.value);
  close();
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

// 모달이 열릴 때 리스트 데이터 초기화
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      localListData.value = [...props.list];
    }
  }
);
</script>
<style lang="scss">
.chosen {
  background-color: #ffcccc; /* 원하는 색상으로 변경하세요. */
}

.dragging {
  background-color: #ccffcc; /* 원하는 색상으로 변경하세요. */
}
</style>
