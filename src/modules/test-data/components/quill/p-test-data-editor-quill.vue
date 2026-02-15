<template>
  <p-editor-quill
    ref="editorRef"
    v-model="content"
    :is-file="isFile"
    :custom-class="customClass"
    :max-file-size="maxFileSize"
    :allowed-file-types="allowedFileTypes"
    @update:modelValue="handleUpdate"
    @upload-file="handleUploadFile"
  >
    <template v-if="isFile" #file-upload="{ insertFile }">
      <p-test-data-file-upload
        ref="uploadRef"
        :file-list="fileList"
        :max-files="maxFiles"
        :max-file-size="maxFileSize"
        :accept="accept"
        is-editor-add
        @upload-file="handleUploadFile"
        @set-files="setFiles"
        @file-delete="fileDelete"
        @editor-add="insertFile"
      />
    </template>
  </p-editor-quill>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue';
import PEditorQuill from '@/modules/_common/components/quill/p-editor-quill.vue';
import PTestDataFileUpload from '../file/p-test-data-file-upload.vue';

import type { TestDataFile } from '@/modules/test-data/type/test-data.type.ts';

defineComponent({
  name: 'PTestDataEditorQuill'
});

const editorRef = ref<InstanceType<typeof PEditorQuill> | null>(null);
const uploadRef = ref<InstanceType<typeof PTestDataFileUpload> | null>(null);

const props = defineProps({
  isFile: {
    type: Boolean,
    default: false
  },
  fileList: {
    type: Array as () => TestDataFile[],
    default: () => []
  },
  customClass: {
    type: String,
    default: 'h-[450px]'
  },
  modelValue: {
    type: String,
    default: '<p></p>'
  },
  maxFiles: {
    type: Number,
    default: 5
  },
  maxFileSize: {
    type: Number,
    default: 100 * 1024 * 1024 // 100MB
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx'
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'set-files', files: TestDataFile[]): void;
}>();

// 허용 파일 타입
const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// v-model 처리
const content = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const handleUpdate = (value: string) => {
  emit('update:modelValue', value);
};

// 파일 업로드 처리
const handleUploadFile = (files: File[]) => {
  // 부모 컴포넌트에서 uploadRef를 통해 파일 업로드
  if (uploadRef.value) {
    (uploadRef.value as any).uploadFiles?.(files);
  }
};

// 파일 목록 설정
const setFiles = (files: TestDataFile[]) => {
  emit('set-files', files);
};

// 파일 삭제 처리
const fileDelete = (downUrl: string) => {
  // 에디터에서 링크 및 이미지 제거
  if (editorRef.value) {
    editorRef.value.removeLinkByHref(downUrl);
    editorRef.value.removeImageBySrc(downUrl);
  }
};

// 외부 노출 메서드
defineExpose({
  addHtml: (html: string, isLast?: boolean) => {
    editorRef.value?.addHtml(html, isLast);
  },
  removeLinkByHref: (href: string) => {
    editorRef.value?.removeLinkByHref(href);
  },
  removeImageBySrc: (src: string) => {
    editorRef.value?.removeImageBySrc(src);
  }
});
</script>
