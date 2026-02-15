<template>
  <div class="ql-container ql-toolbar ql-snow hidden">hide</div>

  <div :class="customClass" class="pb-[50px]">
    <!-- HTML 소스 편집 모드 -->
    <div
      v-if="isHtmlMode"
      class="h-full rounded-t-md border border-gray-300"
      style="height: calc(100% + 42px)"
    >
      <div class="rounded-t-md border-b border-gray-200 bg-gray-50 px-3 py-2.5">
        <span class="text-sm font-medium text-gray-700">HTML 소스 편집</span>
      </div>
      <textarea
        v-model="htmlContent"
        @input="onHtmlContentChange"
        :class="[
          'w-full resize-none border-0 p-3 text-sm leading-relaxed',
          'q-textarea h-full bg-white focus:ring-0 focus:outline-none'
        ]"
        :style="{ height: getTextareaHeight() }"
        placeholder="HTML 코드를 입력하세요..."
      ></textarea>
    </div>

    <!-- 일반 에디터 모드 -->
    <QuillEditor
      v-else
      ref="quillEditorRef"
      theme="snow"
      content-type="html"
      :content="modelValue"
      :options="editorOptions"
      @update:content="onUpdateContent"
    />

    <!-- 모드 전환 탭 -->
    <div class="flex rounded-b-md border-x border-b border-gray-300 bg-gray-50">
      <div
        @click="switchToEditorMode"
        :class="[
          'rounded-bl-md px-4 py-2 text-center text-sm font-medium transition-colors duration-200',
          'cursor-pointer border-r border-gray-200 focus:outline-none',
          !isHtmlMode
            ? 'bg-white text-indigo-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        ]"
      >
        <svg
          class="mr-1.5 inline-block h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        편집기 모드
      </div>
      <div
        @click="switchToHtmlMode"
        :class="[
          'cursor-pointer px-4 py-2 text-center text-sm font-medium transition-colors duration-200',
          'border-r border-gray-200 focus:outline-none',
          isHtmlMode
            ? 'bg-white text-indigo-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        ]"
      >
        <svg
          class="mr-1.5 inline-block h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        HTML 모드
      </div>
    </div>
  </div>

  <!-- 파일 업로드 슬롯 -->
  <slot name="file-upload" :insertFile="insertFile" :uploadFile="editorUploadFile" />

  <!-- 특수문자 선택 모달 -->
  <p-special-char-modal
    :is-open="isSpecialCharModalOpen"
    @close="closeSpecialCharModal"
    @select="insertSelectedChar"
  />
</template>

<script setup lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick, computed } from 'vue';
import { QuillEditor } from '@rafaeljunioxavier/vue-quill-fix';
import '@rafaeljunioxavier/vue-quill-fix/dist/vue-quill.snow.css';
import { html as beautifyHtml } from 'js-beautify';
// @ts-ignore
import QuillResize from 'quill-resize-module';
// @ts-ignore
import QuillBetterTable from 'quill-better-table';
import 'quill-better-table/dist/quill-better-table.css';
// @ts-ignore
import RegisterFazQuillEmoji from 'faz-quill-emoji';
import 'faz-quill-emoji/dist/faz.quill.emoji.css';

import { Quill } from '@rafaeljunioxavier/vue-quill-fix';
import PSpecialCharModal from './p-special-char-modal.vue';
import { TEXT_COLORS, BACKGROUND_COLORS } from './color-utils.ts';

// 전역 플래그를 사용한 중복 등록 방지
declare global {
  interface Window {
    __QUILL_MODULES_REGISTERED__?: boolean;
  }
}

// Quill 모듈 등록
Quill.register('modules/resize', QuillResize);
Quill.register('modules/better-table', QuillBetterTable);
RegisterFazQuillEmoji(Quill);

// 글자크기 포맷 등록
const Size = Quill.import('formats/size') as any;
Size.whitelist = [
  '8px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '36px',
  '48px'
];
Quill.register(Size, true);

