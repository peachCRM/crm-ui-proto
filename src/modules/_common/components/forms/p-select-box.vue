<template>
  <div class="w-full">
    <div v-if="label" class="flex-auto flex items-center mb-2">
      <label :for="id" class="block whitespace-nowrap"
      ><span v-if="required" class="text-[#FF4D4F]">*</span> {{ label }}</label
      >
    </div>
    <div class="flex gap-2 items-center">
      <div
        ref="materialIcons"
        class="relative text-base w-full"
        :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
        @click="!disabled && (showDropdown = !showDropdown)"
      >
        <input
          :id="idValue"
          v-model="selectedItem"
          type="text"
          :name="name"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full h-8 px-2 pr-7 text-fontsize14 leading-[22px] text-customGray1f1 placeholder:text-customGray1f1 border border-customGrayE4E rounded-custom4 focus:outline-none focus:ring-0 dark:text-grayD9D9D9 dark:placeholder:text-grayD9D9D9 dark:border-gray424242 dark:bg-black141414"
          :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed opacity-50': disabled }"
          readonly
        />
        <div class="absolute right-2 top-1.5">
          <img
            src="../../../../assets/images/workspace/inc/select_arrow.svg"
            class="block dark:hidden"
            :class="{ 'rotate-180': showDropdown }"
          />
          <img
            src="../../../../assets/images/workspace/inc/select_arrow_dark.svg"
            class="hidden dark:block"
            :class="{ 'rotate-180': showDropdown }"
          />
        </div>
        <div
          v-if="showDropdown"
          class="absolute w-full mt-1 p-1 bg-white order border border-customGrayE4E rounded-custom4 focus:outline-none focus:ring-0 scrollable-div"
          style="z-index: 21"
          @wheel.stop
        >
          <span
            v-for="(option, index) in options"
            v-show="option.visible !== false"
            :key="index"
            :ref="
              (el) => {
                if (el) domRefs[option.value] = el;
              }
            "
            class="cursor-pointer block px-3 py-[5px] text-fontsize14 leading-[22px] text-customGray1f1 hover:bg-customSkyBlue1 rounded"
            :class="{
              'font-semibold bg-customSkyBlue1 hover:bg-customSkyBlue1': compareValues(
                selectedValue,
                option.value
              )
            }"
            :title="option.text"
            @click="selectOption(option, $event)"
          >
            {{ option.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

defineComponent({
  name: 'SelectBoxWork'
});

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number, Array],
    default: ''
  }
});
const materialIcons = ref(null);
const domRefs = ref({});
const selectedItem = ref('');
const selectedValue = ref(props.modelValue);
const showDropdown = ref(false);

const emits = defineEmits(['update:modelValue', 'change']);

const idValue = computed(() => {
  if (!props.id || props.id === '')
    return `selectbox-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});

// 값 비교 함수 추가
const compareValues = (value1, value2) => {
  // null, undefined 처리
  if (value1 == null && value2 == null) return true;
  if (value1 == null || value2 == null) return false;

  // 빈 문자열과 0 비교 처리
  if ((value1 === '' && value2 === 0) || (value1 === 0 && value2 === '')) return true;

  // 문자열 변환 후 비교
  return String(value1) === String(value2);
};

// 옵션 찾기 함수 개선
const findOptionByValue = (value) => {
  // 직접 일치하는 옵션 찾기
  let option = props.options.find((option) => option.value === value);

  // 직접 일치하는 옵션이 없으면 compareValues로 비교
  if (!option) {
    option = props.options.find((option) => compareValues(option.value, value));
  }

  return option;
};

const selectOption = (option, event) => {
  selectedItem.value = option.text;
  selectedValue.value = option.value; // 원본 타입 유지
  showDropdown.value = false;
  emits('update:modelValue', option.value); // 원본 타입 유지하여 emit
  emits('change', option.value);
  event.stopPropagation();
};

const toggleDropdown = (event) => {
  if (showDropdown.value && !materialIcons.value.contains(event.target)) {
    showDropdown.value = false;
  } else {
    nextTick(() => {
      if (showDropdown.value) {
        const scrollableDiv = materialIcons.value.querySelector('.scrollable-div');
        const selectedElement = Array.from(scrollableDiv.querySelectorAll('span')).find(
          (el) => el.textContent.trim() === selectedItem.value
        );

        if (selectedElement) {
          const offsetTop = selectedElement.offsetTop;
          const scrollTop = scrollableDiv.scrollTop;
          const elementHeight = selectedElement.offsetHeight;
          const divHeight = scrollableDiv.clientHeight;

          // 선택한 요소가 현재 표시된 영역 밖에 있는 경우 스크롤 조정
          if (offsetTop < scrollTop || offsetTop + elementHeight > scrollTop + divHeight) {
            scrollableDiv.scrollTop = offsetTop - divHeight / 2 + elementHeight / 2;
          }
        }
      }
    });
  }
};

onMounted(() => {
  document.addEventListener('click', toggleDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', toggleDropdown);
});

watch(
  () => props.modelValue,
  (value) => {
    selectedValue.value = value; // 원본 타입 유지
    setTimeout(() => {
      // 옵션 찾기
      const option = findOptionByValue(value);
      if (option) {
        selectedItem.value = option.text;
      } else {
        // 특별한 경우 처리 (0와 빈 문자열)
        if (value === 0 || value === '0') {
          const emptyOption = findOptionByValue('');
          if (emptyOption) selectedItem.value = emptyOption.text;
        }

        if (value === '') {
          const zeroOption = findOptionByValue(0);
          if (zeroOption) selectedItem.value = zeroOption.text;
        }
      }
    }, 100);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.options,
  (newOptions) => {
    const currentOption = findOptionByValue(props.modelValue);
    if (currentOption) {
      selectedItem.value = currentOption.text;
    }

    const defaultOption = newOptions.find((option) => option.isDefault === true);
    if (defaultOption) {
      setTimeout(() => {
        selectedValue.value = defaultOption.value;
        selectedItem.value = defaultOption.text;
        emits('update:modelValue', defaultOption.value);
      }, 100);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.scrollable-div {
  max-height: 250px; /* 원하는 최대 높이를 설정하세요. */
  overflow-y: auto; /* 세로 스크롤바가 보여집니다. */
}
</style>
