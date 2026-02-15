<template>
  <u-modal class="max-w-[70vw] max-h-[80vh]" :dismissible="false">
    <template #header>
      <div class="w-full flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">엑셀 업로드</h3>
        <u-button
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="$emit('close')"
        />
      </div>
    </template>
    <template #body>
      <u-form
        ref="formRef"
        :schema="ExcelUploadValidator"
        :state="formState"
        @error="handleFormError"
        @submit="uploadData"
      >
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-3">
              <input
                ref="fileInput"
                type="file"
                @change="handleFileUpload"
                accept=".xlsx, .xls"
                class="hidden"
              />
              <u-button
                color="primary"
                variant="outline"
                icon="i-heroicons-document-arrow-up-20-solid"
                @click="triggerFileInput"
              >
                엑셀 파일 선택
              </u-button>
              <span v-if="selectedFileName" class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedFileName }}
              </span>
            </div>
            <div v-if="hasUploadStatus" class="flex items-center gap-2 text-sm">
              <u-badge v-if="insertCount > 0" color="warning" variant="soft" size="sm">
                등록: {{ insertCount }}
              </u-badge>
              <u-badge v-if="updateCount > 0" color="info" variant="soft" size="sm">
                수정: {{ updateCount }}
              </u-badge>
              <u-badge v-if="failureCount > 0" color="error" variant="soft" size="sm">
                실패: {{ failureCount }}
              </u-badge>
            </div>
          </div>
          <div
            v-if="excelData.length > 0"
            class="overflow-auto h-[60vh] border border-gray-300 dark:border-gray-700 rounded-md scrollbar-thin"
          >
            <ul class="min-w-max divide-y divide-gray-300 dark:divide-gray-700">
              <!-- 헤더 행 -->
              <li
                class="grid gap-4 py-3.5 px-4 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10"
                :style="{
                  gridTemplateColumns: `auto 50px 100px repeat(${headerData.length - 2}, minmax(120px, 300px))`
                }"
              >
                <div class="flex items-start justify-center py-1">
                  <input
                    type="checkbox"
                    :checked="allRowsSelected"
                    @change="toggleAllRows"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div
                  v-for="(header, index) in headerData"
                  :key="`header-${index}`"
                  class="text-center text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <div class="truncate mb-2" :title="String(header)">
                    {{ header }}
                  </div>
                  <p-nuxt-select
                    v-if="index > 1"
                    v-model="columnSelections[index]"
                    :options="selectOptions"
                    value-key="value"
                    placeholder="타입 선택"
                    class="w-full text-xs"
                    @update:model-value="(value) => handleColumnSelectionChange(index, value)"
                  />
                </div>
              </li>

              <!-- 데이터 행들 -->
              <li
                v-for="(row, rowIndex) in excelData"
                :key="`row-${rowIndex}`"
                :class="[
                  'grid gap-4 py-4 px-4 cursor-pointer transition-colors duration-150',
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                  'select-none',
                  { 'bg-blue-100 dark:bg-blue-900': isRowSelected(rowIndex + 1) }
                ]"
                :style="{
                  gridTemplateColumns: `auto 50px 100px repeat(${headerData.length - 2}, minmax(120px, 300px))`
                }"
                @click="handleRowClick(rowIndex + 1, $event)"
              >
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="isRowSelected(rowIndex + 1)"
                    @change="toggleRowSelection(rowIndex + 1)"
                    @click.stop
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <!-- 번호 섹션 -->
                <div class="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {{ rowIndex + 1 }}
                </div>

                <!-- 비고 섹션 - 업로드 상태 -->
                <div class="flex items-center justify-center gap-2">
                  <u-badge
                    v-if="rowUploadStatus[rowIndex] === 'loading'"
                    color="warning"
                    variant="soft"
                    size="sm"
                  >
                    <template #leading>
                      <u-icon name="i-lucide-loader-2" class="w-3 h-3 animate-spin" />
                    </template>
                    로딩중
                  </u-badge>
                  <u-badge
                    v-else-if="rowUploadStatus[rowIndex] === 'success'"
                    color="success"
                    variant="soft"
                    size="sm"
                  >
                    <template #leading>
                      <u-icon name="i-lucide-check" class="w-3 h-3" />
                    </template>
                    성공
                  </u-badge>
                  <u-badge
                    v-else-if="rowUploadStatus[rowIndex] === 'failure'"
                    color="error"
                    variant="soft"
                    size="sm"
                  >
                    <template #leading>
                      <u-icon name="i-lucide-x" class="w-3 h-3" />
                    </template>
                    실패
                  </u-badge>
                  <u-badge v-else color="neutral" variant="soft" size="sm"> 대기중 </u-badge>

                  <!-- 메서드 정보 -->
                  <u-badge
                    v-if="
                      rowUploadMethod[rowIndex] &&
                      (rowUploadStatus[rowIndex] === 'success' ||
                        rowUploadStatus[rowIndex] === 'failure')
                    "
                    :color="rowUploadMethod[rowIndex] === 'insert' ? 'warning' : 'info'"
                    variant="soft"
                    size="sm"
                  >
                    {{ rowUploadMethod[rowIndex] === 'insert' ? '등록' : '수정' }}
                  </u-badge>
                </div>

                <!-- 데이터 셀들 -->
                <div
                  v-for="(cell, cellIndex) in row"
                  :key="`cell-${rowIndex}-${cellIndex}`"
                  class="text-sm font-medium text-center text-gray-900 dark:text-white truncate"
                  :title="String(cell)"
                >
                  {{ cell }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </u-form>
      <p v-if="excelData.length > 1" class="text-sm text-gray-500 dark:text-gray-400">
        Shift + 클릭 하면 여러 행을 선택할 수 있습니다.
      </p>
    </template>
    <template #footer>
      <div class="w-full flex items-center justify-between gap-4">
        <!-- 진행률 바 섹션 (왼쪽) -->
        <div class="w-[450px]">
          <div v-show="isUploading || uploadProgress === 100" class="w-full">
            <div class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              업로드 진행중... {{ completedRowsCount }}/{{ totalRowsToUpload }}
            </div>
            <div class="w-full rounded bg-gray-200 dark:bg-gray-700">
              <div
                class="w-full rounded bg-blue-500 p-0.5 text-center text-xs leading-none font-medium text-blue-100"
                role="progressbar"
                :style="{ width: progressBarWidth }"
                :aria-valuenow="uploadProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ uploadProgress }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 섹션 (오른쪽) -->
        <div class="flex gap-2">
          <u-button color="neutral" @click="$emit('close')" :disabled="isUploading">취소</u-button>
          <u-button @click="formSubmit" :disabled="isUploading">업로드</u-button>
        </div>
      </div>
    </template>
  </u-modal>
</template>

<script setup lang="ts">
// ========================================================================
// AI 복사 가이드:
// 1. 이 파일을 복사하여 새 모듈에 붙여넣기
// 2. MODULE_CONFIG 섹션만 수정 (컬럼 정의, API 함수)
// 3. 스토어에 excelUpload API 함수 추가
// ========================================================================

import { ref, computed, onUnmounted } from 'vue';
import * as XLSX from 'xlsx';
import PNuxtSelect from '@/modules/_common/components/forms/p-nuxt-select.vue';
import { ExcelUploadValidator } from './_crud-excel.validator.ts';
import type { FormErrorEvent } from '@nuxt/ui';
import { FormService } from '@/modules/_common/services/form.service.ts';
import type { TestDataExcelUploadDto } from '../type/test-data.type';

// ========================================================================
// ===== INLINE TYPE DEFINITIONS =====
// ========================================================================

type ExcelRow = (string | number | null)[];
type UploadStatus = 'pending' | 'loading' | 'success' | 'failure';

interface SelectOption {
  text: string;
  value: string;
  required: boolean;
}

interface ProcessedExcelData {
  excelData: ExcelRow[];
  columnSelections: Record<number, string>;
  maxColumns: number;
}

interface UploadResult {
  isSuccess: boolean;
  method: 'insert' | 'update';
}

// ========================================================================
// ===== MODULE CONFIGURATION (수정 필요 부분) =====
// ========================================================================

// 🔧 모듈별 스토어 import
import { useTestDataStore } from '../store/test-data.store';
const store = useTestDataStore();

// 🔧 컬럼 설정 정의
const COLUMN_CONFIG = [
  { text: '내용(필수)', value: 'contents', required: true },
  { text: '제목(필수)', value: 'subject', required: true },
  { text: '값(필수)', value: 'value', required: true },
  { text: '숫자(필수)', value: 'bigint', required: true },
  { text: '사용여부', value: 'isUse', required: false }
];

// 🔧 업로드 DTO 생성 함수
const createUploadDto = (row: ExcelRow, columnMap: Record<number, string>): TestDataExcelUploadDto => {
  const dto: TestDataExcelUploadDto = {
    value: '',
    subject: '',
    contents: '',
    bigint: 0
  };
  
  Object.entries(columnMap).forEach(([index, field]) => {
    const colIndex = parseInt(index) - COLUMN_OFFSET;
    const cellValue = row[colIndex];
    
    switch(field) {
      case 'subject': 
        dto.subject = String(cellValue || ''); 
        break;
      case 'value': 
        dto.value = String(cellValue || ''); 
        break;
      case 'contents': 
        dto.contents = String(cellValue || ''); 
        break;
      case 'bigint': 
        dto.bigint = Number(cellValue || 0); 
        break;
    }
  });
  
  // 매핑되지 않은 경우 첫 번째 셀을 contents로 사용
  if (!dto.contents && row.length > 0) {
    dto.contents = String(row[0] || '');
  }
  
  return dto;
};

// 🔧 API 호출 함수
const uploadApi = async (dto: TestDataExcelUploadDto): Promise<UploadResult> => {
  return store.excelUpload(dto);
};

// ========================================================================
// ===== CONSTANTS =====
// ========================================================================

const COLUMN_OFFSET = 2; // '번호', '비고' 컬럼 오프셋
const BASE_HEADERS = ['번호', '비고'];

// ========================================================================
// ===== STATE MANAGEMENT =====
// ========================================================================

const emits = defineEmits(['close', 'upload-ok']);

// File Management
const formRef = ref();
const fileInput = ref<HTMLInputElement>();
const selectedFileName = ref<string>('');

// Data Management
const excelData = ref<ExcelRow[]>([]);
const columnSelections = ref<Record<number, string>>({});
const selectOptions = ref<SelectOption[]>(COLUMN_CONFIG);

// Selection Management
const selectedRows = ref<number[]>([]);
const selectedRowsSet = ref<Set<number>>(new Set());
const lastSelectedRow = ref<number | null>(null);

// Upload Status
const rowUploadStatus = ref<Record<number, UploadStatus>>({});
const rowUploadMethod = ref<Record<number, string>>({});

// ========================================================================
// ===== EXCEL FILE PROCESSING =====
// ========================================================================

const processExcelFile = async (file: File): Promise<ProcessedExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as ExcelRow[];
        
        // 기본 컬럼 선택 설정
        const columnSelectionsData: Record<number, string> = {};
        const maxColumns = jsonData.length > 0 ? Math.max(...jsonData.map(row => row.length)) : 0;
        
        // 필수 컬럼 자동 매핑
        for (let i = COLUMN_OFFSET; i < Math.min(COLUMN_OFFSET + selectOptions.value.length, COLUMN_OFFSET + maxColumns); i++) {
          const optionIndex = i - COLUMN_OFFSET;
          if (selectOptions.value[optionIndex]?.required) {
            columnSelectionsData[i] = selectOptions.value[optionIndex].value;
          }
        }
        
        resolve({
          excelData: jsonData,
          columnSelections: columnSelectionsData,
          maxColumns
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsArrayBuffer(file);
  });
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFileName.value = file.name;
    
    try {
      const processed = await processExcelFile(file);
      excelData.value = processed.excelData;
      columnSelections.value = processed.columnSelections;
      resetUploadState();
    } catch (error) {
      console.error('Excel 파일 처리 오류:', error);
      alert('Excel 파일 처리 중 오류가 발생했습니다.');
      resetAll();
    }
  }
};

