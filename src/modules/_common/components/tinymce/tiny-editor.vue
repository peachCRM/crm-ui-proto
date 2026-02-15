<template>
  <div :class="['tinymce-wrapper']">
    <!-- TinyMCE 에디터 -->
    <div v-show="currentMode === 'editor'">
      <textarea ref="editorRef" :value="modelValue"></textarea>
    </div>

    <!-- HTML 편집 모드 -->
    <textarea
      v-show="currentMode === 'html'"
      v-model="htmlContent"
      :style="{ height: `${height}px` }"
      :class="[
        'block w-full px-3 py-2.5',
        'font-mono text-[13px] leading-relaxed',
        'bg-white text-gray-800',
        'border border-gray-300 rounded border-b-0 rounded-b-none',
        'focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400',
        'resize-none'
      ]"
      spellcheck="false"
      @input="handleHtmlChange"
    />

    <!-- 모드 전환 (하단 왼쪽) -->
    <div :class="['', 'bg-gray-50 border border-gray-200  rounded-b', 'text-xs flex']">
      <div
        :class="[
          'px-2 py-2 border-r border-gray-200 rounded-bl-md',
          'flex items-center gap-1',
          'font-medium transition-all duration-150 cursor-pointer',
          currentMode === 'editor'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        ]"
        @click="switchMode('editor')"
      >
        <svg :class="['w-3 h-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>에디터 모드</span>
      </div>
      <div
        :class="[
          'px-2 py-2 border-r border-gray-200',
          'flex items-center gap-1',
          'font-medium transition-all duration-150 cursor-pointer',
          currentMode === 'html'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        ]"
        @click="switchMode('html')"
      >
        <svg :class="['w-3 h-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span>HTML 모드</span>
      </div>
      <!-- <span
        :class="[
          'inline-flex items-center gap-1 px-2 py-1 rounded',
          'font-medium transition-all duration-150 cursor-pointer',
          currentMode === 'editor'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        ]"
        @click="switchMode('editor')"
      >
        <svg :class="['w-3 h-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>에디터 모드</span>
      </span>
      <span :class="['px-1.5 text-gray-400']">|</span>
      <span
        :class="[
          'inline-flex items-center gap-1 px-2 py-1 rounded',
          'font-medium transition-all duration-150 cursor-pointer',
          currentMode === 'html'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        ]"
        @click="switchMode('html')"
      >
        <svg :class="['w-3 h-3']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span>HTML 모드</span>
      </span> -->
    </div>

    <!-- 파일 업로드 슬롯 -->
    <slot name="file-upload" :insertFile="insertFile" :uploadFile="editorUploadFile" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import tinymce from 'tinymce/tinymce';
import type { Editor as TinyMCEEditor } from 'tinymce';

// 필요한 테마와 플러그인 import
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/models/dom';

// 필요한 플러그인들
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';

// Emoticons 플러그인 데이터
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce-i18n/langs6/ko_KR';

interface ImageInsertData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface Props {
  modelValue?: string;
  height?: number;
  isFile?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  contentStyle?: string;
}

// Props 및 Emits 정의
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 450,
  isFile: false,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFileTypes: () => [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  contentStyle: 'body { font-size: 12pt; }'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'toolbarClick', payload: { selectedText: string }): void;
  (e: 'imageButtonClick', callback: (data: ImageInsertData) => void): void;
  (e: 'upload-file', files: File[]): void;
}>();

const editorRef = ref<HTMLTextAreaElement | null>(null);
const editorInstance = ref<TinyMCEEditor | null>(null);
const currentMode = ref<'editor' | 'html'>('editor');
const htmlContent = ref<string>('');

// 에디터 값 업데이트 처리
function handleUpdate(value: string) {
  emit('update:modelValue', value);
}

// 파일 업로드 함수 (slot에서 사용)
const editorUploadFile = (files: File[]) => {
  emit('upload-file', files);
};

// 에디터 인스턴스 가져오기 헬퍼 함수
function getEditor(): TinyMCEEditor | null {
  if (editorInstance.value) {
    return editorInstance.value as TinyMCEEditor;
  }

  console.warn('TinyMCE 에디터가 아직 초기화되지 않았습니다.');
  return null;
}