// 글자크기 드롭다운 라벨 설정
const SizeStyle = Quill.import('attributors/style/size') as any;
SizeStyle.whitelist = [
  '8px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '36px',
  '48px'
];
Quill.register(SizeStyle, true);

// 글꼴 포맷 등록
const Font = Quill.import('formats/font') as any;
Font.whitelist = [
  'Dotum',
  'DotumChe',
  'Gulim',
  'GulimChe',
  'Batang',
  'BatangChe',
  'Gungsuh',
  'Malgun Gothic',
  'Nanum Gothic',
  'Arial',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Lucida Sans Unicode',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana'
];
Quill.register(Font, true);

// 글꼴 스타일 설정
const FontStyle = Quill.import('attributors/style/font') as any;
FontStyle.whitelist = [
  'Dotum',
  'DotumChe',
  'Gulim',
  'GulimChe',
  'Batang',
  'BatangChe',
  'Gungsuh',
  'Malgun Gothic',
  'Nanum Gothic',
  'Arial',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Lucida Sans Unicode',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana'
];
Quill.register(FontStyle, true);

const { emitFormInput } = useFormField();
defineComponent({
  name: 'PEditorQuill'
});

const props = defineProps({
  isFile: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: 'h-[450px]'
  },
  modelValue: {
    type: String,
    default: '<p></p>'
  },
  maxFileSize: {
    type: Number,
    default: 100 * 1024 * 1024 // 100MB
  },
  allowedFileTypes: {
    type: Array as () => string[],
    default: () => [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ]
  }
});

// HTML 편집 모드 상태 관리
const isHtmlMode = ref(false);
const htmlContent = ref('');

// js-beautify HTML 옵션 설정
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

// customClass에서 높이 추출하여 textarea 높이 계산
const getTextareaHeight = () => {
  const heightMatch = props.customClass.match(/h-\[(\d+)px\]/);
  if (heightMatch) {
    const height = parseInt(heightMatch[1]) - 51;
    return `${height}px`;
  }
  return '370px';
};

// 모드 전환 함수
const switchToEditorMode = () => {
  if (isHtmlMode.value) {
    isHtmlMode.value = false;
  }
};

const switchToHtmlMode = () => {
  if (!isHtmlMode.value) {
    const originalContent = props.modelValue || '<p></p>';
    try {
      htmlContent.value = beautifyHtml(originalContent, beautifyOptions);
    } catch (error) {
      console.warn('HTML 정리 중 오류 발생:', error);
      htmlContent.value = originalContent;
    }
    isHtmlMode.value = true;
  }
};

// 표 삽입 함수
const insertTable = () => {
  if (isHtmlMode.value) {
    const tableHtml = `
<table>
  <tbody>
    <tr>
      <td>셀 1</td>
      <td>셀 2</td>
      <td>셀 3</td>
    </tr>
    <tr>
      <td>셀 4</td>
      <td>셀 5</td>
      <td>셀 6</td>
    </tr>
  </tbody>
</table>
<p><br></p>`;
    htmlContent.value += tableHtml;
    onHtmlContentChange();
  } else {
    let quillEditor = quillEditorRef.value?.getQuill();
    if (quillEditor) {
      const tableModule = quillEditor.getModule('better-table');
      if (tableModule) {
        tableModule.insertTable(3, 3);
      }
    }
  }
};

// 특수문자 모달 상태
const isSpecialCharModalOpen = ref(false);

// 특수문자 모달 열기
const insertSpecialChar = () => {
  isSpecialCharModalOpen.value = true;
};

// 특수문자 모달 닫기
const closeSpecialCharModal = () => {
  isSpecialCharModalOpen.value = false;
};

