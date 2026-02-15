<template>
  <PSelectBox v-model="searchDay" :options="searchDateList" @change="selectSearchDate" />
</template>
<script setup lang="ts">
import { defineComponent, type Ref, ref } from 'vue';
import dayjs, { locale } from 'dayjs';
import PSelectBox from '@/modules/_common/components/forms/p-select-box.vue';

import 'dayjs/locale/ko';

defineComponent({
  name: 'DaySelectWork'
});

locale('ko');

defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['setDate']);
const notSelectdValue: string = '-9999';
const searchDay: Ref<string> = ref(notSelectdValue);
const searchDateList: Ref<any> = ref([
  {
    id: '선택',
    value: notSelectdValue,
    text: '기간선택'
  }
]);

// 현재 날짜
const today = dayjs();

let deyItems = [1, 2, 3, 4, 5, 6, 7];
const tomorrow = today.subtract(-1, 'day');
const afterTomorrow = today.subtract(-2, 'day');
searchDateList.value.push({
  id: -2,
  value: '-2',
  text: '모레 (' + afterTomorrow.format('MM월DD일') + ') ' + afterTomorrow.format('ddd')
});
searchDateList.value.push({
  id: -1,
  value: '-1',
  text: '내일 (' + tomorrow.format('MM월DD일') + ') ' + tomorrow.format('ddd')
});
searchDateList.value.push({
  id: 0,
  value: '0',
  text: '오늘 (' + today.format('MM월DD일') + ') ' + today.format('ddd')
});
deyItems.forEach((val) => {
  const day = today.subtract(val, 'day');
  const text =
    val > 365
      ? val / 365 + '년'
      : val + '일전 (' + day.format('MM월DD일') + ') ' + day.format('ddd');
  const item: any = {
    id: val,
    value: String(val),
    text
  };
  searchDateList.value.push(item);
});

// 현재 날짜 기준으로 12개월
for (let i = 0; i < 12; i++) {
  const monthDate = today.subtract(i, 'month').format('YYYYMM');
  const item = {
    id: monthDate,
    value: monthDate,
    text: monthDate.substr(0, 4) + '년 ' + monthDate.substr(4, 2) + '월'
  };
  searchDateList.value.push(item);
}

// 1...4년 설정
deyItems = [365, 365 * 2, 365 * 3, 365 * 4];
deyItems.forEach((val) => {
  const text = val >= 365 ? val / 365 + '년' : val + '일';
  const item: any = {
    id: val,
    value: val,
    text
  };
  searchDateList.value.push(item);
});
const selectSearchDate = () => {
  const day: number = Number(searchDay.value);
  if (day === Number(notSelectdValue)) return;

  const selectDete = { startDate: '', endDate: '' };
  if (day < 8) {
    selectDete.startDate = dayjs().subtract(day, 'day').format('YYYY-MM-DD');
    selectDete.endDate = dayjs().subtract(day, 'day').format('YYYY-MM-DD');
  } else if (day < 190001) {
    selectDete.startDate = dayjs().subtract(day, 'day').format('YYYY-MM-DD');
    selectDete.endDate = dayjs().format('YYYY-MM-DD');
  } else {
    const startDate = dayjs(day + '01'); // 년월의 첫 번째 날
    const endDate = startDate.endOf('month'); // 년월의 마지막 날

    selectDete.startDate = startDate.format('YYYY-MM-DD');
    selectDete.endDate = endDate.format('YYYY-MM-DD');
  }

  emit('setDate', selectDete);
};
</script>
