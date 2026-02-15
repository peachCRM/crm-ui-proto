<template>
  <div
    class="shrink-0 flex gap-2 justify-center items-center"
    :class="checkboxPosition === 'right' ? 'flex-row-reverse' : 'flex-row'"
  >
    <input
      :id="idValue"
      class="bg-[#000]"
      type="checkbox"
      :disabled="disabled"
      :name="name"
      :checked="modelValue"
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
  name: 'ToggleCheckBoxWork'
});

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  checkboxPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  overflow: {
    type: String,
    default: 'hide',
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
  modelValue: {
    type: Boolean,
    default: false,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked);
  emit('change', event.target.checked);
};

const idValue = computed(() => {
  if (!props.id || props.id === '')
    return `toggle-checkbox-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});
</script>
