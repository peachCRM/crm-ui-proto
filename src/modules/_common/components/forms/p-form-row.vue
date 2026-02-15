<template>
  <div
    class="border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex w-full border-b bg-gray-100 last:grow"
  >
    <div 
      :class="[
        'text-gray-600 dark:text-gray-400 flex shrink-0 items-center p-3',
        labelCenter ? 'justify-center' : ''
      ]"
      :style="{ width: labelWidth }"
    >
      {{ label }} <template v-if="isRequired">*</template>
    </div>
    <div
      :class="[
        'dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-fontsize14 flex grow items-center bg-white',
        noPadding ? '' : 'p-3 py-2'
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ 
  label: String, 
  isRequired: Boolean,
  labelWidth: { type: String, default: '154px' },
  noPadding: { type: Boolean, default: false },
  labelCenter: { type: Boolean, default: false }
});
</script>
