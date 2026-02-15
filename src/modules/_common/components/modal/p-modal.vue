<template>
  <Teleport to="body">
    <div :class="{ hidden: !isOpenModalCheck }" @wheel.stop>
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
          :style="{ width: `${boxWidth}px` }"
        >
          <!-- S : HEAD -->
          <div class="relative flex flex-row justify-between px-6 py-4 pt-5">
            <div v-if="title !== ''" class="flex items-center gap-1 dark:text-grayd9d9d9">
              <p class="font-semibold text-fontsize18 leading-6 text-customGray1f1">{{ title }}</p>
              <div class="relative">
                <img
                  v-if="content !== ''"
                  src="../../../../assets/images/inc/icon_exclamation%20mark.png"
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
              <img src="../../../../assets/images/inc/modal_close.svg" class="cursor-pointer" alt="닫기" />
            </div>
          </div>
          <!-- E : HEAD -->

          <component
            :is="currentComp"
            v-if="currentComp"
            ref="dynamicComp"
            :key="currentKey"
            :modal-props="modalProps"
            @close="close"
            @fn-save-load="fnSaveLoad"
          />

          <slot name="content"></slot>

          <!-- S : FOOTER -->
          <div
            v-if="btnClose || btnSave || hasButtonSlot"
            class="flex justify-between px-6 py-4 pb-5"
          >
            <div class=""></div>
            <div class="flex flex-row gap-2">
              <WorkButtonComponent v-if="btnClose" color="btn_outLine_default_md" @click="close">
                닫기
              </WorkButtonComponent>
              <WorkButtonComponent v-if="btnSave" color="btn_insert_md" @click="triggerSave">
                {{ btnSaveText }}
              </WorkButtonComponent>
              <slot name="button"></slot>
            </div>
          </div>
          <!-- E : FOOTER -->
        </div>
        <!-- E : INNER -->
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import WorkButtonComponent from '@/modules/_common/components/forms/p-button.vue';
import { computed, onMounted, ref, useSlots, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  modalProps: {
    type: [String, Number, Object, Array, Boolean]
  },
  id: Number,
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
  currentComp: {
    type: Object,
    default: null
  },
  btnClose: {
    type: Boolean,
    default: false
  },
  btnSave: {
    type: Boolean,
    default: false
  },
  btnSaveText: {
    type: String,
    default: '저장'
  },
  zIndex: {
    type: Number,
    default: 50
  }
});
const slots: any = useSlots();
const hasButtonSlot = computed(() => {
  return !!slots.button; // 슬롯이 존재하는지 확인
});

const isOpenModalCheck = ref(false);
const currentKey = ref(true); // 컴포넌트를 강제로 새로고침할 키
onMounted(() => {
  currentKey.value = !currentKey.value;
});

const emit = defineEmits(['update:modelValue', 'fnSaveLoad']);

const close = () => {
  emit('update:modelValue', false);
};

const fnSaveLoad = (emitData: any) => {
  if (emitData) {
    emit('fnSaveLoad', emitData);
  } else {
    emit('fnSaveLoad');
  }
};

const message = ref<boolean>(false);
const messageToggle = () => {
  message.value = !message.value;
};
const dynamicComp = ref();
const triggerSave = () => {
  if (dynamicComp.value && dynamicComp.value?.fnSave) {
    dynamicComp.value?.fnSave();
  }
  // } else {
  //   //message.value = '호출 컴포넌트에 저장 버튼 함수를 추가해주세요.';
  // }

  // slot 사용했을때 저장버튼 처리
  if (!props.currentComp) {
    emit('fnSaveLoad');
  }
};

watch(
  () => props.modelValue,
  (value: boolean) => {
    isOpenModalCheck.value = value;
    if (value) {
      message.value = false;
      currentKey.value = !currentKey.value;
    }
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss"></style>
