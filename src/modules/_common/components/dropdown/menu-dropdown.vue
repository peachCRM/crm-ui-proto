<template>
  <common-dropdown v-model:open="isOpen" :align="align" @close="handleClose">
    <template #trigger>
      <slot name="trigger">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ selectedLabel }}
          <icon-chevron-down
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </slot>
    </template>

    <!-- 드롭다운 메뉴 -->
    <div
      class="w-full divide-y divide-gray-100 dark:divide-gray-700"
      :class="{ 'min-w-fit': !maxWidth }"
      :style="maxWidth ? { maxWidth: `${maxWidth}px` } : {}"
    >
      <div>
        <template v-for="item in items" :key="item.id">
          <button
            type="button"
            class="w-full px-3 py-1.5 inline-flex items-center gap-2 text-left whitespace-nowrap text-xs hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'bg-gray-50 dark:bg-gray-700': selected === item.id,
              'text-gray-700 dark:text-gray-300': !item.disabled,
              'text-gray-400 dark:text-gray-500': item.disabled
            }"
            :disabled="item.disabled"
            @click="handleSelect(item)"
          >
            <!-- 아이콘 렌더링 -->
            <template v-if="item.icon">
              <component
                :is="item.icon.source"
                v-if="item.icon.type === 'component'"
                class="w-3.5 h-3.5 flex-shrink-0"
              />
              <img
                v-else
                :src="item.icon.source as string"
                :alt="item.icon.alt || ''"
                class="w-3.5 h-3.5 flex-shrink-0 object-contain"
              />
            </template>

            <span
              :class="{
                truncate: !multiLine,
                'line-clamp-2': multiLine
              }"
            >
              {{ item.label }}
            </span>
          </button>
        </template>
      </div>
    </div>
  </common-dropdown>
</template>

<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue';
import type { DropdownItem, DropdownProps } from './types.ts';
import CommonDropdown from './common-dropdown.vue';
import { ref, computed } from 'vue';

interface Props extends DropdownProps {
  align?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: undefined,
  multiLine: false,
  selected: undefined,
  align: 'left'
});

const emit = defineEmits<{
  (e: 'select', item: DropdownItem): void;
  (e: 'update:selected', id: string | number): void;
}>();

const isOpen = ref(false);

// 선택된 아이템의 라벨을 계산
const selectedLabel = computed(() => {
  if (!props.selected) return '선택하세요';
  const selectedItem = props.items.find((item) => item.id === props.selected);
  return selectedItem?.label || '선택하세요';
});

// 아이템 선택 처리
const handleSelect = (item: DropdownItem) => {
  if (item.disabled) return;
  emit('select', item);
  emit('update:selected', item.id);
  isOpen.value = false;
};

// 드롭다운 닫힐 때 처리
const handleClose = () => {
  // 필요한 경우 추가 로직
};
</script>
