<template>
  <div ref="triggerRef" class="relative inline-block" :class="{ 'is-active': isOpen }">
    <!-- 드롭다운 트리거 -->
    <div class="cursor-pointer flex items-center" @click.stop="toggle">
      <slot name="trigger" />
    </div>

    <!-- 드롭다운 컨텐츠 -->
    <Teleport to="body">
      <div
        v-show="isOpen"
        ref="dropdownRef"
        v-click-outside="close"
        class="fixed min-w-[10rem] py-2 mt-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg dark:shadow-gray-900 text-gray-800 dark:text-gray-200"
        :style="dropdownStyle"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue';

// 드롭다운 닫기 핸들러를 관리하기 위한 Map
const dropdownCloseHandlers = ref(new Map<string, () => void>());
const dropdownId = ref(Math.random().toString(36).substring(7));

interface Props {
  // 초기 open 상태 설정
  initialOpen?: boolean;
  // 선호하는 위치 설정 (기본값: 'bottom')
  placement?: 'top' | 'bottom';
  // 선호하는 정렬 설정 (기본값: 'left')
  align?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  initialOpen: false,
  placement: 'bottom',
  align: 'left'
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const isOpen = ref(props.initialOpen);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({
  top: '0px',
  left: '0px',
  zIndex: 1000
});

// 드롭다운 위치 계산
const updateDropdownPosition = () => {
  if (!triggerRef.value || !dropdownRef.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const dropdownRect = dropdownRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // 위/아래 위치 결정
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const shouldShowAbove =
    props.placement === 'top' ||
    (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height);

  // 좌/우 정렬 결정
  const spaceRight = viewportWidth - triggerRect.left;
  const spaceLeft = triggerRect.right;
  const shouldAlignRight =
    props.align === 'right' || (spaceRight < dropdownRect.width && spaceLeft > dropdownRect.width);

  // 최종 위치 계산
  const top = shouldShowAbove
    ? `${triggerRect.top + window.scrollY - dropdownRect.height - 0}px`
    : `${triggerRect.bottom + window.scrollY + 0}px`;

  const left = shouldAlignRight
    ? `${triggerRect.right + window.scrollX - dropdownRect.width}px`
    : `${triggerRect.left + window.scrollX}px`;

  dropdownStyle.value = {
    top,
    left,
    zIndex: 1000
  };
};

// 다른 드롭다운 닫기
const closeOtherDropdowns = () => {
  dropdownCloseHandlers.value.forEach((closeHandler: () => void, id: string) => {
    if (id !== dropdownId.value) {
      closeHandler();
    }
  });
};

// 드롭다운 열기
const open = () => {
  closeOtherDropdowns();
  isOpen.value = true;
  emit('update:open', true);
  emit('open');
  nextTick(() => {
    updateDropdownPosition();
  });
};

// 드롭다운 닫기
const close = () => {
  isOpen.value = false;
  emit('update:open', false);
  emit('close');
};

// 드롭다운 토글
const toggle = () => {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
};

// 이벤트 리스너 설정
onMounted(() => {
  // 현재 드롭다운의 close 핸들러 등록
  dropdownCloseHandlers.value.set(dropdownId.value, close);

  window.addEventListener('scroll', updateDropdownPosition, true);
  window.addEventListener('resize', updateDropdownPosition);
  document.addEventListener('click', (e) => {
    if (!isOpen.value) return;
    const target = e.target as HTMLElement;
    if (!target.closest('.relative.inline-block')) {
      close();
    }
  });
});

onUnmounted(() => {
  // 현재 드롭다운의 핸들러 제거
  dropdownCloseHandlers.value.delete(dropdownId.value);

  window.removeEventListener('scroll', updateDropdownPosition, true);
  window.removeEventListener('resize', updateDropdownPosition);
  document.removeEventListener('click', close);
});

// 화면 크기나 스크롤 변경 시 위치 업데이트
watch(
  () => isOpen.value,
  (newValue: boolean) => {
    if (newValue) {
      nextTick(() => {
        updateDropdownPosition();
      });
    }
  }
);
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;

  &-trigger {
    cursor: pointer;
  }
}
</style>
