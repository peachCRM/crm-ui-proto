<template>
  <p-file-upload
    ref="uploadLocalRef"
    v-model="files"
    :storage-type="storageType"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :accept="accept"
    :allowed-extensions="allowedExtensions"
    :allowed-mime-types="allowedMimeTypes"
    :upload-handler="uploadHandler"
    :down-url-resolver="downUrlResolver"
    :is-editor-add="isEditorAdd"
    :is-private="isPrivate"
    :max-concurrent-uploads="maxConcurrentUploads"
    @update:modelValue="handleUpdate"
    @file-delete="handleFileDelete"
    @editor-add="handleEditorAdd"
  >
    <template #actions="{ file }">
      <slot name="actions" :file="file" />
    </template>
  </p-file-upload>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PFileUpload from '@/modules/_common/components/file/p-file-upload.vue';
import { useTestDataStore } from '@/modules/test-data/store/test-data.store';
import type { FileInfo } from '@/modules/_common/type/file.type.ts';
import type { TestDataFile } from '@/modules/test-data/type/test-data.type.ts';

defineComponent({
  name: 'PTestDataFileUpload'
});

const store = useTestDataStore();
const uploadLocalRef = ref<InstanceType<typeof PFileUpload> | null>(null);

const props = defineProps({
  fileList: {
    type: Array as () => TestDataFile[],
    default: () => []
  },
  storageType: {
    type: String as () => 'LOCAL' | 'S3',
    default: 'LOCAL' // 기본값을 LOCAL로 설정
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
    default: '' // 부모에서 지정하도록 변경
  },
  allowedExtensions: {
    type: Array as () => string[],
    default: () => ['xlsx', 'xls', 'csv', 'pdf', 'jpg', 'png', 'gif', 'jpeg', 'txt', 'zip']
  },
  allowedMimeTypes: {
    type: Array as () => string[],
    default: () => [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ]
  },
  isEditorAdd: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxConcurrentUploads: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits<{
  (e: 'setFiles', files: TestDataFile[]): void;
  (e: 'fileDelete', downUrl: string): void;
  (e: 'editorAdd', html: string): void;
}>();

/**
 * TestDataFile을 FileInfo로 변환
 * 디버깅 시 각 속성의 매핑을 명확히 확인할 수 있도록 모든 속성을 명시적으로 설정
 */
const toFileInfo = (testDataFile: TestDataFile): FileInfo => {
  return {
    fileUuid: testDataFile.fileUuid, // 파일 고유 ID
    fileName: testDataFile.fileName, // 파일명
    fileSize: testDataFile.fileSize, // 파일 크기(bytes)
    fileType: testDataFile.fileType, // MIME 타입
    storageType: testDataFile.storageType as 'LOCAL' | 'S3', // 저장소 타입
    fileAuth: testDataFile.fileAuth as 'PUBLIC' | 'PRIVATE', // 접근 권한
    filePath: testDataFile.filePath // 저장 경로
  };
};

defineExpose({
  //uploadFiles: uploadFilesFromParent as (files: File[] | File) => void
  uploadFiles: (files: File[] | File) => {
    if (uploadLocalRef.value) {
      (uploadLocalRef.value as any).uploadFiles?.(files);
    }
  },
  // 파일 선택 대화상자 열기
  triggerFileSelect: () => {
    if (uploadLocalRef.value) {
      // p-file-upload의 내부 input을 클릭하여 파일 선택 대화상자 열기
      const fileInput = (uploadLocalRef.value as any).$refs?.fileInputRef;
      if (fileInput) {
        fileInput.click();
      }
    }
  }
});

/**
 * FileInfo를 ElectronicApprovalFile로 변환
 * _common 컴포넌트에서 받은 데이터를 test-data 모듈 형식으로 변환
 */
const toTestDataFile = (fileInfo: FileInfo): TestDataFile => {
  return {
    // FileInfo에서 제공되는 필드
    fileUuid: fileInfo.fileUuid, // 파일 UUID
    fileName: fileInfo.fileName, // 파일명
    fileSize: fileInfo.fileSize, // 파일 크기
    fileType: fileInfo.fileType, // 파일 타입
    storageType: fileInfo.storageType, // 저장소 타입
    fileAuth: fileInfo.fileAuth, // 접근 권한
    filePath: fileInfo.filePath, // 파일 경로

    // ElectronicApprovalFile 전용 필드 (기본값)
    fileFolder: '', // 파일 폴더 (FileInfo에 없으므로 기본값)
    fileSeq: 0, // 파일 순번
    downloadCnt: 0, // 다운로드 횟수
    orderValue: 0, // 정렬 값
    parentCode: null, // 부모 코드
    insertSeq: 0, // 등록자
    insertDate: '', // 등록일
    updateSeq: 0, // 수정자
    updateDate: '' // 수정일
  };
};

// Store의 uploadFile 메서드를 래핑 (storageType에 따라 분기)
const uploadHandler = (file: File, progressCallback: (progress: number) => void) => {
  if (props.storageType === 'S3') {
    return store.uploadFileS3(props.isPrivate, file, progressCallback);
  } else {
    return store.uploadFileLocal(false, file, progressCallback);
  }
};

// 파일 다운로드 URL 생성 함수
const downUrlResolver = (file: FileInfo): string => {
  // FileInfo를 TestDataFile로 변환하여 store 메서드 호출
  const testDataFile = toTestDataFile(file);

  // getDownloadUrl은 S3 PRIVATE 파일에 대해 Error를 throw
  // 필요시 별도로 getS3PresignedUrl을 호출해야 함
  return store.getDownloadUrl(testDataFile);
};

// v-model 처리를 위한 computed
const files = computed({
  get: () => {
    // TestDataFile 배열을 FileInfo 배열로 변환
    return props.fileList.map(toFileInfo);
  },
  set: (val: FileInfo[]) => {
    // FileInfo 배열을 TestDataFile 배열로 변환하여 emit
    emit('setFiles', val.map(toTestDataFile));
  }
});

const handleUpdate = (updatedFiles: FileInfo[]) => {
  // FileInfo 배열을 TestDataFile 배열로 변환하여 emit
  const testDataFiles = updatedFiles.map(toTestDataFile);
  emit('setFiles', testDataFiles);
};

const handleFileDelete = (downUrl: string) => {
  emit('fileDelete', downUrl);
};

const handleEditorAdd = (html: string) => {
  emit('editorAdd', html);
};
</script>
