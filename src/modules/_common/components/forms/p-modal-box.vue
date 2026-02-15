<template>
  <div v-if="open">
    <div
      class="fixed left-0 top-0 right-0 bottom-0 bg-black opacity-50"
      :style="{ 'z-index': zIndex - 1 }"
    ></div>
    <div
      id="default-modal"
      tabindex="-1"
      class="overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      :style="{ 'z-index': zIndex }"
    >
      <!-- S : INNER -->
      <div
        class="flex flex-col m-auto bg-white rounded-custom8 shadow-custom0010 dark:bg-black141414"
        :style="{ width: boxWidth + 'px' }"
      >
        <!-- S : HEAD -->
        <div class="relative flex flex-row justify-between px-6 py-4 pt-5">
          <div v-if="title !== ''" class="flex items-center gap-1 dark:text-grayd9d9d9">
            <p class="font-semibold text-fontsize18 leading-6 text-customGray1f1">{{ title }}</p>
            <div class="relative">
              <img
                v-if="content"
                src="../../../../assets/images/workspace/taxi/icon_exclamation%20mark.png"
                class="cursor-pointer w-[20px]"
                alt="설명표시"
                @click="messageToggle"
              />
              <div
                v-if="message"
                class="z-20 absolute flex flex-col items-center w-auto left-[10px] top-[20px]"
              >
                <div
                  class="bg-white rounded-custom8 shadow-custom04100 border flex flex-col justify-center items-center"
                >
                  <div class="flex flex-col">
                    <div
                      class="ql-editor px-3 py-2 text-fontsize14 text-customGray1f1 content-center break-keep whitespace-nowrap tracking-[2px]"
                      v-html="content"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute right-6 top-5" @click="close">
            <img
              src="../../../../assets/images/workspace/inc/modal_close.svg"
              class="cursor-pointer"
              alt="닫기"
            />
          </div>
        </div>
        <!-- E : HEAD -->
        <div class="flex flex-col px-6 pb-3" @wheel.stop>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  bgClickClose: {
    type: Boolean,
    default: false
  },
  boxWidth: {
    type: String,
    default: '500'
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  zIndex: {
    type: Number,
    default: 60
  }
});
defineComponent({
  name: 'TaxiModalBox'
});
const open = ref(false);

const message = ref(false);
const messageToggle = () => {
  message.value = !message.value;
};

const close = () => {
  emit('update:modelValue', false);
  document.body.style.overflow = 'auto';
};

// const bgClose = () => {
//   if (props.bgClickClose) {
//     close();
//   }
// };

onMounted(() => {
  if (props.modelValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

watch(
  () => props.modelValue,
  (value: boolean) => {
    open.value = value;
    if (value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss"></style>
