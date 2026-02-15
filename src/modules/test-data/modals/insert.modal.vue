<template>
  <div v-if="isOpen" class="fixed inset-0 z-[30] bg-black/50 dark:bg-black/80" @click.stop></div>
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[900px]', // 원하는 넓이 지정
      footer: 'justify-end'
    }"
    title="등록"
    :modal="false"
  >
    <template #body>
      <u-form
        ref="formRef"
        :schema="CrudInsertValidator"
        :state="detailData"
        @submit="register"
        @error="handleFormError"
      >
        <div class="space-y-4 border-t">
          <p-form-row label="제목" is-required>
            <u-form-field name="subject" class="w-full">
              <p-input-box
                v-model="detailData.subject"
                name="subject"
                placeholder="제목을 입력하세요."
              />
            </u-form-field>
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="날짜" is-required>
            <u-form-field name="insertDate" class="w-full">
              <p-date-picker
                name="insertDate"
                id="insertDate"
                v-model="detailData.insertDate"
                class="w-30"
                placeholder="insertDate를 입력하세요."
              />
            </u-form-field>
          </p-form-row>
          <p-form-row label="공지여부" is-required>
            <u-form-field name="value" class="w-full">
              <u-radio-group
                v-model="detailData.value"
                orientation="horizontal"
                :items="valueItems"
              />
            </u-form-field>
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="금액">
            <u-form-field name="bigint" class="w-full">
              <p-input-box v-model="detailData.bigint" name="bigint" is-comma align="right" />
            </u-form-field>
          </p-form-row>
          <p-form-row label="사용여부">
            <u-form-field name="isUse" class="w-full">
              <p-nuxt-select v-model="detailData.isUse" class="w-22" :options="isUseItems" />
            </u-form-field>
          </p-form-row>
        </div>

        <p-form-row label="이미지" is-required>
          <u-form-field name="imageList" class="w-full">
            <p-test-data-file-upload
              :file-list="detailData.imageList"
              :max-files="1"
              :max-file-size="50 * 1024 * 1024"
              accept="image/*"
              :allowed-extensions="['jpg', 'jpeg', 'png', 'gif', 'webp']"
              :allowed-mime-types="['image/jpeg', 'image/png', 'image/gif', 'image/webp']"
              @set-files="setImages"
            />
          </u-form-field>
        </p-form-row>

        <div class="mt-4 space-y-4">
          <u-form-field name="contents">
            <div class="mb-5 w-full">
              <p-test-data-editor-tinymce
                v-model="detailData.contents"
                @set-files="setFiles"
                :file-list="detailData.fileList"
                is-file
              />
            </div>
          </u-form-field>
          {{ detailData }}
        </div>

        <u-button type="submit" class="hidden">저장</u-button>
      </u-form>
    </template>

    <template #footer>
      <u-button color="neutral" variant="outline" @click="close">닫기</u-button>
      <u-button class="flex justify-center" @click="formSubmit">저장</u-button>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import PTestDataFileUpload from '../components/file/p-test-data-file-upload.vue';
import { CrudInsertValidator } from './_crud.validator.ts';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PTestDataEditorTinymce from '../components/tinymce/p-test-data-editor-tinymce.vue';
import type { TestDataFile } from '@/modules/test-data/type/test-data.type.ts';

// Props 정의
interface Props {
  open: boolean;
}
const props = defineProps<Props>();
const isUseItems = ref([
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' }
]);

const valueItems = ref([
  { label: '공지', value: 'Y' },
  { label: '일반', value: 'N' }
]);

const testDataStore = useTestDataStore();
const { detailData } = storeToRefs(testDataStore);
const formRef = ref();

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

const emit = defineEmits(['update:open', 'close', 'insert-ok']);

//파일 추가
const setFiles = (files: TestDataFile[]) => {
  detailData.value.fileList = files;
};

//이미지 추가
const setImages = (files: TestDataFile[]) => {
  detailData.value.imageList = files;
};

// 폼 에러 핸들링
const handleFormError = (event: FormErrorEvent) => {
  FormService.onError(event);
};

const formSubmit = () => {
  if (formRef.value) {
    formRef.value.submit();
  }
};

const register = async () => {
  await FormService.loading(async () => {
    // 파일 리스트를 UUID 배열로 변환
    const { fileList, imageList, ...rest } = detailData.value;
    const insertData = {
      ...rest,
      fileUuidList: fileList?.map(f => f.fileUuid).filter(Boolean) ?? [],
      imageUuidList: imageList?.map(f => f.fileUuid).filter(Boolean) ?? []
    };
    const result = await testDataStore.insert(insertData);
    if (result.isSuccess) {
      useToast().add({
        title: '등록 완료',
        description: '등록이 완료되었습니다.',
        color: 'success'
      });
      emit('insert-ok');
      close();
    }
  });
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const initOnCreated = () => {
  // 초기화 로직 설정
  testDataStore.detailDataInit();
};

// 모달이 열릴 때 초기화
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      initOnCreated();
    }
  }
);

onUnmounted(() => {
  // 컴포넌트 언마운트 시 초기화
  testDataStore.detailDataInit();
});
</script>