// ========================================================================
// ===== ROW SELECTION LOGIC =====
// ========================================================================

const isRowSelected = (rowIndex: number) => selectedRowsSet.value.has(rowIndex);

const toggleRowSelection = (rowIndex: number) => {
  if (selectedRowsSet.value.has(rowIndex)) {
    selectedRows.value = selectedRows.value.filter(id => id !== rowIndex);
    selectedRowsSet.value.delete(rowIndex);
  } else {
    selectedRows.value.push(rowIndex);
    selectedRowsSet.value.add(rowIndex);
  }
  lastSelectedRow.value = rowIndex;
};

const handleRowClick = (rowIndex: number, event: MouseEvent) => {
  if (event.shiftKey) event.preventDefault();
  
  if (event.shiftKey && lastSelectedRow.value !== null) {
    const start = Math.min(lastSelectedRow.value, rowIndex);
    const end = Math.max(lastSelectedRow.value, rowIndex);
    for (let i = start; i <= end; i++) {
      if (!selectedRowsSet.value.has(i)) {
        selectedRows.value.push(i);
        selectedRowsSet.value.add(i);
      }
    }
    selectedRows.value.sort((a, b) => a - b);
  } else {
    toggleRowSelection(rowIndex);
  }
};

const toggleAllRows = () => {
  if (allRowsSelected.value) {
    selectedRows.value = [];
    selectedRowsSet.value.clear();
  } else {
    selectedRows.value = Array.from({ length: excelData.value.length }, (_, i) => i + 1);
    selectedRowsSet.value = new Set(selectedRows.value);
  }
};

