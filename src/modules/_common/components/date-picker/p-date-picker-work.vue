<template>
  <div>
    <vue-date-picker
      v-model="date"
      :name="name"
      :auto-apply="autoApply"
      :enable-time-picker="enableTimePicker"
      :year-picker="yearPicker"
      :month-picker="monthPicker"
      :time-picker-inline="enableTimePicker"
      :enable-seconds="enableSecends"
      :format="dateFormat"
      :model-type="dateModel"
      :clearable="clearable"
      :min-date="minDate"
      :max-date="maxDate"
      :year-range="yearRange"
      :locale="locale"
      :text-input="textInput"
      class="custom-datepicker"
      :teleport="true"
      :week-start="0"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineComponent } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const { emitFormInput } = useFormField();
defineComponent({
  name: 'DatePickerWork'
});
const props = defineProps({
  name: { type: String, default: '' },
  dateFormat: { type: String, default: 'yyyy-MM-dd' },
  dateModel: { type: String, default: 'yyyy-MM-dd' },
  modelValue: { type: String, default: '' },
  textInput: { type: Boolean, default: true },
  autoApply: { type: Boolean, default: true },
  enableTimePicker: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  monthPicker: { type: Boolean, default: false },
  yearPicker: { type: Boolean, default: false },
  minDate: { type: [Date, String], default: undefined }, // 선택적 속성으로 설정(minDate?)
  maxDate: { type: [Date, String], default: undefined }, // 선택적 속성으로 설정(maxDate?)
  enableSecends: { type: Boolean, default: false },
  locale: { type: String, default: 'ko' },
  placeholder: { type: String, default: '' },
  yearRange: { type: Array<number>, default: undefined }
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
  emitFormInput();
});
</script>

<style lang="scss">
.custom-datepicker {
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
      color: #a0a7b4;
    }

    .dark & {
      color: #d9d9d9;
      border-color: #424242;
      background-color: #141414;

      &::placeholder {
        color: #404040;
      }
    }
    &:focus {
      border: 2px solid #3b82f6;
      border-color: #3b82f6; /* primary color */

      .dark & {
        border-color: #60a5fa;
      }
    }
  }
}

/* 일요일과 토요일의 색상 변경 */
.dp__instance_calendar .dp__calendar_item:nth-child(1) {
  color: red; /* 일요일 색상 */
}
.dp__instance_calendar .dp__calendar_item:nth-child(7) {
  color: blue; /* 토요일 색상 */
}
</style>