// 선택된 특수문자 삽입
const insertSelectedChar = (char: string) => {
  if (isHtmlMode.value) {
    // HTML 모드에서는 직접 텍스트 추가
    htmlContent.value += char;
    onHtmlContentChange();
  } else {
    // 일반 모드에서는 현재 커서 위치에 특수문자 삽입
    let quillEditor = quillEditorRef.value?.getQuill();
    if (quillEditor) {
      quillEditor.focus();
      const cursorPosition = quillEditor.getSelection()?.index || 0;
      quillEditor.insertText(cursorPosition, char, 'user');
      quillEditor.setSelection(cursorPosition + 1, 0);
    }
  }

  // 모달 닫기
  closeSpecialCharModal();
};

// HTML 내용 변경 시 처리
const onHtmlContentChange = () => {
  // base64 이미지 제거
  const cleanedHtml = htmlContent.value.replace(
    /<img[^>]*src="data:image\/[^"]*"[^>]*>/gi,
    '<!-- base64 이미지가 제거되었습니다. 파일을 직접 업로드해주세요. -->'
  );

  if (cleanedHtml !== htmlContent.value) {
    htmlContent.value = cleanedHtml;
  }

  emit('update:modelValue', htmlContent.value);
  emitFormInput();
};

// modelValue 변경 감지하여 HTML 모드일 때 동기화
watch(
  () => props.modelValue,
  (newValue) => {
    if (isHtmlMode.value) {
      if (htmlContent.value === newValue) {
        return;
      }

      try {
        let content = newValue || '<p></p>';

        if (content.trim() && !content.includes('<') && !content.includes('>')) {
          htmlContent.value = `<p>${content.trim()}</p>`;
        } else {
          htmlContent.value = beautifyHtml(content, beautifyOptions);
        }
      } catch (error) {
        console.warn('HTML 정리 중 오류 발생:', error);
        let content = newValue || '<p></p>';

        if (content.trim() && !content.includes('<') && !content.includes('>')) {
          htmlContent.value = `<p>${content.trim()}</p>`;
        } else {
          htmlContent.value = content;
        }
      }
    }
  }
);

const editorOptions = computed(() => {
  // 기본 toolbar 구성
  const baseToolbar = [
    [
      {
        font: [
          false,
          'Dotum',
          'DotumChe',
          'Gulim',
          'GulimChe',
          'Batang',
          'BatangChe',
          'Gungsuh',
          'Malgun Gothic',
          'Nanum Gothic',
          'Arial',
          'Comic Sans MS',
          'Courier New',
          'Georgia',
          'Lucida Sans Unicode',
          'Tahoma',
          'Times New Roman',
          'Trebuchet MS',
          'Verdana'
        ]
      }
    ],
    [
      {
        size: [
          false,
          '8px',
          '9px',
          '10px',
          '11px',
          '12px',
          '14px',
          '16px',
          '20px',
          '22px',
          '24px',
          '26px',
          '28px',
          '36px',
          '48px'
        ]
      }
    ],
    ['bold', 'italic', 'underline', 'strike'],
    [
      {
        color: [...TEXT_COLORS]
      },
      {
        background: [...BACKGROUND_COLORS]
      }
    ],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: ['', 'center', 'right', 'justify'] }]
  ];

  // props.isFile이 true일 때만 link, image 버튼 추가
  if (props.isFile) {
    baseToolbar.push(['insertTable', 'image', 'faz-emoji', 'insertSpecialChar']);
  } else {
    baseToolbar.push(['insertTable', 'faz-emoji', 'insertSpecialChar']);
  }

  // 표 삽입과 clean 버튼은 항상 포함
  baseToolbar.push(['link', 'clean']);

  return {
    modules: {
      toolbar: {
        container: baseToolbar,
        handlers: {
          insertTable: () => {
            insertTable();
          },
          insertSpecialChar: () => {
            insertSpecialChar();
          },
          image: () => {
            handleImageUpload();
          },
          'faz-emoji': true
        }
      },
      'better-table': {
        operationMenu: {
          items: {
            insertColumnRight: {
              text: '오른쪽에 열 삽입'
            },
            insertColumnLeft: {
              text: '왼쪽에 열 삽입'
            },
            insertRowUp: {
              text: '위에 행 삽입'
            },
            insertRowDown: {
              text: '아래에 행 삽입'
            },
            mergeCells: {
              text: '셀 병합'
            },
            unmergeCells: {
              text: '셀 병합 해제'
            },
            deleteColumn: {
              text: '열 삭제'
            },
            deleteRow: {
              text: '행 삭제'
            },
            deleteTable: {
              text: '표 삭제'
            }
          }
        }
      },
      resize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar']
      },
      fazEmoji: true,
      clipboard: {
        matchVisual: false
      },
      keyboard: {
        bindings: QuillBetterTable.keyboardBindings
      }
    }
  };
});