// 커스텀 버튼 클릭 핸들러
function handleCustomButtonClick(editor: TinyMCEEditor) {
  const selected = editor.selection.getContent({ format: 'text' });
  emit('toolbarClick', { selectedText: selected });
  editor.insertContent(`<strong>Inserted by custom button</strong>`);
}

// 이미지 삽입 함수
function insertImage(data: ImageInsertData) {
  const editor = getEditor();
  if (!editor) {
    console.error('에디터를 찾을 수 없습니다.');
    return;
  }

  let imgHtml = `<img src="${data.url}" alt="${data.alt || ''}"`;
  if (data.width) imgHtml += ` width="${data.width}"`;
  if (data.height) imgHtml += ` height="${data.height}"`;
  imgHtml += ' />';

  editor.insertContent(imgHtml);
}

// 파일 링크 삽입 함수 (HTML 문자열 직접 삽입)
function insertFile(htmlContent: string) {
  const editor = getEditor();
  if (!editor) {
    console.error('에디터를 찾을 수 없습니다. HTML:', htmlContent);
    return;
  }

  console.log('에디터에 HTML 삽입:', htmlContent);
  editor.insertContent(htmlContent);
}

// 이미지를 src로 제거
function removeImageBySrc(src: string) {
  const editor = getEditor();
  if (!editor) return;

  const body = editor.getBody();
  const images = body.querySelectorAll('img');
  images.forEach((img) => {
    if (img.src === src) {
      img.remove();
    }
  });

  // 변경사항 저장
  emit('update:modelValue', editor.getContent());
}

// 링크를 href로 제거
function removeLinkByHref(href: string) {
  const editor = getEditor();
  if (!editor) return;

  const body = editor.getBody();
  const links = body.querySelectorAll('a');
  links.forEach((link) => {
    if (link.href === href) {
      link.remove();
    }
  });

  // 변경사항 저장
  emit('update:modelValue', editor.getContent());
}

// HTML 추가 함수
function addHtml(html: string, isLast = true) {
  const editor = getEditor();
  if (!editor) return;

  if (isLast) {
    const currentContent = editor.getContent();
    editor.setContent(currentContent + html);
  } else {
    editor.insertContent(html);
  }
}

// 에디터 내용 가져오기
function getContent(): string {
  const editor = getEditor();
  if (!editor) return '';
  return editor.getContent();
}

// 모드 전환 함수
function switchMode(mode: 'editor' | 'html') {
  const editor = getEditor();
  if (!editor) return;

  if (mode === 'html') {
    // 에디터 → HTML 모드: 에디터 내용을 HTML textarea에 복사
    htmlContent.value = editor.getContent();
  } else {
    // HTML → 에디터 모드: HTML textarea 내용을 에디터에 반영
    editor.setContent(htmlContent.value);
    handleUpdate(htmlContent.value);
  }

  currentMode.value = mode;
}

// HTML textarea 변경 핸들러
function handleHtmlChange(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  htmlContent.value = target.value;
  handleUpdate(target.value);
}

