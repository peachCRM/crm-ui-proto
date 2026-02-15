# TinyMCE 에디터 컴포넌트

로컬 TinyMCE를 사용한 리치 텍스트 에디터 컴포넌트입니다.

## 🚀 빠른 시작 (Quick Start)

### 1. 설치

```bash
npm install tinymce
# 또는
bun add tinymce
```

### 2. 스킨 파일 복사

```bash
# 프로젝트 루트에서 실행
cp -r node_modules/tinymce/skins public/tinymce/
cp -r node_modules/tinymce/icons public/tinymce/
```

### 3. Vite 설정 (`vite.config.ts`)

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['tinymce']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tinymce: ['tinymce']
        }
      }
    }
  }
});
```

### 4. 사용

```vue
<template>
  <tiny-editor v-model="content" :height="400" />
</template>

<script setup lang="ts">
import TinyEditor from '~/modules/_common/components/tinymce/tiny-editor.vue';
const content = ref('<p>초기 내용</p>');
</script>
```

---

## 📁 파일 구조

```
public/tinymce/                       # TinyMCE 정적 파일
├── skins/ui/oxide/                   # 에디터 UI 스킨
├── skins/content/default/            # 에디터 컨텐츠 스타일
├── plugins/                          # 플러그인 파일들
└── themes/silver/                    # 실버 테마

src/modules/_common/components/tinymce/
├── tiny-editor.vue                   # 기본 TinyMCE 에디터 컴포넌트
└── tiny-editor-api.vue               # Cloud API 버전 (참고용)

src/modules/test-data/components/tinymce/
└── p-test-data-editor-tinymce.vue    # 파일 업로드 기능 포함 래퍼 컴포넌트
```

## 🚀 기본 사용법

### 1. 기본 에디터 (파일 업로드 없음)

```vue
<template>
  <tiny-editor v-model="content" :height="400" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TinyEditor from '~/modules/_common/components/tinymce/tiny-editor.vue';

const content = ref('<p>초기 내용</p>');
</script>
```

### 2. 파일 업로드 지원 에디터

```vue
<template>
  <p-test-data-editor-tinymce
    ref="editorRef"
    v-model="content"
    :is-file="true"
    :file-list="fileList"
    :height="400"
    :max-files="10"
    :max-file-size="100 * 1024 * 1024"
    @set-files="handleSetFiles"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PTestDataEditorTinymce from '~/modules/test-data/components/tinymce/p-test-data-editor-tinymce.vue';
import type { TestDataFile } from '~/modules/test-data/type/test-data.type';

const editorRef = ref<InstanceType<typeof PTestDataEditorTinymce> | null>(null);
const content = ref('<p>초기 내용</p>');
const fileList = ref<TestDataFile[]>([]);

const handleSetFiles = (files: TestDataFile[]) => {
  fileList.value = files;
};
</script>
```

## 🎨 Props

### tiny-editor.vue Props

| Prop               | Type       | Default               | Description             |
| ------------------ | ---------- | --------------------- | ----------------------- |
| `modelValue`       | `string`   | `''`                  | 에디터 내용 (v-model)   |
| `height`           | `number`   | `360`                 | 에디터 높이 (px)        |
| `isFile`           | `boolean`  | `false`               | 파일 업로드 모드 활성화 |
| `maxFileSize`      | `number`   | `100MB`               | 최대 파일 크기          |
| `allowedFileTypes` | `string[]` | `['image/jpeg', ...]` | 허용 파일 타입          |

### p-test-data-editor-tinymce.vue Props

| Prop          | Type             | Default                 | Description             |
| ------------- | ---------------- | ----------------------- | ----------------------- |
| `modelValue`  | `string`         | `'<p></p>'`             | 에디터 내용 (v-model)   |
| `isFile`      | `boolean`        | `false`                 | 파일 업로드 기능 활성화 |
| `fileList`    | `TestDataFile[]` | `[]`                    | 업로드된 파일 목록      |
| `height`      | `number`         | `360`                   | 에디터 높이 (px)        |
| `maxFiles`    | `number`         | `5`                     | 최대 파일 개수          |
| `maxFileSize` | `number`         | `100MB`                 | 최대 파일 크기          |
| `accept`      | `string`         | `'.jpg,.jpeg,.png,...'` | 파일 입력 accept 속성   |

## 📤 Emits

### tiny-editor.vue Emits

| Event               | Payload                    | Description             |
| ------------------- | -------------------------- | ----------------------- |
| `update:modelValue` | `string`                   | 에디터 내용 변경        |
| `toolbarClick`      | `{ selectedText: string }` | 커스텀 버튼 클릭        |
| `imageButtonClick`  | `(callback: Function)`     | 이미지 버튼 클릭 (콜백) |
| `upload-file`       | `File[]`                   | 파일 업로드 요청        |

### p-test-data-editor-tinymce.vue Emits

| Event               | Payload          | Description        |
| ------------------- | ---------------- | ------------------ |
| `update:modelValue` | `string`         | 에디터 내용 변경   |
| `set-files`         | `TestDataFile[]` | 파일 목록 업데이트 |

## 🔧 공개 메서드

### tiny-editor.vue

```typescript
// 이미지 삽입
editorRef.value?.insertImage({
  url: 'https://example.com/image.jpg',
  alt: '이미지 설명',
  width: 800,
  height: 600
});

