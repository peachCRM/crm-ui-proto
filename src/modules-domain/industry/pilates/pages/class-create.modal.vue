<template>
  <u-modal
    v-model:open="isOpen"
    title="수업 추가"
    :ui="{ content: 'sm:max-w-xl w-full' }"
  >
    <template #body>
      <div class="space-y-4">
        <p-form-row label="수업명" is-required>
          <p-input-box v-model="formData.className" placeholder="수업명 입력" class="w-full" />
        </p-form-row>
        <p-form-row label="강사명" is-required>
          <p-input-box v-model="formData.instructorName" placeholder="강사명 입력" class="w-full" />
        </p-form-row>
        <p-form-row label="수업유형" is-required>
          <p-nuxt-select
            v-model="formData.classType"
            placeholder="선택"
            :options="classTypeOptions"
            class="w-full"
          />
        </p-form-row>
        <p-form-row label="요일" is-required>
          <p-nuxt-select
            v-model="formData.dayOfWeek"
            placeholder="선택"
            :options="dayOfWeekOptions"
            class="w-full"
          />
        </p-form-row>
        <div class="grid grid-cols-2 gap-4">
          <p-form-row label="시작시간" is-required>
            <u-input v-model="formData.startTime" type="time" class="w-full" />
          </p-form-row>
          <p-form-row label="종료시간" is-required>
            <u-input v-model="formData.endTime" type="time" class="w-full" />
          </p-form-row>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <p-form-row label="최대정원" is-required>
            <p-input-box v-model="formData.maxCapacity" class="w-full" is-number-only />
          </p-form-row>
          <p-form-row label="강의실">
            <p-input-box v-model="formData.classRoom" placeholder="강의실" class="w-full" />
          </p-form-row>
        </div>
      </div>
    </template>
    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">취소</u-button>
      <u-button color="primary" @click="register">등록</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePilatesStore } from '../store/pilates.store';
import type { PilatesClassInsertDto } from '../type/pilates.type';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';

interface Props {
  open: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'insert-ok': [];
}>();

const pilatesStore = usePilatesStore();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const formData = ref<PilatesClassInsertDto>({
  className: '',
  instructorName: '',
  classType: '그룹',
  dayOfWeek: '1',
  startTime: '09:00',
  endTime: '10:00',
  maxCapacity: 8,
  classRoom: 'A룸'
});

const classTypeOptions = [
  { text: '개인', value: '개인' },
  { text: '그룹', value: '그룹' },
  { text: '듀엣', value: '듀엣' }
];

const dayOfWeekOptions = [
  { text: '월요일', value: '1' },
  { text: '화요일', value: '2' },
  { text: '수요일', value: '3' },
  { text: '목요일', value: '4' },
  { text: '금요일', value: '5' }
];

const register = () => {
  if (!formData.value.className.trim() || !formData.value.instructorName.trim()) return;
  pilatesStore.classInsert({
    ...formData.value,
    maxCapacity: Number(formData.value.maxCapacity) || 8
  });
  emit('insert-ok');
  close();
};

const close = () => {
  isOpen.value = false;
};

watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      formData.value = {
        className: '',
        instructorName: '',
        classType: '그룹',
        dayOfWeek: '1',
        startTime: '09:00',
        endTime: '10:00',
        maxCapacity: 8,
        classRoom: 'A룸'
      };
    }
  }
);
</script>
