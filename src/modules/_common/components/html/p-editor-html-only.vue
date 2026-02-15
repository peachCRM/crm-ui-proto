<template>
  <div :class="['html-editor-container', customClass]">
    <div class="editor-header bg-gray-50 px-3 py-2.5 border border-gray-200 rounded-t-md">
      <span class="text-sm font-medium text-gray-700">HTML 전용 에디터</span>
    </div>

    <div
      class="editor-content flex border-x border-b border-gray-200 rounded-b-md"
      :style="{ height: 'calc(100% - 45px)' }"
    >
      <!-- HTML 코드 편집 영역 -->
      <div class="w-1/2 border-r border-gray-200">
        <div class="bg-gray-50 px-3 py-2 border-b h-[45px] border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-600">HTML 소스 편집</span>
            <u-button @click="beautifyHtml" size="sm"> 코드 정리 </u-button>
          </div>
        </div>
        <textarea
          v-model="htmlContent"
          @input="onHtmlContentChange"
          :class="[
            'w-full p-3 text-sm font-mono leading-relaxed resize-none border-0 ',
            'focus:outline-none focus:ring-0 bg-white h-[calc(100%-45px)]'
          ]"
          placeholder="HTML 코드를 입력하세요..."
          spellcheck="false"
        ></textarea>
      </div>

      <!-- 미리보기 영역 -->
      <div class="w-1/2">
        <div class="bg-gray-50 px-3 py-2 border-b h-[45px] border-gray-200">
          <span class="text-xs font-medium text-gray-600">미리보기</span>
        </div>
        <div
          class="preview-container p-4 h-[calc(100%-45px)] overflow-auto bg-white"
          ref="previewRef"
        >
          <div v-html="sanitizedHtml" class="ql-editor prose prose-sm max-w-none"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { html as beautifyHtmlLib } from 'js-beautify';
import DOMPurify from 'dompurify';

const { emitFormInput } = useFormField();

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  customClass: {
    type: String,
    default: 'h-[450px]'
  },
});

const emit = defineEmits(['update:modelValue', 'set-files']);

// HTML 컨텐츠 상태
const htmlContent = ref('');
const previewRef = ref<HTMLElement>();

// js-beautify 옵션
const beautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  indent_with_tabs: false,
  end_with_newline: true,
  preserve_newlines: true,
  max_preserve_newlines: 2,
  indent_inner_html: true,
  wrap_line_length: 120,
  wrap_attributes: 'auto' as const,
  unformatted: ['pre', 'code'],
  content_unformatted: ['pre', 'code', 'textarea'],
  extra_liners: ['head', 'body', '/html']
};

// DOMPurify 옵션 - 안전한 HTML 렌더링
const purifyConfig = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['target', 'rel'],
  ALLOW_DATA_ATTR: true,
  KEEP_CONTENT: true
};

// Sanitized HTML for preview
const sanitizedHtml = computed(() => {
  if (!htmlContent.value) return '';

  // DOMPurify로 안전한 HTML 생성
  return DOMPurify.sanitize(htmlContent.value, purifyConfig);
});

// HTML 내용 변경 처리
const onHtmlContentChange = () => {
  emit('update:modelValue', htmlContent.value);
  emitFormInput();
};

// HTML 코드 정리 https://api.dev.ctaplatform.com/api/v1/popup/list
const beautifyHtml = () => {
  if (!htmlContent.value) return;

  try {
    htmlContent.value = beautifyHtmlLib(htmlContent.value, beautifyOptions);
    onHtmlContentChange();
  } catch (error) {
    console.error('HTML 정리 중 오류:', error);
    useToast().add({
      title: 'HTML 코드 정리 실패',
      description: '올바른 HTML 형식인지 확인해주세요.',
      color: 'error'
    });
  }
};

const fileDelete = (downUrl: string) => {
  // HTML에서 해당 링크/이미지 제거
  const imgRegex = new RegExp(`<img[^>]*src=["']${downUrl}["'][^>]*>`, 'gi');
  const linkRegex = new RegExp(`<a[^>]*href=["']${downUrl}["'][^>]*>[^<]*</a>`, 'gi');

  htmlContent.value = htmlContent.value.replace(imgRegex, '').replace(linkRegex, '');

  onHtmlContentChange();
};

const editorAdd = (html: string) => {
  // 현재 커서 위치에 HTML 추가 (간단히 끝에 추가)
  htmlContent.value += html;
  onHtmlContentChange();
};


// modelValue 변경 감지
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== htmlContent.value) {
      htmlContent.value = newValue || '';
    }
  },
  { immediate: true }
);

// 공개 메서드
const getContent = () => {
  return htmlContent.value;
};

const setContent = (content: string) => {
  htmlContent.value = content || '';
};

const clearContent = () => {
  htmlContent.value = '';
  onHtmlContentChange();
};

// expose 메서드
defineExpose({
  getContent,
  setContent,
  clearContent,
  editorAdd,
  fileDelete
});
</script>

<style scoped>
.html-editor-container {
  min-height: 500px;
}

.preview-container :deep(*) {
  max-width: 100%;
}

.preview-container :deep(img) {
  max-width: 100%;
  height: auto;
}

.preview-container :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.preview-container :deep(table td),
.preview-container :deep(table th) {
  border: 1px solid #e5e7eb;
  padding: 8px;
}

textarea {
  tab-size: 2;
}
</style>
