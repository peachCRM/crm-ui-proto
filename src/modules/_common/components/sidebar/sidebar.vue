<template>
  <Teleport :to="teleportTo">
    <div v-if="modelValue" class="absolute inset-0 z-50 flex">
      <!-- 백드롭 -->
      <div
        v-if="showBackdrop"
        :class="[
          'absolute inset-0 transition-opacity duration-300',
          darkBackdrop ? 'bg-black/50' : 'bg-transparent'
        ]"
        @click="closeOnBackdropClick && $emit('update:modelValue', false)"
      ></div>

      <!-- 사이드바 본체 -->
      <div
        :class="[
          'absolute h-full bg-white shadow-2xl overflow-y-auto',
          position === 'right' ? 'right-sidebar' : 'left-sidebar'
        ]"
        :style="{ width }"
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  width?: string;
  teleportTo?: string;
  showBackdrop?: boolean;
  darkBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  position?: 'left' | 'right';
}

withDefaults(defineProps<Props>(), {
  width: '300px',
  teleportTo: 'body',
  showBackdrop: true,
  darkBackdrop: true,
  closeOnBackdropClick: true,
  position: 'right'
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped>
.right-sidebar {
  right: 0;
  animation: slideInRight 0.3s ease-out forwards;
}

.left-sidebar {
  left: 0;
  animation: slideInLeft 0.3s ease-out forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