// 파일 링크 삽입 (HTML 문자열)
editorRef.value?.insertFile('<a href="https://example.com/document.pdf">문서.pdf</a>');

// HTML 추가 (마지막에 추가)
editorRef.value?.addHtml('<p>추가 내용</p>', true);

// HTML 추가 (커서 위치에 추가)
editorRef.value?.addHtml('<p>커서 위치 내용</p>', false);

// 이미지 제거
editorRef.value?.removeImageBySrc('https://example.com/image.jpg');

// 링크 제거
editorRef.value?.removeLinkByHref('https://example.com/document.pdf');

// 에디터 내용 가져오기
const content = editorRef.value?.getContent();
```

### p-test-data-editor-tinymce.vue

동일한 메서드를 제공하며, 내부적으로 `tiny-editor.vue`를 래핑합니다.

## 🎯 주요 기능

### 1. 툴바 커스터마이징

- **기본 모드 (`isFile: false`)**: 표준 이미지 버튼 사용
- **파일 모드 (`isFile: true`)**: 커스텀 이미지 버튼 (파일 업로드 컴포넌트와 연동)

```typescript
// tiny-editor.vue의 toolbar 설정
toolbar: props.isFile
  ? 'fontfamily fontsize | bold italic underline strikethrough | ' +
    'forecolor backcolor | ' +
    'link customImageButton table | ...' // 커스텀 이미지 버튼
  : 'fontfamily fontsize | bold italic underline strikethrough | ' +
    'forecolor backcolor | ' +
    'link image table | ...'; // 기본 이미지 버튼
```

### 2. 이미지 업로드

#### 드래그 앤 드롭

에디터 영역에 이미지 파일을 드래그하면 자동으로 `upload-file` 이벤트 발생

```typescript
editor.on('drop', (e: DragEvent) => {
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
  if (imageFiles.length > 0) {
    e.preventDefault();
    emit('upload-file', imageFiles);
  }
});
```

#### 클립보드 붙여넣기

이미지를 복사하여 Ctrl+V로 붙여넣기 가능

```typescript
editor.on('paste', (e: ClipboardEvent) => {
  const imageItems = /* 이미지 파일 추출 */;
  if (imageItems.length > 0) {
    e.preventDefault();
    emit('upload-file', imageItems);
  }
});
```

#### 툴바 버튼

`isFile: true`일 때 커스텀 이미지 버튼 제공

```typescript
editor.ui.registry.addButton('customImageButton', {
  icon: 'image',
  tooltip: '이미지 삽입',
  onAction: () => {
    emit('imageButtonClick', (data: ImageInsertData) => {
      insertImage(data);
    });
  }
});
```

### 3. 파일 관리

- 업로드된 파일은 `fileList`로 관리
- 파일 삭제 시 에디터 내 이미지/링크도 자동 제거
- LOCAL/S3 스토리지 지원

## 🔍 이벤트 플로우

### 이미지 업로드 플로우

```
사용자 이미지 삽입
    ↓
[드래그/붙여넣기/버튼 클릭]
    ↓
