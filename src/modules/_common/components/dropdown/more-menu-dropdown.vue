<template>
  <menu-dropdown
    v-model:selected="selected"
    :items="items"
    :max-width="maxWidth"
    :align="align"
    @select="handleSelect"
  >
    <template #trigger>
      <button type="button">
        <component
          :is="props.direction === 'horizontal' ? IconDots : IconDotsVertical"
          class="w-4 h-4 text-gray-500 dark:text-gray-400"
        />
      </button>
    </template>
  </menu-dropdown>
</template>

<script setup lang="ts">
import { IconDotsVertical, IconDots } from '@tabler/icons-vue';
import type { DropdownItem } from './types.ts';
import MenuDropdown from './menu-dropdown.vue';
import { ref } from 'vue';

interface Props {
  items: DropdownItem[];
  direction?: 'vertical' | 'horizontal';
  align?: 'left' | 'right';
  maxWidth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  align: 'left',
  maxWidth: 150
});

const emit = defineEmits<{
  (e: 'select', item: DropdownItem): void;
}>();

const selected = ref<string | number>();

const handleSelect = (item: DropdownItem) => {
  emit('select', item);
};
</script>
