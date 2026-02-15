<template>
  <input
    :id="idValue"
    ref="fileInputRef"
    type="file"
    :name="name"
    class="hidden"
    multiple
    :accept="acceptAttribute || accept"
    @click="resetInput"
    @change="handleFileUpload"
  />
  <div class="w-full">
    <div class="flex-grow flex gap-4 flex-col w-full sm:w-auto">
      <div class="flex gap-3 items-center">
        <span
          class="px-5 py-[5px] text-size14 text-custom_blue bg-white dark:bg-[#111111] border rounded-[80px] cursor-pointer"
          :class="{
            'border-gray-300 dark:border-gray-700': storageType === 'LOCAL',
            'border-custom_blue': storageType === 'S3'
          }"
          @click="triggerUpload"
          >파일찾기</span
        >
        <div>업로드 최대용량 {{ Utils.formatBytes(maxFileSize) }}</div>
      </div>
      <div class="flex flex-wrap flex-row md:gap-x-[2%] lg:gap-x-[1.5%] gap-y-3">
        <!-- S : ITEM -->
        <div
          v-for="file in sortedPickedFiles"
          :key="file.uploadId"
          class="flex items-center gap-2.5 relative w-full px-3 md:px-5 py-3 md:py-3.5 bg-[#FAFBFC] dark:bg-[#111111] border border-gray-300 dark:border-gray-700 rounded-[10px] box-sizing:content-box overflow-hidden cursor-move transition-all duration-200"
          :class="[
            itemClass,
            {
              'opacity-50 scale-95': draggedFile === file.uploadId,
              'border-blue-400 bg-blue-50': dragOverFile === file.uploadId
            }
          ]"
          draggable="true"
          @dragstart="handleDragStart(file.uploadId, $event)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver(file.uploadId, $event)"
          @dragleave="handleDragLeave"
          @drop="handleDrop(file.uploadId, $event)"
        >
          <!-- 프로그레스 -->
          <div class="absolute h-1 left-0 right-0 top-0">
            <div
              class="h-1 transition-all duration-300"
              :class="{
                'bg-[#087EFA]': file.uploadStatus !== 'error',
                'bg-red-500': file.uploadStatus === 'error'
              }"
              :style="{ width: file.progressVal + '%' }"
            ></div>
          </div>

          <div
            v-if="
              file.fileType.startsWith('image/') &&
              file.uploadStatus === 'completed' &&
              file.downUrl
            "
            class="flex-shrink-0 w-[54px] h-[54px] bg-white dark:bg-[#111111] rounded-[6px]"
          >
            <img
              class="rounded-[6px]"
              :src="file.downUrl"
              style="width: 50px; height: 50px; object-fit: contain"
            />
          </div>

          <div
            class="flex-grow md:flex-grow text-custom_size_14 text-black dark:text-white leading-6 overflow-hidden text-ellipsis lg:whitespace-nowrap"
          >
            <a v-if="file.downUrl" :href="file.downUrl" target="_blank"
              ><strong>{{ file.fileName }}</strong></a
            >
            <strong v-else>{{ file.fileName }}</strong>
            <span class="block text-custom_black_777 leading-6 text-size14">{{
              Utils.formatBytes(file.fileSize)
            }}</span>
            <!-- 업로드 상태 표시 -->
            <span v-if="file.uploadStatus === 'uploading'" class="block text-blue-500 text-xs mt-1">
              업로드 중... {{ file.progressVal }}%
            </span>
            <span
              v-if="file.uploadStatus === 'error' && file.errorMessage"
              class="block text-red-500 text-xs mt-1"
            >
              {{ file.errorMessage }}
            </span>
          </div>

          <div class="flex-shrink-0 flex flex-col gap-1 w-[40px]">
            <!-- 커스텀 액션 슬롯 -->
            <slot name="actions" :file="file" />

            <u-button
              v-if="isEditorAdd && file.uploadStatus === 'completed'"
              color="neutral"
              variant="outline"
              size="xs"
              @click="editorAdd(file)"
            >
              삽입
            </u-button>
            <!-- 재시도 버튼 -->
            <u-button
              v-if="file.uploadStatus === 'error'"
              color="warning"
              variant="outline"
              size="xs"
              @click="retryUpload(file.uploadId)"
            >
              재시도
            </u-button>
            <u-button
              color="neutral"
              variant="outline"
              size="xs"
              :disabled="file.uploadStatus === 'uploading'"
              @click="fileDelete(file.uploadId)"
            >
              삭제
            </u-button>
          </div>
        </div>
        <!-- E : ITEM -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref, watch, nextTick, type PropType } from 'vue';