const emit = defineEmits(['update:modelValue', 'upload-file']);

const onUpdateContent = (updatedContent: string) => {
  // base64 이미지 제거
  const cleanedContent = cleanBase64Images(updatedContent);

  if (cleanedContent !== updatedContent) {
    nextTick(() => {
      const quillEditor = quillEditorRef.value?.getQuill();
      if (quillEditor) {
        quillEditor.clipboard.dangerouslyPasteHTML(cleanedContent);
      }
    });

    emit('update:modelValue', cleanedContent);
  } else {
    emit('update:modelValue', updatedContent);
  }

  emitFormInput();
};

// base64 이미지를 제거하는 헬퍼 함수
const cleanBase64Images = (html: string): string => {
  const cleanedHtml = html.replace(
    /<img[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi,
    '<!-- base64 이미지가 제거되었습니다 -->'
  );

  return cleanedHtml.replace(/src=["']data:image\/[^"']*["']/gi, 'src=""');
};

const quillEditorRef = ref<any>(null);

// 파일 삽입 함수 (slot에서 사용)
const insertFile = (html: string) => {
  addHtml(html);
};

// 파일 업로드 함수 (slot에서 사용)
const editorUploadFile = (files: File[]) => {
  emit('upload-file', files);
};

const addHtml = (html: string, isLast: boolean = false) => {
  if (isHtmlMode.value) {
    if (isLast) {
      htmlContent.value += html;
    } else {
      htmlContent.value += html;
    }
    onHtmlContentChange();
  } else {
    if (isLast) {
      let quillEditor = quillEditorRef.value?.getQuill();
      if (quillEditor) {
        quillEditor.focus();
        const totalLength = quillEditor.getLength();
        quillEditor.clipboard.dangerouslyPasteHTML(totalLength, html);
      }
    } else {
      let quillEditor = quillEditorRef.value?.getQuill();
      if (quillEditor) {
        quillEditor.focus();
        const cursorPosition = quillEditor.getSelection()?.index || 0;
        quillEditor.clipboard.dangerouslyPasteHTML(cursorPosition, html);
      }
    }
  }
};

const removeLinkByHref = (href: string) => {
  let quillEditor = quillEditorRef.value?.getQuill();
  if (quillEditor) {
    const delta = quillEditor.getContents();
    let index = 0;
    let lengthToDelete = 0;

    delta.ops.forEach((op: any) => {
      if (op.insert && typeof op.insert === 'string') {
        if (op.attributes && op.attributes.link && op.attributes.link === href) {
          lengthToDelete = op.insert.length;
          quillEditor.deleteText(index, lengthToDelete);
          index -= lengthToDelete;
        }
        index += op.insert.length;
      } else {
        index += op.insert ? op.insert.length || 1 : 0;
      }
    });
  }
};

const removeImageBySrc = (src: string) => {
  let quillEditor = quillEditorRef.value?.getQuill();
  if (quillEditor) {
    let delta = quillEditor.getContents();
    let ops = delta.ops;
    let index = 0;
    let imageFound = false;

    do {
      imageFound = false;
      index = 0;

      ops.forEach((op: any) => {
        if (op.insert && typeof op.insert === 'object' && op.insert.image) {
          if (op.insert.image === src) {
            quillEditor.deleteText(index, 1);
            imageFound = true;
            return false;
          }
          index += 1;
        } else if (op.insert && typeof op.insert === 'string') {
          index += op.insert.length;
        }
      });

      delta = quillEditor.getContents();
      ops = delta.ops;
    } while (imageFound);
  }
};

// 노출 메서드
defineExpose({
  addHtml,
  removeLinkByHref,
  removeImageBySrc
});

// base64 알림 디바운스
let base64AlertTimeout: number | null = null;
const showBase64Alert = () => {
  if (base64AlertTimeout) {
    clearTimeout(base64AlertTimeout);
  }
  base64AlertTimeout = window.setTimeout(() => {
    alert(
      '이미지가 base64 형식으로 붙여넣기되었습니다.\n파일을 직접 드래그하거나 복사하여 업로드해주세요.'
    );
    base64AlertTimeout = null;
  }, 100);
};

// 이미지 버튼 클릭 처리 함수
const handleImageUpload = () => {
  if (!props.isFile) {
    return;
  }

  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.style.display = 'none';

  input.addEventListener('change', async (event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > props.maxFileSize) {
        alert(
          `파일 크기가 너무 큽니다. ${Math.round(props.maxFileSize / 1024 / 1024)}MB 이하의 파일을 선택해주세요.`
        );
        return;
      }

      if (!props.allowedFileTypes.includes(file.type)) {
        alert('지원하지 않는 파일 형식입니다.');
        return;
      }
      //console.log(file);
      emit('upload-file', [file]);
    }

    document.body.removeChild(input);
  });

  document.body.appendChild(input);
  input.click();
};