tiny-editor: upload-file emit
    ↓
p-test-data-editor-tinymce
    ↓
p-test-data-file-upload
    ↓
서버 업로드 (API 호출)
    ↓
editor-add emit (업로드 완료)
    ↓
insertImage 호출
    ↓
에디터에 이미지 삽입
```

### 파일 삭제 플로우

```
사용자 파일 삭제 버튼 클릭
    ↓
file-delete emit
    ↓
isImage 체크
    ↓
removeImageBySrc (이미지인 경우)
or
removeLinkByHref (링크인 경우)
    ↓
에디터 DOM에서 제거
    ↓
update:modelValue emit
    ↓
에디터 내용 업데이트
```

## ⚙️ 설정

### 1. 설치 및 초기 설정

#### 1-1. TinyMCE 설치

```bash
npm install tinymce
# 또는
bun add tinymce
```

#### 1-2. Public 폴더에 스킨 파일 복사

TinyMCE 스킨 파일을 `public/tinymce/` 폴더로 복사해야 합니다:

```bash
# 프로젝트 루트에서 실행
cp -r node_modules/tinymce/skins public/tinymce/
cp -r node_modules/tinymce/icons public/tinymce/
```

또는 수동으로 다음 파일들을 복사:

```bash
# 스킨 파일
node_modules/tinymce/skins/ → public/tinymce/skins/

# 아이콘 파일
node_modules/tinymce/icons/ → public/tinymce/icons/

# 플러그인 파일 (필요한 경우)
node_modules/tinymce/plugins/ → public/tinymce/plugins/
```

#### 1-3. Vite 설정 추가

`vite.config.ts`에 TinyMCE 최적화 설정을 추가합니다:

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],

  // TinyMCE 최적화
  optimizeDeps: {
    include: ['tinymce']
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // TinyMCE를 별도 청크로 분리
          tinymce: ['tinymce']
        }
      }
    }
  }
});
```

**설정 설명:**

- `optimizeDeps.include`: TinyMCE를 사전 번들링하여 개발 서버 시작 속도 향상
- `manualChunks`: TinyMCE를 별도 청크로 분리하여 번들 크기 최적화

### 2. 로컬 TinyMCE 파일 구조

```
public/tinymce/
├── skins/
│   ├── ui/oxide/                   # 에디터 UI 스킨
│   │   ├── skin.min.css
│   │   └── content.min.css
│   └── content/default/            # 에디터 컨텐츠 스타일
│       └── content.min.css
├── plugins/                        # 플러그인들
│   ├── anchor/
│   ├── autolink/
│   ├── charmap/
│   ├── codesample/
│   ├── emoticons/
│   ├── image/
│   ├── link/
│   ├── lists/
│   ├── searchreplace/
│   ├── table/
│   ├── visualblocks/
│   ├── wordcount/
│   └── code/
└── themes/silver/                  # 실버 테마
    └── theme.min.js
```

### 3. TinyMCE 초기화 설정

```typescript
tinymce.init({
  target: editorRef.value,
  license_key: 'gpl', // GPL 라이선스
  height: props.height,
  menubar: false,
  toolbar_mode: 'sliding',

  // ⚠️ 중요: Public 폴더 경로 지정
  skin_url: '/tinymce/skins/ui/oxide', // 스킨 경로
  content_css: '/tinymce/skins/content/default/content.css', // 컨텐츠 CSS

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

  // 자동 업로드 비활성화 (수동 처리)
  automatic_uploads: false,
  paste_data_images: false,

  // 초기값
  initialValue: props.modelValue
});
```

**중요 포인트:**

- `skin_url`과 `content_css`는 반드시 `public/tinymce/` 경로를 참조해야 합니다
- 경로는 `/`로 시작하여 public 폴더 기준 절대 경로로 작성합니다

### 4. 플러그인 Import

컴포넌트에서 필요한 플러그인을 import 합니다:

```typescript
import tinymce from 'tinymce/tinymce';

// 필수 파일
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/models/dom';

// 플러그인
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis'; // 이모티콘 데이터
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
```

**주의사항:**

