import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<{ id: number; message: string; type: string }[]>([]);

  // 토스트를 추가하는 함수
  const showToast = (msg: string, msgType = 'success', showDuration = 1800) => {
    const id = Date.now(); // 고유 ID 생성
    toasts.value.push({ id, message: msg, type: msgType });

    // 지정된 시간이 지나면 자동으로 삭제
    setTimeout(() => {
      removeToast(id);
    }, showDuration);
  };

  // 특정 토스트를 삭제하는 함수
  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return { toasts, showToast, removeToast };
});
