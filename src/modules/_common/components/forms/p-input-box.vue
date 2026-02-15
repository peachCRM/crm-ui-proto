<template>
  <div class="relative flex flex-col" :class="customerClass">
    <div
      v-if="label"
      class="text-customSize15 sm:text-customSize15_sm text-customBlack444 mb-[15px] flex-shrink px-2.5"
    >
      <label :for="id">{{ label }}</label>
    </div>

    <div class="relative">
      <input
        :id="idValue"
        ref="inputRef"
        class="text-fontsize14 text-customGray1f1 border-customGrayE4E rounded-custom4 dark:text-grayd9d9d9 dark:placeholder:text-gray404040 dark:border-gray424242 dark:bg-black141414 dark:read-only:placeholder:text-grayd9d9d9 dark:read-only:bg-black272727 invalid:border-redFF4 h-8 w-full border px-3 leading-[22px] outline-0 placeholder:text-[#BFBFBF] read-only:bg-[#f0f0f0] dark:read-only:text-white"
        :class="[{ 'text-end': align === 'right' }, customInputClass]"
        :name="name"
        :type="type"
        :value="formattedValue"
        :disabled="disabled"
        :required="required"
        :minlength="minlength"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :pattern="pattern"
        :readonly="readonly"
        :min="min"
        :max="max"
        @input="updateModelValue"
        @paste="handlePaste"
        @keydown="handleKeydown"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        @keyup="$emit('keyup')"
        @keyup.enter="$emit('enter')"
        @change="$emit('change')"
        @click="$emit('click')"
        @blur="eventBlur"
      />
      <div
        v-if="isEmptyBtn && formattedValue"
        class="absolute top-1/2 right-2 -translate-y-1/2 transform"
      >
        <font-awesome-icon
          icon="close"
          class="cursor-pointer text-gray-400"
          @click="emit('update:modelValue', '')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, nextTick, onMounted, type Ref, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Ast } from '@/utils/ast.util.ts';

const { emitFormInput } = useFormField();

defineComponent({
  name: 'InputBoxWork'
});

interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  id?: string;
  name?: string;
  customerClass?: string;
  readonly?: boolean;
  align?: 'right' | 'left';
  isEmptyBtn?: boolean;
  isComma?: boolean;
  isHpNumber?: boolean;
  isTelNumber?: boolean;
  isJuminNumber?: boolean;
  isBizNumber?: boolean;
  isJuridicalNumber?: boolean;
  isCardNumber?: boolean;
  isNumberOnly?: boolean;
  nextInput?: string;
  customInputClass?: object;
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void;
  (e: 'keyup'): void;
  (e: 'enter'): void;
  (e: 'click'): void;
  (e: 'change'): void;
  (e: 'blur', event: Event): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  label: '',
  disabled: false,
  required: false,
  id: '',
  name: '',
  customerClass: '',
  readonly: false,
  align: 'left',
  isEmptyBtn: false,
  isComma: false,
  isHpNumber: false,
  isTelNumber: false,
  isJuminNumber: false,
  isBizNumber: false,
  isJuridicalNumber: false,
  isCardNumber: false,
  isNumberOnly: false,
  nextInput: '',
  customInputClass: () => ({})
});

const emit = defineEmits<Emits>();

const inputRef: Ref<HTMLInputElement | null> = ref(null);
const isComposing = ref(false); // IME 조합 중인지 여부
const savedValueBeforeComposition = ref(''); // IME 조합 시작 전 값 저장

const focus = () => {
  if (inputRef.value) inputRef.value.focus();
};

defineExpose({ focus });

