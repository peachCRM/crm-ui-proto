<template>
  <div class="flex gap-2 items-center cursor-pointer" @click="handleChange">
    <input
      :id="idValue"
      :name="name"
      :disabled="disabled"
      type="radio"
      :value="value"
      class="hidden"
      :checked="isChecked"
    />
    <div
      class="flex justify-center items-center w-4 h-4 bg-white rounded-3xl border border-customGrayE4E dark:border-gray424242 dark:bg-black141414"
      :class="{
        'border-customSkyBlue2': isChecked,
        'border hover:border-customSkyBlue2': !isChecked
      }"
    >
      <div v-if="isChecked" class="w-2 h-2 rounded-3xl bg-customSkyBlue2"></div>
    </div>
    <label
      :for="id"
      class="text-fontsize14 leading-line22 text-customGray1f1 dark:text-grayd9d9d9 cursor-pointer"
      >{{ label }}</label
    >
  </div>
  <!--  <div class="flex items-center gap-2">-->
  <!--    <input-->
  <!--      type="radio"-->
  <!--      class="text-default h-4 w-4"-->
  <!--      :value="value"-->
  <!--      :name="name"-->
  <!--      :id="id"-->
  <!--      :disabled="disabled"-->
  <!--      :checked="isChecked"-->
  <!--      @change="handleChange"-->
  <!--    />-->
  <!--    <label class="text-gray-900 whitespace-nowrap" :for="id">{{ label }}</label-->
  <!--    >-->
  <!--  </div>-->
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue';

defineComponent({
  name: 'RadioBoxWork'
});

const props = defineProps({
  label: {
    type: String,
    required: true
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

const handleChange = (event: any) => {
  emit('update:modelValue', props.value);
  emit('change', event.target.checked ? event.target.value : '');
};

const idValue = computed(() => {
  if (!props.id || props.id === '') return `radiobox-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});

const isChecked = computed(() => {
  return String(props.modelValue) === String(props.value);
});
</script>

<style scoped lang="scss">
input[type='radio'].hidden {
  visibility: hidden;
}
</style>