// ========================================================================
// ===== COLUMN MAPPING =====
// ========================================================================

const handleColumnSelectionChange = (currentIndex: number, newValue: string | number) => {
  const stringValue = String(newValue);
  const existingIndex = Object.entries(columnSelections.value).find(
    ([index, value]) => Number(index) !== currentIndex && value === stringValue
  );
  
  if (existingIndex && Number(existingIndex[0]) !== currentIndex) {
    columnSelections.value[Number(existingIndex[0])] = '';
  }
};

// ========================================================================
// ===== UPLOAD LOGIC =====
// ========================================================================

const uploadData = async () => {
  try {
    // 선택된 행들을 순차적으로 업로드
    for (const rowIndex of selectedRows.value) {
      const adjustedIndex = rowIndex - 1;
      
      // 업로드 시작
      rowUploadStatus.value[adjustedIndex] = 'loading';
      rowUploadMethod.value[adjustedIndex] = '';
      
      try {
        // DTO 생성 및 API 호출
        const dto = createUploadDto(excelData.value[adjustedIndex], columnSelections.value);
        const result = await uploadApi(dto);
        
        // 성공 처리
        rowUploadStatus.value[adjustedIndex] = 'success';
        rowUploadMethod.value[adjustedIndex] = result.method;
      } catch (error) {
        // 실패 처리
        rowUploadStatus.value[adjustedIndex] = 'failure';
        console.error(`Row ${rowIndex} upload failed:`, error);
      }
    }
    
    emits('upload-ok');
  } catch (error) {
    console.error('Upload process failed:', error);
    // 처리 중이던 행들을 실패로 설정
    selectedRows.value.forEach(rowIndex => {
      const adjustedIndex = rowIndex - 1;
      if (rowUploadStatus.value[adjustedIndex] === 'loading') {
        rowUploadStatus.value[adjustedIndex] = 'failure';
      }
    });
  }
};