const idValue = computed(() => {
  if (!props.id || props.id === '') return `input-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});

const parentForm: Ref<HTMLFormElement | null> = ref(null);

onMounted(() => {
  let currentElement: HTMLElement | null = inputRef.value;
  while (currentElement && currentElement.tagName !== 'FORM') {
    currentElement = currentElement.parentElement;
  }
  parentForm.value = currentElement as HTMLFormElement | null;
});

const nextInputFocus = () => {
  if (parentForm.value) {
    const nextInput = parentForm.value.querySelector(`input[name="${props.nextInput}"]`);
    if (nextInput) (nextInput as HTMLInputElement).focus();
  } else {
    const nextInput = document.querySelector(`input[name="${props.nextInput}"]`);
    if (nextInput) (nextInput as HTMLInputElement).focus();
  }
};

const formattedValue = computed(() => {
  if (props.isComma) {
    if (typeof props.modelValue === 'number') {
      return Ast.comma(props.modelValue.toString());
    } else {
      const numericValue = Ast.removeComma(props.modelValue).replace(/[^0-9+-.]/g, '');
      return Ast.comma(numericValue.toString());
    }
  }
  // isNumberOnly일 때 숫자가 아닌 모든 문자 제거하여 표시
  if (props.isNumberOnly) {
    return String(props.modelValue || '').replace(/[^0-9]/g, '');
  }
  return props.modelValue;
});

const eventBlur = (event: Event) => {
  if (props.isComma) {
    const numericValue = Ast.removeComma(props.modelValue).replace(/[^0-9+-.]/g, '');
    if (isNaN(parseFloat(numericValue))) emit('update:modelValue', '0');
  }

  emit('blur', event);
};

const updateModelValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;

  if (props.isComma) {
    const numericValue = Ast.removeComma(String(value)).replace(/[^0-9+-.]/g, '');
    if (isNaN(parseFloat(numericValue))) {
      emit('update:modelValue', 0);
    } else {
      emit('update:modelValue', parseFloat(numericValue));
    }
    emitFormInput();
    return;
  }

  if (props.isHpNumber) {
    value = Ast.hpNumberUnderBar(target.value) || '';
    if (String(value).length === 13) nextInputFocus();
  } else if (props.isTelNumber) {
    value = Ast.telNumberUnderBar(target.value) || '';
    const strValue = String(value);
    if (strValue.length >= 3) {
      if (strValue.substring(0, 1) === '1') {
        if (strValue.length === 9) nextInputFocus();
      } else if (strValue.substring(0, 3) === '030') {
        if (strValue.length === 14) nextInputFocus();
      } else if (strValue.substring(0, 3) === '050') {
        if (strValue.length === 14) nextInputFocus();
      } else if (strValue.substring(0, 2) === '02') {
        if (strValue.length === 12) nextInputFocus();
      } else if (strValue.length === 13) {
        nextInputFocus();
      }
    }
  } else if (props.isJuminNumber) {
    // 주민등록번호
    value = Ast.juminUnderBar(target.value) || '';
    if (String(value).length === 14) nextInputFocus();
  } else if (props.isBizNumber) {
    // 사업자등록번호
    value = Ast.bizUnderBar(target.value) || '';
    if (String(value).length >= 12) nextInputFocus();
  } else if (props.isJuridicalNumber) {
    // 법인등록번호
    value = Ast.juridicalUnderBar(target.value) || '';
    if (String(value).length === 14) nextInputFocus();
  } else if (props.isCardNumber) {
    // 카드번호
    value = Ast.cardUnderBar(target.value) || '';
    if (String(value).length === 19) nextInputFocus();
  } else if (props.isNumberOnly) {
    // IME 조합 중이면 조합 시작 전 값 유지 (compositionend에서 최종 처리)
    if (isComposing.value) {
      // 조합 중에는 저장된 값으로 복원
      target.value = savedValueBeforeComposition.value;
      return;
    }
    
    // 숫자만 입력 (숫자가 아닌 모든 문자 제거)
    const cleanedValue = String(target.value).replace(/[^0-9]/g, '');
    
    // input 요소의 value도 직접 업데이트하여 화면에서 즉시 제거
    if (target.value !== cleanedValue) {
      const cursorPos = target.selectionStart || 0;
      const diff = target.value.length - cleanedValue.length;
      target.value = cleanedValue;
      // 커서 위치 보정
      const newCursorPos = Math.max(0, cursorPos - diff);
      target.setSelectionRange(newCursorPos, newCursorPos);
    }
    
    emit('update:modelValue', cleanedValue);
    emitFormInput();
    return;
  }

  emit('update:modelValue', value);
  emitFormInput();
};

// 붙여넣기 시 숫자가 아닌 모든 문자 제거
const handlePaste = (event: ClipboardEvent) => {
  if (!props.isNumberOnly) return;

  event.preventDefault();
  const pastedText = event.clipboardData?.getData('text') || '';
  // 숫자가 아닌 모든 문자 제거
  const cleanedText = pastedText.replace(/[^0-9]/g, '');

  // 현재 input의 선택 영역을 고려하여 값 업데이트
  const target = event.target as HTMLInputElement;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  const currentValue = String(props.modelValue);
  const newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);

  emit('update:modelValue', newValue);
  emitFormInput();

  // 커서 위치 조정
  nextTick(() => {
    if (inputRef.value) {
      const newCursorPos = start + cleanedText.length;
      inputRef.value.setSelectionRange(newCursorPos, newCursorPos);
    }
  });
};

// 숫자 외 모든 문자 입력 차단
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isNumberOnly) return;

  // 허용할 키: 숫자, 백스페이스, Delete, 방향키, Tab, Home, End, Ctrl 조합 등
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'];
  const isNumber = /^[0-9]$/.test(event.key);
  const isAllowedKey = allowedKeys.includes(event.key);
  const isCtrlCombination = event.ctrlKey || event.metaKey;

  // 허용된 키가 눌리면 조합 상태 리셋 (한글 입력 후 Backspace 등 정상 동작)
  if (isNumber || isAllowedKey || isCtrlCombination) {
    isComposing.value = false;
  }

  // IME 조합 중이면 무시 (한글 등)
  if (event.isComposing) return;

  if (!isNumber && !isAllowedKey && !isCtrlCombination) {
    event.preventDefault();
  }
};

// 한글 등 IME 조합 시작 시 현재 값 저장
const handleCompositionStart = () => {
  isComposing.value = true;
  // 조합 시작 전 값을 저장 (숫자만 유지)
  if (props.isNumberOnly) {
    savedValueBeforeComposition.value = String(props.modelValue || '').replace(/[^0-9]/g, '');
  }
};

// 한글 등 IME 조합 완료 시 숫자 외 문자 제거
const handleCompositionEnd = (event: CompositionEvent) => {
  isComposing.value = false;
  
  if (!props.isNumberOnly) return;

  const target = event.target as HTMLInputElement;
  // 입력된 전체 값에서 숫자만 추출
  const cleanedValue = target.value.replace(/[^0-9]/g, '');
  
  // DOM 업데이트
  target.value = cleanedValue;
  
  emit('update:modelValue', cleanedValue);
  emitFormInput();
};
</script>
