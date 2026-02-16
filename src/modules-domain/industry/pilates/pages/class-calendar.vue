<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '업종기능' }, { title: '필라테스' }, { title: '수업 관리' }]"
      title="수업 관리"
    />
  </div>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <u-button color="primary" icon="i-lucide-plus" label="수업 추가" @click="openCreateModal" />
    </div>
    <!-- 주간 달력 그리드: 월~금, 06:00~22:00 -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div class="min-w-[800px]">
        <!-- 헤더: 요일 -->
        <div class="grid grid-cols-[60px_repeat(5,1fr)] border-b border-gray-200 dark:border-gray-700">
          <div class="bg-gray-50 p-2 text-center text-sm font-medium dark:bg-gray-800">시간</div>
          <div
            v-for="day in weekDays"
            :key="day.value"
            class="border-l border-gray-200 p-2 text-center text-sm font-medium dark:border-gray-700 dark:bg-gray-800"
          >
            {{ day.text }}
          </div>
        </div>
        <!-- 시간대별 행 -->
        <div
          v-for="hour in timeSlots"
          :key="hour"
          class="grid grid-cols-[60px_repeat(5,1fr)] border-b border-gray-100 dark:border-gray-800"
        >
          <div class="bg-gray-50 p-1 text-center text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {{ String(hour).padStart(2, '0') }}:00
          </div>
          <div
            v-for="day in [1, 2, 3, 4, 5]"
            :key="day"
            class="relative min-h-[48px] border-l border-gray-100 p-1 dark:border-gray-800"
          >
            <div
              v-for="cls in getClassesInSlot(day, hour)"
              :key="cls.classSeq"
              :class="[
                'cursor-pointer rounded px-2 py-1 text-xs transition-shadow hover:shadow-md',
                getClassTypeBg(cls.classType)
              ]"
              @click="selectClass(cls)"
            >
              <div class="font-medium text-white">{{ cls.className }}</div>
              <div class="text-white/90">{{ cls.instructorName }}</div>
              <div class="text-white/80">
                {{ cls.startTime }}~{{ cls.endTime }} ({{ cls.currentCapacity }}/{{ cls.maxCapacity }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 선택된 수업 상세 -->
    <u-card v-if="selectedClass" class="mt-4">
      <template #header>
        <span class="font-semibold">수업 상세</span>
      </template>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div><span class="text-gray-500">수업명</span>: {{ selectedClass.className }}</div>
        <div><span class="text-gray-500">강사</span>: {{ selectedClass.instructorName }}</div>
        <div><span class="text-gray-500">유형</span>: {{ selectedClass.classType }}</div>
        <div><span class="text-gray-500">강의실</span>: {{ selectedClass.classRoom }}</div>
        <div><span class="text-gray-500">시간</span>: {{ selectedClass.startTime }}~{{ selectedClass.endTime }}</div>
        <div><span class="text-gray-500">정원</span>: {{ selectedClass.currentCapacity }}/{{ selectedClass.maxCapacity }}</div>
      </div>
    </u-card>
  </div>

  <class-create-modal v-model:open="isOpenCreate" @insert-ok="refreshCalendar" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import { usePilatesStore } from '../store/pilates.store';
import type { PilatesClass } from '../type/pilates.type';
import ClassCreateModal from './class-create.modal.vue';

const pilatesStore = usePilatesStore();
const selectedClass = ref<PilatesClass | undefined>(undefined);
const isOpenCreate = ref(false);

const weekDays = [
  { text: '월', value: '1' },
  { text: '화', value: '2' },
  { text: '수', value: '3' },
  { text: '목', value: '4' },
  { text: '금', value: '5' }
];

// 06:00~22:00, 1시간 단위
const timeSlots = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const classByDay = computed(() => pilatesStore.classCalendar());

function getClassesInSlot(dayOfWeek: number, hour: number): PilatesClass[] {
  const dayKey = String(dayOfWeek);
  const list = classByDay.value[dayKey] || [];
  return list.filter((cls) => {
    const startH = parseInt(cls.startTime.split(':')[0], 10);
    const endH = parseInt(cls.endTime.split(':')[0], 10);
    return hour >= startH && hour < endH;
  });
}

function getClassTypeBg(classType: string): string {
  const map: Record<string, string> = {
    개인: 'bg-blue-500',
    그룹: 'bg-green-500',
    듀엣: 'bg-amber-500'
  };
  return map[classType] || 'bg-gray-500';
}

function selectClass(cls: PilatesClass) {
  selectedClass.value = cls;
}

function openCreateModal() {
  isOpenCreate.value = true;
}

function refreshCalendar() {
  selectedClass.value = undefined;
}

onMounted(() => {
  pilatesStore.classCalendar();
});
</script>