// 에디터에서 붙여넣기 처리
const handlePasteInEditor = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  const files: File[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }
  }

  if (files.length > 0) {
    event.preventDefault();
    event.stopPropagation();
    emit('upload-file', files);
    return;
  }

  // base64 이미지 체크
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type === 'text/html') {
      item.getAsString((htmlData) => {
        if (htmlData.includes('data:image/') || htmlData.includes('src="data:')) {
          event.preventDefault();
          event.stopPropagation();
          showBase64Alert();
        }
      });
      break;
    }
  }
};

// 에디터에서 드롭 처리
const handleDropInEditor = async (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (!files || files.length === 0) return;

  event.preventDefault();

  const fileArray: File[] = [];
  for (let i = 0; i < files.length; i++) {
    fileArray.push(files[i]);
  }

  emit('upload-file', fileArray);
};

// 클립보드 핸들러 설정
const setupClipboardHandler = () => {
  const quillEditor = quillEditorRef.value?.getQuill();
  if (!quillEditor) return;

  const editorElement = quillEditor.root;
  editorElement.removeEventListener('paste', handlePasteInEditor);

  // base64 이미지 차단 매처
  quillEditor.clipboard.addMatcher('IMG', (node: any, delta: any) => {
    const src = node.getAttribute('src');
    if (src && src.startsWith('data:image/')) {
      showBase64Alert();
      return { ops: [] };
    }
    return delta;
  });

  quillEditor.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src');
      if (src && src.startsWith('data:image/')) {
        showBase64Alert();
        return { ops: [] };
      }
    }
    return delta;
  });

  quillEditor.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: any) => {
    if (node.data && node.data.includes('data:image/')) {
      showBase64Alert();
      return { ops: [] };
    }
    return delta;
  });

  editorElement.addEventListener('paste', handlePasteInEditor, true);

  editorElement.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      console.log('Ctrl+V 붙여넣기 감지됨');
    }
  });

  editorElement.addEventListener('drop', handleDropInEditor);
  editorElement.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
};

// 에디터 마운트 후 이벤트 핸들러 설정
onMounted(() => {
  console.log('====== onMounted, ', props.modelValue);
  nextTick(() => {
    setupClipboardHandler();
  });
});