- 플러그인은 `node_modules`에서 import합니다
- 스킨과 아이콘은 `public` 폴더에서 로드됩니다
- 사용하지 않는 플러그인은 import하지 않아 번들 크기를 줄일 수 있습니다

### 5. 폰트 설정

```typescript
// 한국어 폰트 포함
font_family_formats: 'Pretendard=Pretendard, sans-serif; ' +
  '궁서체=궁서체, sans-serif; ' +
  '나눔고딕=나눔고딕, sans-serif; ' +
  '나눔명조=나눔명조, sans-serif; ' +
  'Gulim=Gulim, sans-serif; ' +
  // ... 기타 폰트

  // 초기화 시 기본 폰트 설정
  editor.on('init', () => {
    editor.getBody().style.fontFamily = '"Pretendard", sans-serif';
  });
```

## 🚨 주의사항

### 1. 파일 크기 제한

```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

if (file.size > MAX_FILE_SIZE) {
  console.error('파일 크기가 너무 큽니다.');
  return;
}
```

### 2. 파일 타입 검증

```typescript
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

if (!ALLOWED_TYPES.includes(file.type)) {
  console.error('지원하지 않는 파일 형식입니다.');
  return;
}
```

### 3. 에디터 정리 (메모리 누수 방지)

```typescript
onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
    editorInstance.value = null;
  }
});
```

### 4. v-model 동기화

```typescript
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

// 에디터 내용 변경 시 emit
editor.on('change keyup undo redo', () => {
  emit('update:modelValue', editor.getContent());
});
```

### 5. 로컬 파일 경로 설정

반드시 `public/tinymce/` 경로에 TinyMCE 정적 파일이 있어야 합니다.

```typescript
skin_url: '/tinymce/skins/ui/oxide',              // ✅ 올바른 경로
content_css: '/tinymce/skins/content/default/content.css'  // ✅ 올바른 경로

// ❌ 잘못된 경로
skin_url: 'node_modules/tinymce/skins/ui/oxide'   // 빌드 시 경로 오류
```

## 📊 비교: Cloud vs Local

| 항목                | Cloud API     | Local        |
| ------------------- | ------------- | ------------ |
| **설정 난이도**     | 쉬움          | 중간         |
| **번들 크기**       | 작음          | 큼 (약 1MB+) |
| **네트워크 의존성** | 있음          | 없음         |
| **로딩 속도**       | 느림 (CDN)    | 빠름 (로컬)  |
| **커스터마이징**    | 제한적        | 자유로움     |
| **비용**            | Free tier     | 무료         |
| **버전 관리**       | 자동 업데이트 | 수동 관리    |
| **오프라인 지원**   | 불가          | 가능         |

## 🔗 참고 자료

- [TinyMCE 공식 문서](https://www.tiny.cloud/docs/)
- [TinyMCE Vue Integration](https://www.tiny.cloud/docs/integrations/vue/)
- [TinyMCE Self-hosted](https://www.tiny.cloud/docs/tinymce/latest/vue-zip/)
- [TinyMCE GitHub](https://github.com/tinymce/tinymce)

## 📝 사용 예시

### 기본 에디터

```vue
<template>
  <div>
    <tiny-editor v-model="content" :height="500" />
    <UButton @click="saveContent">저장</UButton>
  </div>
</template>

<script setup lang="ts">
const content = ref('<p>초기 내용</p>');

const saveContent = () => {
  console.log('에디터 내용:', content.value);
  // API 호출 등
};
</script>
```

### 파일 업로드 에디터

```vue
<template>
  <div>
    <p-test-data-editor-tinymce
      ref="editorRef"
      v-model="formData.content"
      :is-file="true"
      :file-list="formData.files"
      :height="500"
      :max-files="10"
      @set-files="handleSetFiles"
    />

    <UButton @click="submitForm">제출</UButton>
  </div>
</template>

<script setup lang="ts">
const editorRef = ref();
const formData = reactive({
  content: '<p></p>',
  files: []
});

const handleSetFiles = (files: TestDataFile[]) => {
  formData.files = files;
};

const submitForm = async () => {
  const data = {
    content: formData.content,
    fileIds: formData.files.map((f) => f.id)
  };

  // API 호출
  await apiService.post('/api/submit', data);
};
</script>
```
