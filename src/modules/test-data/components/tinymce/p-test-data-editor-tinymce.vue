<template>
  <tiny-editor
    ref="editorRef"
    v-model="content"
    :is-file="isFile"
    :height="height"
    :max-file-size="maxFileSize"
    :allowed-file-types="allowedFileTypes"
    @update:modelValue="handleUpdate"
    @image-button-click="handleImageButtonClick"
    @upload-file="handleUploadFile"
  >
    <template v-if="isFile" #file-upload="{ insertFile }">
      <div class="mt-4">
        <p-test-data-file-upload
          ref="uploadRef"
          :file-list="fileList"
          :max-files="maxFiles"
          :max-file-size="maxFileSize"
          :accept="accept"
          is-editor-add
          @set-files="setFiles"
          @file-delete="fileDelete"
          @editor-add="insertFile"
        />
      </div>
    </template>
  </tiny-editor>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue';
import TinyEditor from '@/modules/_common/components/tinymce/tiny-editor.vue';
import PTestDataFileUpload from '../file/p-test-data-file-upload.vue';

import type { TestDataFile } from '@/modules/test-data/type/test-data.type.ts';

defineComponent({
  name: 'PTestDataEditorTinymce'
});

const editorRef = ref<InstanceType<typeof TinyEditor> | null>(null);
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
  height: {
    type: Number,
    default: 360
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

// 이미지 버튼 클릭 처리
const handleImageButtonClick = (_callback: (data: any) => void) => {
  // 파일 업로드 컴포넌트의 파일 선택 트리거
  if (uploadRef.value) {
    (uploadRef.value as any).triggerFileSelect?.();
  }
};

// 파일 업로드 처리 (드래그앤드롭/붙여넣기)
const handleUploadFile = (files: File[]) => {
  console.log('파일 업로드 처리:', files.length, '개');

  // 기존 PDocumentsFileUpload 컴포넌트의 uploadFiles 메서드 활용
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
  },
  insertImage: (data: any) => {
    editorRef.value?.insertImage(data);
  },
  insertFile: (data: any) => {
    editorRef.value?.insertFile(data);
  },
  getContent: () => {
    return editorRef.value?.getContent?.() || '';
  }
});
</script>
