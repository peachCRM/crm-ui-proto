<template>
  <div class="toast-wrapper" :style="toastStyle">
    <transition-group name="toast" tag="div">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
        <div class="flex items-center gap-4">
          <font-awesome-icon v-if="toast.type === 'success'" icon="circle-check" class="text-3xl" />
          <font-awesome-icon v-if="toast.type === 'info'" icon="circle-info" class="text-3xl" />
          <font-awesome-icon v-if="toast.type === 'error'" icon="circle-xmark" class="text-3xl" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p v-html="toast.message"></p>
        </div>
        <font-awesome-icon icon="close" @click="toastStore.removeToast(toast.id)" />
      </div>
    </transition-group>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useToastStore } from '@/modules/_common/store/toast.ts';

const toastStore = useToastStore();

const toasts = computed(() => toastStore.toasts);

const toastStyle = {
  position: 'fixed' as const,
  top: '50px',
  right: '20px',
  margin: '10px 20px',
  color: 'white',
  borderRadius: '5px',
  zIndex: '1000',
  transition: 'opacity 0.3s ease'
};
</script>

<style scoped lang="scss">
.toast {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 5px;
  opacity: 1;
  transition: all 0.5s ease;
}

.toast-leave-active,
.toast-enter-active {
  transition: all 0.5s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(0px);
}

.toast.success {
  background-color: #06d6a0;
}

.toast.error {
  background-color: #ef476f;
}

.toast.info {
  background-color: #1b9aaa;
}

button {
  background: none;
  border: none;
  color: white;
  margin-left: 10px;
  cursor: pointer;
}
</style>
