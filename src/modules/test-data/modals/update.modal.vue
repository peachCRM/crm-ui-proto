<template>
  <div v-if="isOpen" class="fixed inset-0 z-[30] bg-black/50 dark:bg-black/80" @click.stop></div>
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :ui="{
      content: 'min-w-sm max-w-[900px]', // 원하는 넓이 지정
      footer: 'flex justify-end gap-2'
    }"
    title="수정"
    :modal="false"
  >
    <template #body>
      <u-form
        ref="formRef"
        :schema="CrudUpdateValidator"
        :state="updateData"
        @submit="register"
        @error="handleFormError"
      >
        <div class="space-y-4 border-t">
          <p-form-row label="제목" is-required>
            <u-form-field name="subject" class="w-full">
              <p-input-box
                v-model="updateData.subject"
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
                v-model="updateData.insertDate"
                class="w-30"
                placeholder="insertDate를 입력하세요."
              />
            </u-form-field>
          </p-form-row>
          <p-form-row label="공지여부">
            <u-form-field name="value" class="w-full">
              <u-radio-group
                v-model="updateData.value"
                orientation="horizontal"
                :items="valueItems"
              />
            </u-form-field>
          </p-form-row>
        </div>
        <div class="flex">
          <p-form-row label="금액">
            <u-form-field name="bigint" class="w-full">
              <p-input-box v-model="updateData.bigint" name="bigint" is-comma align="right" />
            </u-form-field>
          </p-form-row>
          <p-form-row label="사용여부">
            <u-form-field name="isUse" class="w-full">
              <p-nuxt-select v-model="updateData.isUse" class="w-22" :options="isUseItems" />
            </u-form-field>
          </p-form-row>
        </div>

        <p-form-row label="이미지" is-required>
          <u-form-field name="imageList" class="w-full">
            <p-test-data-file-upload
              :file-list="updateData.imageList"
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
                v-model="updateData.contents"
                @set-files="setFiles"
                :file-list="updateData.fileList"
                is-file
              />
            </div>
          </u-form-field>
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
import PDatePicker from '@/modules/_common/components/date-picker/p-date-picker-work.vue';
import PTestDataFileUpload from '../components/file/p-test-data-file-upload.vue';
import PFormRow from '@/modules/_common/components/forms/p-form-row.vue';
import PInputBox from '@/modules/_common/components/forms/p-input-box.vue';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import PTestDataEditorTinymce from '../components/tinymce/p-test-data-editor-tinymce.vue';
import { FormService } from '@/modules/_common/services/form.service.ts';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { computed, onUnmounted, ref, watch } from 'vue';
import { CrudUpdateValidator } from './_crud.validator';
import type { TestDataFile } from '@/modules/test-data/type/test-data.type.ts';

// Props 정의
interface Props {
  testSeq: number;
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
const formRef = ref();

// 모달 열림/닫힘 상태 관리
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
});

// 수정용 로컬 데이터
const updateData = ref({
  subject: '',
  value: '',
  bigint: 0,
  contents: '',
  insertDate: '',
  isUse: 'Y',
  imageList: [] as TestDataFile[],
  fileList: [] as TestDataFile[]
});

const emit = defineEmits(['update:open', 'close', 'update-ok']);

//파일 추가
const setFiles = (files: TestDataFile[]) => {
  updateData.value.fileList = files;
};

//이미지 추가
const setImages = (files: TestDataFile[]) => {
  updateData.value.imageList = files;
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
    const { fileList, imageList, ...rest } = updateData.value;
    const updateDto = {
      ...rest,
      fileUuidList: fileList?.map(f => f.fileUuid).filter(Boolean) ?? [],
      imageUuidList: imageList?.map(f => f.fileUuid).filter(Boolean) ?? []
    };
    await testDataStore.update(props.testSeq, updateDto);
    useToast().add({
      title: '수정 완료',
      description: '수정이 완료되었습니다.',
      color: 'success'
    });
    emit('update-ok');
    close();
  });
};

const close = () => {
  isOpen.value = false;
  emit('close');
};

const getDetail = async () => {
  await FormService.loading(async () => {
    await testDataStore.detail(props.testSeq);
    // 데이터 로딩 후 updateData에 복사
    const data = testDataStore.detailData;
    if (data) {
      updateData.value = {
        subject: data.subject || '',
        value: data.value || '',
        bigint: data.bigint || 0,
        contents: data.contents || '',
        imageList: data.imageList || [],
        fileList: data.fileList || []
      };
    }
  });
};

// 모달이 열릴 때 데이터 로드
watch(
  () => props.open,
  (newValue) => {
    if (newValue) {
      getDetail();
    }
  }
);

onUnmounted(() => {
  console.log('update unmounted');
  testDataStore.detailDataInit();
});
</script>
