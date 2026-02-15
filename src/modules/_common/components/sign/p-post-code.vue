<template>
  <PModal v-model="isOpenInsert" :title="title" :box-width="boxWidth" :z-index="70">
    <template #content>
      <div class="flex flex-col gap-6 px-6 pb-3">
        <div class="flex h-[480px] flex-col gap-2">
          <div
            id="layer"
            ref="layer"
            style="
              position: fixed;
              overflow: hidden;
              z-index: 1;
              -webkit-overflow-scrolling: touch;
              width: 450px;
              height: 480px;
            "
          ></div>
        </div>
      </div>
    </template>
  </PModal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import PModal from '@/modules/_common/components/modal/p-modal.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'fnSaveLoad']);

const layer = ref<HTMLElement | null>(null);
const daumPostcode = () => {
  new (window as any).daum.Postcode({
    oncomplete: function (data: any) {
      let addr: String = data.jibunAddress; // 주소 변수
      // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      }

      emit('fnSaveLoad', { zipCode: data.zonecode, addr, data });
      isOpenInsert.value = false;
    },
    width: '100%',
    height: '100%',
    maxSuggestItems: 5
  }).embed(layer.value);
};

function loadResource(src: string, isScript: boolean): Promise<void> {
  return new Promise((resolve) => {
    const element = isScript
      ? Object.assign(document.createElement('script'), { src, type: 'text/javascript' })
      : Object.assign(document.createElement('link'), {
          href: src,
          rel: 'stylesheet',
          type: 'text/css'
        });

    element.onload = () => resolve();
    document.head.appendChild(element);
  });
}

onMounted(async () => {
  await loadResource(`//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`, true);

  daumPostcode();
});

/**
 * 모달창 열기 제어
 */
const isOpenInsert = ref(false); // 모달창 열기
const title = ref('주소검색');
const boxWidth = ref('500');

watch(
  () => props.modelValue,
  (value: boolean) => {
    isOpenInsert.value = value;
  },
  { immediate: true, deep: true }
);

watch(
  () => isOpenInsert,
  () => {
    if (!isOpenInsert.value) {
      emit('update:modelValue', false);
    }
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss"></style>
