<template>
  <div>
    <vue-date-picker
      v-model="date"
      :auto-apply="autoApply"
      :enable-time-picker="enableTimePicker"
      :month-picker="monthPicker"
      :time-picker-inline="enableTimePicker"
      :enable-seconds="enableSecends"
      :format="dateFormat"
      :model-type="dateFormat"
      :locale="locale"
      :text-input="textInput"
      :clearable="clearable"
      :week-start="0"
      range
      multi-calendars
      class="custom-datepicker-multi"
      :placeholder="placeholder"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineComponent } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

defineComponent({
  name: 'DatePickerMultiWork'
});

const props = defineProps({
  dateFormat: { type: String, default: 'yyyy-MM-dd' },
  modelValue: { type: String, default: '' },
  textInput: { type: Boolean, default: true },
  autoApply: { type: Boolean, default: true },
  enableTimePicker: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  monthPicker: { type: Boolean, default: false },
  enableSecends: { type: Boolean, default: false },
  locale: { type: String, default: 'ko' },
  placeholder: { type: String, default: '' }
});

const emits = defineEmits(['update:modelValue', 'change']);

const date = ref<string>(props.modelValue);
watch(
  () => props.modelValue,
  (newValue) => {
    date.value = newValue;
  }
);
watch(date, (value) => {
  emits('update:modelValue', value);
  emits('change', value);
});
</script>

<style lang="scss">
/* 일요일과 토요일의 색상 변경 */
.dp__instance_calendar .dp__calendar_item:nth-child(1) {
  color: red; /* 일요일 색상 */
}
.dp__instance_calendar .dp__calendar_item:nth-child(7) {
  color: blue; /* 토요일 색상 */
}

.custom-datepicker-multi {
  input {
    width: 100%;
    height: 2rem;
    padding-left: 2rem;
    padding-right: 0.25rem;
    font-size: 14px;
    line-height: 22px;
    color: #1f1f1f;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    outline: none;

    &::placeholder {
      color: #bfbfbf;
    }

    .dark & {
      color: #d9d9d9;
      border-color: #424242;
      background-color: #141414;

      &::placeholder {
        color: #404040;
      }
    }
  }
}
</style>