import { Utils } from '@/utils/utils.ts';
import type {
  FileInfo,
  UploadFile,
  UploadHandler,
  DownUrlResolver
} from '@/modules/_common/type/file.type';

defineComponent({
  name: 'PFileUpload'
});

const fileInputRef = ref<HTMLInputElement | null>(null);

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Array as () => FileInfo[],
    default: () => []
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
    default: '' // 예: ".jpg,.png,.pdf"
  },
  itemClass: {
    type: String,
    default: 'md:w-[49%] lg:w-[32.33333%]'
  },
  uploadHandler: {
    type: Function as PropType<UploadHandler>,
    required: true
  },
  downUrlResolver: {
    type: Function as PropType<DownUrlResolver>,
    required: true
  },
  isEditorAdd: {
    type: Boolean,
    default: false
  },
  maxConcurrentUploads: {
    type: Number,
    default: 3
  },
  // 통합을 위한 새로운 props
  storageType: {
    type: String as () => 'LOCAL' | 'S3',
    default: 'LOCAL'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  // 파일 타입 필터링을 위한 props
  allowedExtensions: {
    type: Array as () => string[],
    default: () => [] // 빈 배열이면 모든 확장자 허용
  },
  allowedMimeTypes: {
    type: Array as () => string[],
    default: () => [] // 빈 배열이면 모든 MIME type 허용
  }
});

const idValue = computed(() => {
  if (!props.id || props.id === '') return `input-${Math.random().toString(36).substring(2, 9)}`;
  return props.id;
});

const triggerUpload = () => {
  fileInputRef.value?.click();
};

const emits = defineEmits<{
  (e: 'update:modelValue', files: FileInfo[]): void;
  (e: 'fileDelete', downUrl: string): void;
  (e: 'editorAdd', html: string): void;
}>();

const pickedFiles = ref<UploadFile[]>([]);
const uploadQueue = ref<string[]>([]);
const activeUploads = ref<Set<string>>(new Set());
const orderCounter = ref(0);

// 드래그 앤 드롭 상태 변수
const draggedFile = ref<string | null>(null);
const dragOverFile = ref<string | null>(null);

// 파일 목록을 선택 순서대로 정렬
const sortedPickedFiles = computed(() => {
  return [...pickedFiles.value].sort((a, b) => a.orderIndex - b.orderIndex);
});

