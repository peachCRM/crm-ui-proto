<template>
  <!-- 특수문자 선택 모달 -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background-color: rgba(0, 0, 0, 0.3)"
    @click="closeModal"
  >
    <div
      class="mx-4 max-h-96 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
      @click.stop
    >
      <div class="relative border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-medium text-gray-900">특수문자 선택</h3>
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="max-h-80 overflow-y-auto p-6">
        <div class="grid grid-cols-8 gap-2">
          <button
            v-for="char in specialCharacters"
            :key="char.symbol"
            @click="selectChar(char.symbol)"
            :title="char.name"
            class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-lg font-medium text-gray-700 transition-colors duration-200 hover:bg-blue-100 hover:text-blue-600"
          >
            {{ char.symbol }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
interface Props {
  isOpen: boolean;
}

defineProps<Props>();

// Emits
interface Emits {
  (e: 'close'): void;
  (e: 'select', char: string): void;
}

const emit = defineEmits<Emits>();

// 특수문자 목록 (이름과 함께)
const specialCharacters = ref([
  { symbol: '★', name: '별' },
  { symbol: '☆', name: '빈별' },
  { symbol: '♡', name: '하트' },
  { symbol: '♥', name: '검은하트' },
  { symbol: '●', name: '검은원' },
  { symbol: '○', name: '빈원' },
  { symbol: '■', name: '검은사각형' },
  { symbol: '□', name: '빈사각형' },
  { symbol: '▲', name: '검은삼각형' },
  { symbol: '△', name: '빈삼각형' },
  { symbol: '▼', name: '역삼각형' },
  { symbol: '▽', name: '빈역삼각형' },
  { symbol: '◆', name: '검은마름모' },
  { symbol: '◇', name: '빈마름모' },
  { symbol: '※', name: '참고표시' },
  { symbol: '§', name: '절표시' },
  { symbol: '→', name: '오른쪽화살표' },
  { symbol: '←', name: '왼쪽화살표' },
  { symbol: '↑', name: '위쪽화살표' },
  { symbol: '↓', name: '아래쪽화살표' },
  { symbol: '⇒', name: '굵은오른쪽화살표' },
  { symbol: '⇐', name: '굵은왼쪽화살표' },
  { symbol: '⇑', name: '굵은위쪽화살표' },
  { symbol: '⇓', name: '굵은아래쪽화살표' },
  { symbol: '①', name: '원숫자1' },
  { symbol: '②', name: '원숫자2' },
  { symbol: '③', name: '원숫자3' },
  { symbol: '④', name: '원숫자4' },
  { symbol: '⑤', name: '원숫자5' },
  { symbol: '⑥', name: '원숫자6' },
  { symbol: '⑦', name: '원숫자7' },
  { symbol: '⑧', name: '원숫자8' },
  { symbol: '℃', name: '섭씨' },
  { symbol: '℉', name: '화씨' },
  { symbol: '㎡', name: '제곱미터' },
  { symbol: '㎢', name: '제곱킬로미터' },
  { symbol: '㎥', name: '세제곱미터' },
  { symbol: '㎞', name: '킬로미터' },
  { symbol: '㎏', name: '킬로그램' },
  { symbol: '㎗', name: '데시리터' },
  { symbol: '€', name: '유로' },
  { symbol: '£', name: '파운드' },
  { symbol: '¥', name: '엔' },
  { symbol: '₩', name: '원' },
  { symbol: '¢', name: '센트' },
  { symbol: '©', name: '저작권' },
  { symbol: '®', name: '등록상표' },
  { symbol: '™', name: '상표' }
]);

// 모달 닫기
const closeModal = () => {
  emit('close');
};

// 특수문자 선택
const selectChar = (char: string) => {
  emit('select', char);
};
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>