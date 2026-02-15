<template>
  <div class="flex flex-col gap-2" :class="customerClass">
    <div class="flex items-end gap-2.5">
      <div class="grow">
        <div class="flex flex-col relative">
          <div v-if="label" class="flex-shrink mb-[15px] text-customSize14_sm text-customGray1f1">
            <label :for="id"
              ><span v-if="required" class="text-[#FF4D4F]">*</span> {{ label }}</label
            >
          </div>
          <input
            :id="idValue"
            ref="inputRef"
            class="w-full h-8 px-3 text-fontsize14 leading-[22px] text-customGray1f1 border border-customGrayE4E rounded-custom4 outline-0 placeholder:text-[#BFBFBF] dark:text-grayd9d9d9 dark:placeholder:text-gray404040 dark:border-gray424242 dark:bg-black141414 dark:read-only:text-white dark:read-only:placeholder:text-grayd9d9d9 read-only:bg-[#f0f0f0] dark:read-only:bg-black272727"
            :class="{
              'text-end': align === 'right'
            }"
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
            @keyup="$emit('keyup')"
            @keyup.enter="$emit('enter')"
            @change="$emit('change')"
            @click="$emit('click')"
            @blur="eventBlur"
          />
          <div
            v-if="isEmptyBtn && formattedValue"
            class="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <font-awesome-icon
              icon="close"
              class="text-gray-400 cursor-pointer"
              @click="emit('update:modelValue', '')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, onMounted, type Ref, ref } from 'vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Ast } from '@/utils/ast.util.ts';

defineComponent({
  name: 'InputRowBoxWork'
});

const props = defineProps({
  modelValue: {
    type: [String, Number]
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number
  },
  max: {
    type: Number
  },
  minlength: {
    type: Number
  },
  maxlength: {
    type: Number
  },
  pattern: {
    type: String
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  customerClass: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  align: {
    type: String as () => 'right' | 'left',
    default: 'left'
  },
  isEmptyBtn: {
    type: Boolean,
    default: false
  },
  isComma: {
    type: Boolean,
    default: false
  },
  isHpNumber: {
    type: Boolean,
    default: false
  },
  isTelNumber: {
    type: Boolean,
    default: false
  },
  isJuminNumber: {
    type: Boolean,
    default: false
  },
  isBizNumber: {
    type: Boolean,
    default: false
  },
  isJuridicalNumber: {
    type: Boolean,
    default: false
  },
  isCardNumber: {
    type: Boolean,
    default: false
  },
  nextInput: {
    type: String,
    default: ''
  }
});
const inputRef: Ref<HTMLInputElement | null> = ref(null);
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
    const numericValue = Ast.removeComma(props.modelValue).replace(/[^0-9+-.]/g, '');
    return Ast.comma(numericValue.toString());
  }
  return props.modelValue;
});

const eventBlur = (event: any) => {
  if (props.isComma) {
    const numericValue = Ast.removeComma(props.modelValue).replace(/[^0-9+-.]/g, '');
    if (isNaN(parseFloat(numericValue))) emit('update:modelValue', '0');
  }

  emit('blur', event);
};

const emit = defineEmits(['update:modelValue', 'keyup', 'enter', 'click', 'change', 'blur']);
const updateModelValue = (event: any) => {
  let value: any = event.target.value;
  if (props.isComma) {
    const numericValue = Ast.removeComma(value).replace(/[^0-9+-.]/g, '');
    if (isNaN(parseFloat(numericValue))) {
      emit('update:modelValue', 0);
    } else {
      emit('update:modelValue', parseFloat(numericValue));
    }
    return;
  }

  if (props.isHpNumber) {
    value = Ast.hpNumberUnderBar(event.target.value);
    if (value.length === 13) nextInputFocus();
  } else if (props.isTelNumber) {
    value = Ast.telNumberUnderBar(event.target.value);
    if (value.length >= 3) {
      if (value.substring(0, 1) === '1') {
        if (value.length === 9) nextInputFocus();
      } else if (value.substring(0, 3) === '030') {
        if (value.length === 14) nextInputFocus();
      } else if (value.substring(0, 3) === '050') {
        if (value.length === 14) nextInputFocus();
      } else if (value.substring(0, 2) === '02') {
        if (value.length === 12) nextInputFocus();
      } else if (value.length === 13) {
        nextInputFocus();
      }
    }
  } else if (props.isJuminNumber) {
    value = Ast.juminUnderBar(event.target.value);
    if (value.length === 14) nextInputFocus();
  } else if (props.isBizNumber) {
    value = Ast.bizUnderBar(event.target.value);
    if (value.length >= 12) nextInputFocus();
  } else if (props.isJuridicalNumber) {
    value = Ast.juridicalUnderBar(event.target.value);
    if (value.length === 14) nextInputFocus();
  } else if (props.isCardNumber) {
    value = Ast.cardUnderBar(event.target.value);
    if (value.length === 19) nextInputFocus();
  }
  emit('update:modelValue', value);
};
</script>