// 에디터가 변경될 때마다 이벤트 핸들러 재설정
watch(
  () => quillEditorRef.value,
  () => {
    if (quillEditorRef.value) {
      nextTick(() => {
        setupClipboardHandler();
      });
    }
  }
);
</script>

<style lang="scss">
.ql-toolbar {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.ql-container,
.q-textarea {
  font-family: 'Pretendard', sans-serif;
}
</style>
<style lang="scss" scoped>
.ql-toolbar {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.ql-container {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  font-family: 'Pretendard', sans-serif;
}
// 툴바 버튼 툴팁
:deep(.ql-toolbar) {
  .ql-bold {
    position: relative;
    &:hover::after {
      content: '굵게';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-italic {
    position: relative;
    &:hover::after {
      content: '기울임';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-underline {
    position: relative;
    &:hover::after {
      content: '밑줄';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-strike {
    position: relative;
    &:hover::after {
      content: '취소선';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-list[value='ordered'] {
    position: relative;
    &:hover::after {
      content: '번호 목록';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-list[value='bullet'] {
    position: relative;
    &:hover::after {
      content: '글머리 목록';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }
  .ql-emoji {
    position: relative;
    &:hover::after {
      content: '이모지';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-insertSpecialChar {
    position: relative;
    &:hover::after {
      content: '특수문자 삽입';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-link {
    position: relative;
    &:hover::after {
      content: '링크 삽입';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-image {
    position: relative;
    &:hover::after {
      content: '이미지 삽입';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-clean {
    position: relative;
    &:hover::after {
      content: '텍스트 효과 지우기';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-size .ql-picker-label {
    position: relative;
    &:hover::after {
      content: '글자크기';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-font .ql-picker-label {
    position: relative;
    &:hover::after {
      content: '글꼴';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-align .ql-picker-label {
    position: relative;
    &:hover::after {
      content: '텍스트 정렬';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-color .ql-picker-label {
    position: relative;
    &:hover::after {
      content: '글자 색상';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-background .ql-picker-label {
    position: relative;
    &:hover::after {
      content: '배경 색상';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-insertTable {
    position: relative;

    &::before {
      content: '';
      display: inline-block;
      width: 18px;
      height: 18px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 10h18M3 14h18m-9-4v8m-7 0V7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &:hover::after {
      content: '표 삽입';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }
  .ql-insertSpecialChar {
    position: relative;

    &::before {
      content: '2';
      display: inline-block;
      width: 18px;
      height: 18px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    &:hover::after {
      content: '특수문자 삽입';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }

  .ql-faz-emoji {
    position: relative;
    &:hover::after {
      content: '이모지';
      position: absolute;
      top: 120%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f2f2f2;
      color: #1f2937;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 0.25rem;
    }
  }
}

// // better-table operation menu 클릭 활성화 - body의 pointer-events: none 오버라이드
:deep(.quill-better-table),
:deep(.qlbt-operation-menu),
:deep(.qlbt-operation-menu *) {
  pointer-events: auto !important;
}

:deep(.qlbt-operation-menu-item) {
  pointer-events: auto !important;
  cursor: pointer !important;

  &:hover {
    background-color: #f3f4f6 !important;
  }
}

:deep(.qlbt-operation-menu-dividing-line) {
  pointer-events: none !important;
}

// // 테이블 관련 요소들의 pointer-events 활성화
// :deep(.ql-editor) {
//   table,
//   table *,
//   .qlbt-col-tool,
//   .qlbt-row-tool,
//   .qlbt-col-tool *,
//   .qlbt-row-tool * {
//     pointer-events: auto !important;
//   }
// }

// // 전역적으로 better-table 관련 모든 요소 활성화
:global(.qlbt-operation-menu),
:global(.qlbt-operation-menu *) {
  pointer-events: auto !important;
}

// 글자크기 드롭다운 항목 텍스트 설정
:deep(.ql-size) {
  .ql-picker-item {
    text-indent: -9999px;
    position: relative;
    padding: 12px 12px !important;

    // Normal 항목 숨기기
    &:not([data-value]) {
      display: none !important;
    }

    &::before {
      text-indent: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: auto;
      min-width: 200px;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      box-sizing: border-box;
      white-space: nowrap;
    }

    &[data-value='8px']::before {
      content: '8px';
    }
    &[data-value='9px']::before {
      content: '9px';
    }
    &[data-value='10px']::before {
      content: '10px';
    }
    &[data-value='11px']::before {
      content: '11px';
    }
    &[data-value='12px']::before {
      content: '12px';
    }
    &[data-value='14px']::before {
      content: '14px';
    }
    &[data-value='16px']::before {
      content: '16px';
    }
    &[data-value='20px']::before {
      content: '20px';
    }
    &[data-value='22px']::before {
      content: '22px';
    }
    &[data-value='24px']::before {
      content: '24px';
    }
    &[data-value='26px']::before {
      content: '26px';
    }
    &[data-value='28px']::before {
      content: '28px';
    }
    &[data-value='36px']::before {
      content: '36px';
    }
    &[data-value='48px']::before {
      content: '48px';
    }

    // false 값(기본값)에 대한 처리
    &[data-value='false']::before {
      content: '폰트';
    }
  }

  // 선택된 항목의 표시 텍스트 설정
  .ql-picker-label {
    text-indent: -9999px;
    position: relative;
    padding: 6px 12px !important;
    overflow: hidden;

    &::before {
      text-indent: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: calc(100% - 30px);
      height: 100%;
      display: flex;
      align-items: center;
      padding: 6px 12px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &[data-value='8px']::before {
      content: '8px';
    }
    &[data-value='9px']::before {
      content: '9px';
    }
    &[data-value='10px']::before {
      content: '10px';
    }
    &[data-value='11px']::before {
      content: '11px';
    }
    &[data-value='12px']::before {
      content: '12px';
    }
    &[data-value='14px']::before {
      content: '14px';
    }
    &[data-value='16px']::before {
      content: '16px';
    }
    &[data-value='20px']::before {
      content: '20px';
    }
    &[data-value='22px']::before {
      content: '22px';
    }
    &[data-value='24px']::before {
      content: '24px';
    }
    &[data-value='26px']::before {
      content: '26px';
    }
    &[data-value='28px']::before {
      content: '28px';
    }
    &[data-value='36px']::before {
      content: '36px';
    }
    &[data-value='48px']::before {
      content: '48px';
    }

    // false 값(기본값)에 대한 처리
    &[data-value='false']::before {
      content: '폰트';
    }

    // 기본 상태일 때 폰트 표시
    &:not([data-value])::before {
      content: '폰트';
    }
  }
}

// 글꼴 드롭다운 항목 텍스트 설정
:deep(.ql-font) {
  .ql-picker-options {
    overflow: visible;
    min-width: 200px !important;
  }

  .ql-picker-item {
    text-indent: -9999px;
    position: relative;
    padding: 12px 12px !important;
    overflow: visible;
    min-width: 200px !important;

    // Normal 항목 숨기기
    &:not([data-value]) {
      display: none !important;
    }

    &::before {
      text-indent: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      box-sizing: border-box;
    }

    &[data-value='Dotum']::before {
      content: '돋움';
      font-family: 'Dotum', sans-serif;
    }
    &[data-value='DotumChe']::before {
      content: '돋움체';
      font-family: 'DotumChe', sans-serif;
    }
    &[data-value='Gulim']::before {
      content: '굴림';
      font-family: 'Gulim', sans-serif;
    }
    &[data-value='GulimChe']::before {
      content: '굴림체';
      font-family: 'GulimChe', sans-serif;
    }
    &[data-value='Batang']::before {
      content: '바탕';
      font-family: 'Batang', serif;
    }
    &[data-value='BatangChe']::before {
      content: '바탕체';
      font-family: 'BatangChe', serif;
    }
    &[data-value='Gungsuh']::before {
      content: '궁서';
      font-family: 'Gungsuh', serif;
    }
    &[data-value='Malgun Gothic']::before {
      content: '맑은고딕';
      font-family: 'Malgun Gothic', sans-serif;
    }
    &[data-value='Nanum Gothic']::before {
      content: '나눔고딕';
      font-family: 'Nanum Gothic', sans-serif;
    }
    &[data-value='Arial']::before {
      content: 'Arial';
      font-family: 'Arial', sans-serif;
    }
    &[data-value='Comic Sans MS']::before {
      content: 'Comic Sans MS';
      font-family: 'Comic Sans MS', cursive;
    }
    &[data-value='Courier New']::before {
      content: 'Courier New';
      font-family: 'Courier New', monospace;
    }
    &[data-value='Georgia']::before {
      content: 'Georgia';
      font-family: 'Georgia', serif;
    }
    &[data-value='Lucida Sans Unicode']::before {
      content: 'Lucida Sans Unicode';
      font-family: 'Lucida Sans Unicode', sans-serif;
    }
    &[data-value='Tahoma']::before {
      content: 'Tahoma';
      font-family: 'Tahoma', sans-serif;
    }
    &[data-value='Times New Roman']::before {
      content: 'Times New Roman';
      font-family: 'Times New Roman', serif;
    }
    &[data-value='Trebuchet MS']::before {
      content: 'Trebuchet MS';
      font-family: 'Trebuchet MS', sans-serif;
    }
    &[data-value='Verdana']::before {
      content: 'Verdana';
      font-family: 'Verdana', sans-serif;
    }

    // false 값(기본값)에 대한 처리
    &[data-value='false']::before {
      content: '글꼴';
    }
  }

  // 선택된 항목의 표시 텍스트 설정
  .ql-picker-label {
    text-indent: -9999px;
    position: relative;
    padding: 6px 12px !important;
    overflow: hidden;

    &::before {
      text-indent: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: calc(100% - 30px);
      height: 100%;
      display: flex;
      align-items: center;
      padding: 6px 12px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &[data-value='Dotum']::before {
      content: '돋움';
    }
    &[data-value='DotumChe']::before {
      content: '돋움체';
    }
    &[data-value='Gulim']::before {
      content: '굴림';
    }
    &[data-value='GulimChe']::before {
      content: '굴림체';
    }
    &[data-value='Batang']::before {
      content: '바탕';
    }
    &[data-value='BatangChe']::before {
      content: '바탕체';
    }
    &[data-value='Gungsuh']::before {
      content: '궁서';
    }
    &[data-value='Malgun Gothic']::before {
      content: '맑은고딕';
    }
    &[data-value='Nanum Gothic']::before {
      content: '나눔고딕';
    }
    &[data-value='Arial']::before {
      content: 'Arial';
    }
    &[data-value='Comic Sans MS']::before {
      content: 'Comic Sans MS';
    }
    &[data-value='Courier New']::before {
      content: 'Courier New';
    }
    &[data-value='Georgia']::before {
      content: 'Georgia';
    }
    &[data-value='Lucida Sans Unicode']::before {
      content: 'Lucida Sans Unicode';
    }
    &[data-value='Tahoma']::before {
      content: 'Tahoma';
    }
    &[data-value='Times New Roman']::before {
      content: 'Times New Roman';
    }
    &[data-value='Trebuchet MS']::before {
      content: 'Trebuchet MS';
    }
    &[data-value='Verdana']::before {
      content: 'Verdana';
    }

    // false 값(기본값)에 대한 처리
    &[data-value='false']::before {
      content: '글꼴';
    }

    // 기본 상태일 때 글꼴 표시
    &:not([data-value])::before {
      content: '글꼴';
    }
  }
}
</style>
