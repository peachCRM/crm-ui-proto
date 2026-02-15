<template>
  <div
    class="shrink-0 flex gap-2 justify-center items-center"
    :class="checkboxPosition === 'right' ? 'flex-row-reverse' : 'flex-row'"
  >
    <input
      :id="idValue"
      class="bg-[#000]"
      type="checkbox"
      :value="value"
      :disabled="disabled"
      :name="name"
      :checked="isChecked"
      @change="handleChange"
    />
    <label
      v-if="label"
      class="text-fontsize14 leading-line22 text-customGray1f1 dark:text-grayd9d9d9 cursor-pointer"
      :class="overflow === 'hide' ? 'line-clamp-1' : ''"
      :for="idValue"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { computed, defineComponent } from 'vue';

defineComponent({
  name: 'CheckBoxWork'
});
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  checkboxPosition: {
    type: String,
    default: 'left', // 기본값은 왼쪽
    validator: (value) => ['left', 'right'].includes(value)
  },
  overflow: {
    type: String,
    default: 'hide', // 기본값은 왼쪽
    validator: (value) => ['hide', 'show'].includes(value)
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number],
    default: '',
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: '',
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked ? event.target.value : '');
  emit('change', event.target.checked ? event.target.value : '');
};

const idValue = computed(() => {
  if (!props.id || props.id === '') return `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});

const isChecked = computed(() => {
  return String(props.modelValue) === String(props.value);
});
</script>
