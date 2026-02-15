<template>
  <div>
    <Editor
      ref="editorRef"
      api-key="yy04votu7ob8ncocyk9y6uou4jjhx4z8fa7g8wbvm5bhya22"
      :init="init"
      :initial-value="modelValue"
      :model-value="modelValue"
      @update:model-value="handleUpdate"
    />

    <!-- 파일 업로드 슬롯 -->
    <slot name="file-upload" :insertFile="insertFile" :uploadFile="editorUploadFile" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';

// TinyMCE 에디터 타입 정의
interface TinyMCEEditor {
  selection: {
    getContent: (options?: { format?: string }) => string;
    getNode: () => Node;
  };
  insertContent: (content: string) => void;
  setContent: (content: string) => void;
  getContent: () => string;
  getBody: () => HTMLElement;
  ui: {
    registry: {
      addButton: (name: string, spec: any) => void;
      addMenuButton: (name: string, spec: any) => void;
    };
  };
  on: (event: string, callback: (e: any) => void) => void;
  off: (event: string, callback: (e: any) => void) => void;
}

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
}

// Props 및 Emits 정의
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: 360,
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
  ]
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'toolbarClick', payload: { selectedText: string }): void;
  (e: 'imageButtonClick', callback: (data: ImageInsertData) => void): void;
  (e: 'upload-file', files: File[]): void;
}>();

const editorRef = ref<any>(null);
const editorInstance = ref<TinyMCEEditor | null>(null);

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
    return editorInstance.value;
  }

  // editorRef에서 접근 시도
  if (editorRef.value?.editor) {
    editorInstance.value = editorRef.value.editor;
    return editorInstance.value;
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

// TinyMCE 설정 (Cloud API 사용)
const init = computed(() => ({
  height: props.height,
  menubar: false,
  toolbar_mode: 'sliding',
  skin: 'snow',
  license_key: 'GPL',
  // TinyMCE Cloud 플러그인 사용
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
  toolbar: props.isFile
    ? 'fontfamily fontsize | bold italic underline strikethrough | ' +
      'forecolor backcolor | ' +
      'link customImageButton table | align lineheight | numlist bullist indent outdent | ' +
      'emoticons charmap | code'
    : 'fontfamily fontsize | bold italic underline strikethrough | ' +
      'forecolor backcolor | ' +
      'link image table | align lineheight | numlist bullist indent outdent | ' +
      'emoticons charmap | code | myCustomButton',
  // 자동 업로드 비활성화 (수동으로 처리)
  automatic_uploads: false,
  font_family_formats:
    'Pretendard=Pretendard, sans-serif; 궁서체=궁서체, sans-serif; 나눔고딕=나눔고딕, sans-serif; 나눔명조=나눔명조, sans-serif; Gulim=Gulim, sans-serif; GulimChe=GulimChe, sans-serif; Batang=Batang, sans-serif; BatangChe=BatangChe, sans-serif; Gungsuh=Gungsuh, sans-serif; Malgun Gothic=Malgun Gothic, sans-serif; Nanum Gothic=Nanum Gothic, sans-serif; Arial=Arial, sans-serif; Comic Sans MS=Comic Sans MS, sans-serif; Courier New=Courier New, sans-serif; Georgia=Georgia, sans-serif; Lucida Sans Unicode=Lucida Sans Unicode, sans-serif; Tahoma=Tahoma, sans-serif; Times New Roman=Times New Roman, sans-serif; Trebuchet MS=Trebuchet MS, sans-serif; Verdana=Verdana, sans-serif;',
  // 붙여넣기 시 이미지 데이터를 허용하지 않음 (우리가 직접 처리)
  paste_data_images: false,
  // setup 콜백에서 커스텀 버튼 등록
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
      fetch: (
        callback: (items: Array<{ type: string; text: string; onAction: () => void }>) => void
      ) => {
        const items = [
          {
            type: 'menuitem',
            text: 'Insert Date',
            onAction: () => editor.insertContent(new Date().toLocaleString())
          },
          {
            type: 'menuitem',
            text: 'Insert Hello',
            onAction: () => editor.insertContent('Hello!')
          }
        ];
        callback(items);
      }
    });

    editor.on('init', () => {
      editor.getBody().style.fontFamily = '"Pretendard", sans-serif';
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
}));

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