// 고유 ID 생성 함수
const generateUploadId = (): string => {
  return `upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// accept 속성 자동 생성
const acceptAttribute = computed(() => {
  if (props.accept) return props.accept;

  const extensions = props.allowedExtensions.map((ext) => `.${ext}`);
  const mimeTypes = props.allowedMimeTypes;

  return [...extensions, ...mimeTypes].join(',');
});

// 파일 검증 함수
const validateFile = (file: File): boolean => {
  // 1. 파일 크기 검증
  if (file.size > props.maxFileSize) {
    alert(`파일 크기 초과: ${file.name}\n최대: ${Utils.formatBytes(props.maxFileSize)}`);
    return false;
  }

  // 2. 확장자 검증
  if (props.allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !props.allowedExtensions.includes(ext)) {
      alert(
        `허용되지 않은 확장자: .${ext}\n허용: ${props.allowedExtensions.map((e) => `.${e}`).join(', ')}`
      );
      return false;
    }
  }

  // 3. MIME type 검증
  // HWP 등 일부 파일은 브라우저에서 MIME 타입을 빈 문자열 또는 application/octet-stream으로 인식
  // 확장자가 허용 목록에 있으면 MIME 타입 검증을 건너뜀
  if (props.allowedMimeTypes.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isExtensionAllowed = ext && props.allowedExtensions.includes(ext);
    const isMimeTypeAllowed = props.allowedMimeTypes.includes(file.type);
    const isOctetStreamOrEmpty = file.type === '' || file.type === 'application/octet-stream';

    // 확장자가 허용되고, MIME 타입이 비어있거나 octet-stream인 경우 통과
    if (!isMimeTypeAllowed && !(isExtensionAllowed && isOctetStreamOrEmpty)) {
      alert(`허용되지 않은 파일 형식: ${file.type || '(알 수 없음)'}\n허용: ${props.allowedMimeTypes.join(', ')}`);
      return false;
    }
  }

  return true;
};

// 파일 상태 업데이트 함수
const updateFileStatus = (uploadId: string, updates: Partial<UploadFile>) => {
  pickedFiles.value = pickedFiles.value.map((file: UploadFile) =>
    file.uploadId === uploadId ? { ...file, ...updates } : file
  );
};

// 파일 찾기 함수
const findFileByUploadId = (uploadId: string): UploadFile | undefined => {
  return pickedFiles.value.find((file: UploadFile) => file.uploadId === uploadId);
};

// 부모에서 파일 객체들을 직접 전달받는 함수
const uploadFilesFromParent = (files: File[] | File) => {
  const fileArray = Array.isArray(files) ? files : [files];
  processFiles(fileArray);
};

const processFiles = (files: File[]) => {
  // maxFiles가 1이고 이미 파일이 있는 경우, 기존 파일을 화면에서만 제거
  if (props.maxFiles === 1 && props.modelValue.length > 0) {
    // 기존 파일 제거 (화면에서만)
    pickedFiles.value = [];
    uploadQueue.value = [];
    activeUploads.value.clear();
  } else if (props.modelValue.length + files.length > props.maxFiles) {
    alert(`최대 ${props.maxFiles}개의 파일만 업로드 가능합니다.`);
    return;
  }

  const newFiles: UploadFile[] = [];

  for (const file of files) {
    // 파일 검증
    if (!validateFile(file)) {
      continue;
    }

    const uploadId = generateUploadId();
    const upInfo: UploadFile = {
      uploadId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUuid: '',
      storageType: props.storageType,
      fileAuth: props.storageType === 'S3' && props.isPrivate ? 'PRIVATE' : 'PUBLIC',
      filePath: '',
      fileObj: file,
      progressVal: 0,
      downUrl: '',
      uploadStatus: 'pending',
      orderIndex: orderCounter.value++,
      isEditorAdd: props.isEditorAdd
    };
    newFiles.push(upInfo);
    uploadQueue.value.push(uploadId);
  }

  pickedFiles.value = [...pickedFiles.value, ...newFiles];
  processUploadQueue();
};

const handleFileUpload = () => {
  const inputElement = fileInputRef.value;
  if (!inputElement?.files) return;

  const files = inputElement.files;

  // maxFiles가 1이고 이미 파일이 있는 경우, 기존 파일을 화면에서만 제거
  if (props.maxFiles === 1 && props.modelValue.length > 0) {
    // 기존 파일 제거 (화면에서만)
    pickedFiles.value = [];
    uploadQueue.value = [];
    activeUploads.value.clear();
  } else if (props.modelValue.length + files.length > props.maxFiles) {
    alert(`최대 ${props.maxFiles}개의 파일만 업로드 가능합니다.`);
    return;
  }

  const newFiles: UploadFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // 파일 검증
    if (!validateFile(file)) {
      continue;
    }

    const uploadId = generateUploadId();
    const upInfo: UploadFile = {
      uploadId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUuid: '',
      storageType: props.storageType,
      fileAuth: props.storageType === 'S3' && props.isPrivate ? 'PRIVATE' : 'PUBLIC',
      filePath: '',
      fileObj: file,
      progressVal: 0,
      downUrl: '',
      uploadStatus: 'pending',
      orderIndex: orderCounter.value++,
      isEditorAdd: false
    };

    newFiles.push(upInfo);
    uploadQueue.value.push(uploadId);
  }

  pickedFiles.value = [...pickedFiles.value, ...newFiles];
  processUploadQueue();
};

// 업로드 큐 처리 함수
const processUploadQueue = () => {
  while (uploadQueue.value.length > 0 && activeUploads.value.size < props.maxConcurrentUploads) {
    const uploadId = uploadQueue.value.shift();
    if (uploadId) {
      activeUploads.value.add(uploadId);
      uploadSingleFile(uploadId).finally(() => {
        activeUploads.value.delete(uploadId);
        if (uploadQueue.value.length > 0) {
          processUploadQueue();
        }
      });
    }
  }
};

// 단일 파일 업로드 함수
const uploadSingleFile = async (uploadId: string) => {
  const fileInfo = findFileByUploadId(uploadId);
  if (!fileInfo) return;

  const file = fileInfo.fileObj;

  try {
    updateFileStatus(uploadId, { uploadStatus: 'uploading' });

    // props로 전달받은 uploadHandler 사용
    const uploadInfo = await props.uploadHandler(file, (uploadPercent: number) => {
      updateFileStatus(uploadId, { progressVal: Number(uploadPercent.toFixed(0)) });
    });

    if (uploadInfo && uploadInfo.fileUuid) {
      // storageType에 따라 다르게 처리
      const downUrl = props.downUrlResolver(uploadInfo as FileInfo);

      updateFileStatus(uploadId, {
        fileUuid: uploadInfo.fileUuid,
        storageType: uploadInfo.storageType,
        fileAuth: uploadInfo.fileAuth,
        filePath: uploadInfo.filePath,
        fileName: uploadInfo.fileName,
        fileSize: uploadInfo.fileSize,
        fileType: uploadInfo.fileType,
        downUrl,
        uploadStatus: 'completed',
        progressVal: 100
      });

      if (fileInputRef.value) fileInputRef.value.value = '';

      // 에디터 자동 추가
      const completedFile = findFileByUploadId(uploadId);
      if (completedFile && completedFile.isEditorAdd) {
        editorAdd(completedFile);
      }

      nextTick(() => {
        emits('update:modelValue', convertToFileInfo(pickedFiles.value));
      });
    }
  } catch (error) {
    updateFileStatus(uploadId, {
      uploadStatus: 'error',
      errorMessage: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.',
      progressVal: 0
    });
  }
};

// 재시도 함수
const retryUpload = (uploadId: string) => {
  const fileInfo = findFileByUploadId(uploadId);
  if (!fileInfo) return;

  updateFileStatus(uploadId, {
    uploadStatus: 'pending',
    progressVal: 0,
    errorMessage: undefined
  });

  uploadQueue.value.push(uploadId);
  processUploadQueue();
};

const resetInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = '';
};

const editorAdd = (file: UploadFile) => {
  let html = '';
  if (file.fileType.startsWith('image/')) {
    html = `<img src="${file.downUrl}" />`;
  } else {
    html = `<a href="${file.downUrl}">${file.fileName}</a>`;
  }
  emits('editorAdd', html);
};

const fileDelete = (uploadId: string) => {
  const fileToDelete = findFileByUploadId(uploadId);
  if (fileToDelete && fileToDelete.downUrl) {
    emits('fileDelete', fileToDelete.downUrl);
  }

  if (activeUploads.value.has(uploadId)) {
    activeUploads.value.delete(uploadId);
  }
  uploadQueue.value = uploadQueue.value.filter((id: string) => id !== uploadId);

  pickedFiles.value = pickedFiles.value.filter((file: UploadFile) => file.uploadId !== uploadId);

  emits('update:modelValue', convertToFileInfo(pickedFiles.value));
};

// UploadFile 배열을 FileInfo 배열로 변환
const convertToFileInfo = (uploadFiles: UploadFile[]): FileInfo[] => {
  return uploadFiles
    .filter((file: UploadFile) => file.uploadStatus === 'completed')
    .map(
      (item: UploadFile): FileInfo => ({
        fileUuid: item.fileUuid,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        storageType: item.storageType,
        fileAuth: item.fileAuth,
        filePath: item.filePath
      })
    );
};

// 드래그 앤 드롭 핸들러
const handleDragStart = (uploadId: string, event: DragEvent) => {
  draggedFile.value = uploadId;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', uploadId);
  }
};

const handleDragEnd = () => {
  draggedFile.value = null;
  dragOverFile.value = null;
};

const handleDragOver = (uploadId: string, event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }

  if (draggedFile.value && draggedFile.value !== uploadId) {
    dragOverFile.value = uploadId;
  }
};

const handleDragLeave = () => {
  dragOverFile.value = null;
};

const handleDrop = (targetUploadId: string, event: DragEvent) => {
  event.preventDefault();

  const draggedUploadId = draggedFile.value;
  if (!draggedUploadId || draggedUploadId === targetUploadId) {
    handleDragEnd();
    return;
  }

  const draggedIndex = pickedFiles.value.findIndex(
    (file: UploadFile) => file.uploadId === draggedUploadId
  );
  const targetIndex = pickedFiles.value.findIndex(
    (file: UploadFile) => file.uploadId === targetUploadId
  );

  if (draggedIndex === -1 || targetIndex === -1) {
    handleDragEnd();
    return;
  }

  reorderFiles(draggedIndex, targetIndex);
  handleDragEnd();
};

// 파일 순서 재정렬
const reorderFiles = (fromIndex: number, toIndex: number) => {
  const newFiles = [...pickedFiles.value];
  const [movedFile] = newFiles.splice(fromIndex, 1);
  newFiles.splice(toIndex, 0, movedFile);

  newFiles.forEach((file: UploadFile, index: number) => {
    file.orderIndex = index;
  });

  pickedFiles.value = newFiles;

  nextTick(() => {
    emits('update:modelValue', convertToFileInfo(pickedFiles.value));
  });
};

// 부모창에서 파일 업로드
defineExpose({
  uploadFiles: uploadFilesFromParent as (files: File[] | File) => void
});

// modelValue 변경 감지
watch(
  () => props.modelValue,
  async (files: FileInfo[]) => {
    const existingFiles = pickedFiles.value.filter(
      (file: UploadFile) =>
        file.uploadStatus === 'uploading' ||
        file.uploadStatus === 'pending' ||
        file.uploadStatus === 'error'
    );

    const newCompletedFiles = await Promise.all(
      files.map(async (file: FileInfo) => {
        const existingFile = pickedFiles.value.find(
          (existing: UploadFile) => existing.fileUuid === file.fileUuid && existing.fileUuid !== ''
        );

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
            uploadStatus: 'completed' as const,
            progressVal: 100
          };
        } else {
          // storageType에 따라 다르게 처리
          const downUrl = props.downUrlResolver(file);

          return {
            ...file,
            uploadId: generateUploadId(),
            fileObj: new File([], file.fileName),
            progressVal: 100,
            uploadStatus: 'completed' as const,
            downUrl,
            orderIndex: orderCounter.value++,
            isEditorAdd: false
          };
        }
      })
    );

    const allFiles = [...existingFiles, ...newCompletedFiles];
    pickedFiles.value = allFiles.sort((a, b) => a.orderIndex - b.orderIndex);
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