// TinyMCE 초기화
onMounted(() => {
  if (!editorRef.value) return;

  tinymce.init({
    target: editorRef.value,
    language: 'ko_KR',
    license_key: 'gpl',
    height: props.height,
    menubar: false,
    toolbar_mode: 'sliding',
    skin_url: '/tinymce/skins/ui/oxide',
    content_css: '/tinymce/skins/content/default/content.css',
    content_style: props.contentStyle,

    // 플러그인 설정
    plugins: [
      'anchor',
      'autolink',
      'charmap',
      'codesample',
      'emoticons',
      'image',
      'link',
      'lists',
      'searchreplace',
      'table',
      'visualblocks',
      'wordcount',
      'code'
    ].join(' '),

    // 툴바 설정
    toolbar: props.isFile
      ? 'fontfamily fontsize | bold italic underline strikethrough | ' +
        'forecolor backcolor | ' +
        'align lineheight | link customImageButton table | numlist bullist indent outdent | ' +
        'emoticons charmap'
      : 'fontfamily fontsize | bold italic underline strikethrough | ' +
        'forecolor backcolor | ' +
        'align lineheight | link table | numlist bullist indent outdent | ' +
        'emoticons charmap ',

    // 자동 업로드 비활성화 (수동으로 처리)
    automatic_uploads: false,

    // 폰트 패밀리 설정
    font_family_formats:
      'Pretendard=Pretendard, sans-serif; 궁서체=궁서체, sans-serif; 나눔고딕=나눔고딕, sans-serif; 나눔명조=나눔명조, sans-serif; Gulim=Gulim, sans-serif; GulimChe=GulimChe, sans-serif; Batang=Batang, sans-serif; BatangChe=BatangChe, sans-serif; Gungsuh=Gungsuh, sans-serif; Malgun Gothic=Malgun Gothic, sans-serif; Nanum Gothic=Nanum Gothic, sans-serif; Arial=Arial, sans-serif; Comic Sans MS=Comic Sans MS, sans-serif; Courier New=Courier New, sans-serif; Georgia=Georgia, sans-serif; Lucida Sans Unicode=Lucida Sans Unicode, sans-serif; Tahoma=Tahoma, sans-serif; Times New Roman=Times New Roman, sans-serif; Trebuchet MS=Trebuchet MS, sans-serif; Verdana=Verdana, sans-serif;',

    // 붙여넣기 시 이미지 데이터를 허용하지 않음 (우리가 직접 처리)
    paste_data_images: false,

    // 초기값 설정
    initialValue: props.modelValue,

    // setup 콜백에서 커스텀 버튼 및 이벤트 등록
    setup: (editor: TinyMCEEditor) => {
      // 에디터 인스턴스 저장
      editorInstance.value = editor;

      // 커스텀 이미지 버튼 (파일 업로드 모드일 때만)
      if (props.isFile) {
        editor.ui.registry.addButton('customImageButton', {
          icon: 'image',
          tooltip: '이미지 삽입',
          onAction: () => {
            // 부모 컴포넌트로 이벤트 emit
            emit('imageButtonClick', (data: ImageInsertData) => {
              insertImage(data);
            });
          }
        });
      }

      // 커스텀 버튼 등록
      editor.ui.registry.addButton('myCustomButton', {
        text: 'MyBtn',
        tooltip: 'My custom action',
        onAction: () => handleCustomButtonClick(editor)
      });

      // 드롭다운 메뉴 버튼 등록 (필요시)
      editor.ui.registry.addMenuButton('myMenuButton', {
        text: 'More',
        fetch: (callback) => {
          const items = [
            {
              type: 'menuitem' as const,
              text: 'Insert Date',
              onAction: () => editor.insertContent(new Date().toLocaleString())
            },
            {
              type: 'menuitem' as const,
              text: 'Insert Hello',
              onAction: () => editor.insertContent('Hello!')
            }
          ];
          callback(items);
        }
      });

      // 에디터 초기화 시 폰트 설정
      editor.on('init', () => {
        editor.getBody().style.fontFamily = '"Pretendard", sans-serif';
      });

      // 에디터 내용 변경 시 emit
      editor.on('change keyup undo redo', () => {
        handleUpdate(editor.getContent());
      });

      // 드래그 앤 드롭 이벤트
      editor.on('drop', (e: DragEvent) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
          if (imageFiles.length > 0) {
            // 기본 동작 방지 (TinyMCE의 자동 이미지 삽입 막기)
            e.preventDefault();
            e.stopPropagation();

            console.log('드래그앤드롭 이미지 감지, 업로드 시작:', imageFiles.length, '개');
            emit('upload-file', imageFiles);
          }
        }
      });

      // 붙여넣기 이벤트
      editor.on('paste', (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (items) {
          const imageItems: File[] = [];
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) imageItems.push(file);
            }
          }

          if (imageItems.length > 0) {
            // 기본 동작 방지 (TinyMCE의 자동 이미지 삽입 막기)
            e.preventDefault();
            e.stopPropagation();

            console.log('붙여넣기 이미지 감지, 업로드 시작:', imageItems.length, '개');
            emit('upload-file', imageItems);
          }
        }
      });
    }
  });
});

// modelValue 변경 감지
watch(
  () => props.modelValue,
  (newValue) => {
    const editor = getEditor();
    if (editor && editor.getContent() !== newValue) {
      editor.setContent(newValue || '');
    }
  }
);

// 컴포넌트 언마운트 시 에디터 정리
onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
    editorInstance.value = null;
  }
});

// 외부 노출 메서드
defineExpose({
  insertImage,
  insertFile,
  removeImageBySrc,
  removeLinkByHref,
  addHtml,
  getContent
});
</script>

<style scoped>
.tinymce-wrapper :deep(.tox-tinymce) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}
</style>
