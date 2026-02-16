<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '업종기능' }, { title: '필라테스' }, { title: '출석 체크' }]"
      title="출석 체크"
    />
  </div>
  <div class="flex flex-col gap-4">
    <!-- 상단: 오늘 날짜 + 수업 선택 -->
    <u-card>
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <div class="font-semibold text-gray-700 dark:text-gray-300">
          오늘 날짜: {{ todayStr }}
        </div>
        <p-nuxt-select
          v-model="selectedClassSeq"
          placeholder="수업 선택"
          :options="todayClassOptions"
          class="w-full md:w-64"
          @update:model-value="onClassSelect"
        />
      </div>
    </u-card>

    <!-- 수강생 목록 -->
    <u-card v-if="hasSelectedClass">
      <template #header>
        <span class="font-semibold">출석 체크</span>
      </template>
      <div v-if="attendanceRows.length > 0" class="space-y-3">
        <div
          v-for="row in attendanceRows"
          :key="row.customerSeq"
          :class="[
            'flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center',
            row.isCompleted ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
          ]"
        >
          <div class="flex-1">
            <div class="font-medium">{{ row.customerName }}</div>
            <div v-if="row.membership" class="text-sm text-gray-500">
              {{ row.membership.membershipType }} · 잔여 {{ row.membership.remainingSessions }}회
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">출석상태:</span>
              <div class="flex gap-2">
                <label
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  class="flex cursor-pointer items-center gap-1"
                >
                  <input
                    v-model="row.status"
                    type="radio"
                    :value="opt.value"
                    :disabled="row.isCompleted"
                  />
                  <span class="text-sm">{{ opt.text }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end pt-4">
          <u-button
            color="primary"
            label="출석 완료"
            @click="saveAttendance"
          />
        </div>
      </div>
      <div v-else class="py-8 text-center text-gray-500">
        수업을 선택하면 수강생 목록이 표시됩니다.
      </div>
    </u-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { usePilatesStore } from '../store/pilates.store';
import type { Membership } from '../type/pilates.type';

const pilatesStore = usePilatesStore();
const selectedClassSeq = ref<number | string>('');
const todayStr = ref(dayjs().format('YYYY년 MM월 DD일'));

type AttendanceRow = {
  customerSeq: number;
  customerName: string;
  status: string;
  membership: Membership | undefined;
  isCompleted: boolean;
};

const attendanceRows = ref<AttendanceRow[]>([]);

const statusOptions = [
  { text: '출석', value: '출석' },
  { text: '결석', value: '결석' },
  { text: '지각', value: '지각' },
  { text: '취소', value: '취소' }
];

const hasSelectedClass = computed(() => {
  const val = selectedClassSeq.value;
  return val !== '' && val !== undefined && Number(val) > 0;
});

const todayClassOptions = computed(() => {
  const list = pilatesStore.todayClasses;
  return [
    { text: '수업 선택', value: '' },
    ...list.map((c) => ({
      text: `${c.className} (${c.startTime}~${c.endTime})`,
      value: c.classSeq
    }))
  ];
});

function onClassSelect() {
  const val = selectedClassSeq.value;
  const seq = val === '' || val === undefined ? 0 : Number(val);
  if (!seq) {
    attendanceRows.value = [];
    return;
  }
  const list = pilatesStore.attendanceList(seq);
  const today = dayjs().format('YYYY-MM-DD');
  attendanceRows.value = list.map((a) => {
    const membership = pilatesStore.getMembershipByCustomerSeq(a.customerSeq);
    return {
      customerSeq: a.customerSeq,
      customerName: a.customerName,
      status: a.status,
      membership,
      isCompleted: !!a.insertDate
    };
  });
}

function saveAttendance() {
  const val = selectedClassSeq.value;
  const seq = val === '' || val === undefined ? 0 : Number(val);
  if (!seq) return;
  const today = dayjs().format('YYYY-MM-DD');
  for (const row of attendanceRows.value) {
    pilatesStore.attendanceCheck({
      classSeq: seq,
      attendanceDate: today,
      customerSeq: row.customerSeq,
      status: row.status,
      memo: ''
    });
  }
  onClassSelect();
}

onMounted(() => {
  pilatesStore.setTodayClasses();
});
</script>