// ========================================================================
// ===== COMPUTED PROPERTIES =====
// ========================================================================

const headerData = computed(() => {
  if (excelData.value.length === 0) return BASE_HEADERS;
  const maxColumns = Math.max(...excelData.value.map(row => row.length));
  const additionalHeaders = Array.from({ length: maxColumns }, (_, i) => `항목${i + 1}`);
  return [...BASE_HEADERS, ...additionalHeaders];
});

const allRowsSelected = computed(() => {
  if (excelData.value.length === 0) return false;
  return selectedRows.value.length === excelData.value.length;
});

const uploadStats = computed(() => {
  const methods = Object.values(rowUploadMethod.value);
  const statuses = Object.values(rowUploadStatus.value);
  return {
    insertCount: methods.filter(m => m === 'insert').length,
    updateCount: methods.filter(m => m === 'update').length,
    failureCount: statuses.filter(s => s === 'failure').length
  };
});

const insertCount = computed(() => uploadStats.value.insertCount);
const updateCount = computed(() => uploadStats.value.updateCount);
const failureCount = computed(() => uploadStats.value.failureCount);
const hasUploadStatus = computed(() => insertCount.value > 0 || updateCount.value > 0 || failureCount.value > 0);

const totalRowsToUpload = computed(() => selectedRows.value.length);
const completedRowsCount = computed(() => {
  return Object.values(rowUploadStatus.value)
    .filter(s => s === 'success' || s === 'failure').length;
});
const uploadProgress = computed(() => {
  if (totalRowsToUpload.value === 0) return 0;
  return Math.round((completedRowsCount.value / totalRowsToUpload.value) * 100);
});
const progressBarWidth = computed(() => `${uploadProgress.value}%`);
const isUploading = computed(() => Object.values(rowUploadStatus.value).some(s => s === 'loading'));

// ========================================================================
// ===== UTILITY FUNCTIONS =====
// ========================================================================

const triggerFileInput = () => fileInput.value?.click();

const resetUploadState = () => {
  selectedRows.value = [];
  selectedRowsSet.value.clear();
  lastSelectedRow.value = null;
  rowUploadStatus.value = {};
  rowUploadMethod.value = {};
  
  // 각 행의 상태를 pending으로 초기화
  if (excelData.value.length > 0) {
    excelData.value.forEach((_, index) => {
      rowUploadStatus.value[index] = 'pending';
    });
  }
};

const resetAll = () => {
  resetUploadState();
  excelData.value = [];
  columnSelections.value = {};
  selectedFileName.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formSubmit = () => formRef.value?.submit();
const formState = computed(() => ({
  selectedRows: selectedRows.value,
  columnSelections: columnSelections.value,
  excelData: excelData.value
}));

const handleFormError = (event: FormErrorEvent) => {
  FormService.onError(event);
};

// ========================================================================
// ===== LIFECYCLE =====
// ========================================================================

onUnmounted(() => {
  resetAll();
});
</script>