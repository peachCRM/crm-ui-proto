# TailwindCSS v4 + NuxtUI v4 구현 가이드

## 프로젝트 환경

> **중요**: 이 프로젝트는 Nuxt 없이 **순수 Vue 3 + Vite** 환경에서 NuxtUI v4를 사용합니다.

### 기술 스택

- Vue 3.5.16 (Composition API + `<script setup>`)
- Vite 6.3.5
- TailwindCSS v4.1.4
- NuxtUI v4.0.1 (Vite 플러그인)
- Pinia 3.0.1
- vue3-easy-data-table 1.5.47

---

## TailwindCSS v4 핵심 변경사항

**2025년 1월 22일 정식 출시**

### 성능 개선

- 풀 빌드: 3.5-5x 빠름
- 인크리멘탈 빌드: 8-100x+ 빠름

### CSS-First 설정 (@theme 지시어)

```css
/* tailwind.config.js 대신 CSS로 설정 */
@import 'tailwindcss';

@theme {
  --font-display: 'Pretendard', 'sans-serif';
  --breakpoint-3xl: 1920px;
  --color-brand-500: oklch(0.55 0.18 250);
  --spacing: 0.25rem;
  --radius-xl: 0.75rem;
}
```

---

## 테마 변수 네임스페이스

| 네임스페이스     | 생성 유틸리티                   |
| ---------------- | ------------------------------- |
| `--color-*`      | `bg-*`, `text-*`, `border-*` 등 |
| `--font-*`       | `font-*`                        |
| `--spacing-*`    | `p-*`, `m-*`, `w-*`, `h-*`      |
| `--radius-*`     | `rounded-*`                     |
| `--breakpoint-*` | 반응형 변형                     |

---

## v3 → v4 주요 변경

| v3                         | v4             | 비고                 |
| -------------------------- | -------------- | -------------------- |
| `bg-gradient-*`            | `bg-linear-*`  | 그라데이션 문법 변경 |
| `border` 기본값 `gray-200` | `currentColor` | 명시적 색상 필요     |
| `ring` 기본 두께 `3px`     | `1px`          | 두께 명시 필요       |
| RGB/HSL                    | **oklch**      | 색상 포맷 기본값     |

---

## NuxtUI v4 설정 (Vite 플러그인)

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';
import tailwindcssVite from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcssVite(),
    ui({
      ui: {
        // 색상 설정
        colors: {
          primary: 'customblue', // 프로젝트 커스텀 파란색
          secondary: 'green',
          neutral: 'gray'
        },
        // 알림 위치
        notifications: {
          position: 'top-right'
        },
        // 컴포넌트별 커스터마이징
        formField: {
          slots: {
            label: 'text-md text-gray-500'
          }
        },
        input: {
          slots: {
            root: 'w-full'
          },
          defaultVariants: {
            size: 'md'
          }
        },
        button: {
          slots: {
            base: 'cursor-pointer !ring-gray-200 !border-gray-200'
          },
          variants: {
            size: {
              md: {
                base: 'font-normal',
                leadingIcon: 'size-4'
              }
            }
          },
          defaultVariants: {
            size: 'md'
          }
        },
        textarea: {
          defaultVariants: {
            size: 'lg'
          }
        },
        table: {
          defaultVariants: {
            size: 'lg'
          }
        },
        select: {
          base: ['!ring-gray-200 !border-gray-200'],
          defaultVariants: {
            size: 'md',
            selectedIcon: ''
          },
          slots: {
            overlay: 'z-[100]',
            content: 'z-[100]',
            item: [
              'data-[state=checked]:!bg-blue-50 dark:data-[state=checked]:!bg-blue-950/50',
              'data-[state=checked]:!text-black data-[state=checked]:!font-semibold',
              'dark:data-[state=checked]:!text-blue-400'
            ],
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
          }
        },
        modal: {
          slots: {
            header: 'min-h-10',
            body: 'pt-0 sm:pt-0',
            title: 'text-lg p-0',
            overlay: 'z-[30] bg-black/50 dark:bg-black/80',
            content: 'z-[30] bg-default flex flex-col focus:outline-none divide-none !ring-0'
          }
        },
        slideover: {
          slots: { overlay: 'z-[100]', content: 'z-[100]' }
        },
        card: {
          defaultVariants: {
            size: 'lg'
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### main.ts

```typescript
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import ui from '@nuxt/ui/vue-plugin';
import App from './App.vue';
import './assets/styles/tailwind.css';
import EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import router from './router.ts';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.component('EasyDataTable', EasyDataTable);
app.use(router);
app.use(ui); // NuxtUI Vue 플러그인 등록
app.mount('#app');
```

---

## 디자인 토큰 구조 (프로젝트 기준)

### tailwind.css

```css
@import 'tailwindcss';
@import '@nuxt/ui';
@import './components.css';
@import './theme.css';

body {
  font-family: 'Pretendard', 'Roboto', 'Arial', sans-serif;
  font-size: 14px;
}

button {
  cursor: pointer;
}

:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}
```

### theme.css (@theme 블록)

```css
@theme {
  /* 프로젝트 Primary 색상 팔레트 (customblue) */
  --color-customblue-50: #f0f7ff;
  --color-customblue-100: #e0efff;
  --color-customblue-200: #baddff;
  --color-customblue-300: #7cc4ff;
  --color-customblue-400: #4096ff; /* 기준 색상 */
  --color-customblue-500: #2563eb;
  --color-customblue-600: #1d4ed8;
  --color-customblue-700: #1e40af;
  --color-customblue-800: #1e3a8a;
  --color-customblue-900: #1e3a8a;
  --color-customblue-950: #172554;

  /* 타이포그래피 */
  --font-base: 'Pretendard', 'Roboto', 'Arial';

  /* Border radius */
  --radius-custom4: 4px;
  --radius-custom6: 6px;
  --radius-custom8: 8px;
  --radius-custom10: 10px;
  --radius-custom16: 16px;
  --radius-custom20: 20px;
  --radius-custom30: 30px;

  /* 그림자 */
  --shadow-custom006: 0 0 6px rgba(0, 0, 0, 0.1);
  --shadow-custom0010: 0 0 10px rgba(0, 0, 0, 0.1);
  --shadow-custom04100: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Primary 색상 설정 */
:root {
  --ui-primary: var(--color-customblue-400); /* #4096ff */
}

.dark {
  --ui-primary: var(--color-customblue-300); /* #7cc4ff */
}
```

---

## NuxtUI 주요 컴포넌트

### UButton

```vue
<template>
  <!-- Primary -->
  <u-button color="primary">저장</u-button>

  <!-- Secondary -->
  <u-button color="neutral" variant="soft">취소</u-button>

  <!-- Outline -->
  <u-button variant="outline">더보기</u-button>

  <!-- Ghost -->
  <u-button variant="ghost">링크</u-button>

  <!-- 사이즈 -->
  <u-button size="sm">작게</u-button>
  <u-button size="md">기본</u-button>
  <u-button size="lg">크게</u-button>

  <!-- 아이콘 -->
  <u-button icon="i-heroicons-plus" />
  <u-button trailing-icon="i-heroicons-arrow-right">다음</u-button>

  <!-- 로딩 -->
  <u-button :loading="isLoading">저장</u-button>
</template>
```

### UCard

```vue
<template>
  <u-card>
    <template #header>
      <h3 class="font-medium">카드 제목</h3>
    </template>

    <p>카드 내용</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <u-button variant="soft">취소</u-button>
        <u-button>확인</u-button>
      </div>
    </template>
  </u-card>
</template>
```

### UModal

```vue
<script setup>
const isOpen = ref(false);
</script>

<template>
  <u-button @click="isOpen = true">모달 열기</u-button>

  <u-modal v-model:open="isOpen">
    <template #header>
      <h2 class="text-lg font-medium">모달 제목</h2>
    </template>

    <p>모달 내용</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <u-button variant="soft" @click="isOpen = false">취소</u-button>
        <u-button @click="handleConfirm">확인</u-button>
      </div>
    </template>
  </u-modal>
</template>
```

### UInput

```vue
<template>
  <u-form-field label="이메일" required>
    <u-input v-model="email" type="email" placeholder="이메일 입력" :error="emailError" />
    <template #error>{{ emailError }}</template>
  </u-form-field>
</template>
```

### USelect

```vue
<template>
  <u-form-field label="카테고리">
    <u-select v-model="category" :options="categories" placeholder="선택하세요" />
  </u-form-field>
</template>

<script setup>
const categories = [
  { label: '전체', value: '' },
  { label: '카테고리1', value: '1' },
  { label: '카테고리2', value: '2' }
];
</script>
```

---

## 프로젝트 전용 컴포넌트

> NuxtUI 외에 **반드시 사용해야 하는** 프로젝트 커스텀 컴포넌트
>
> 위치: `front/src/modules/_common/components/`

### 컴포넌트 전체 목록

#### Forms (폼 컴포넌트)

| 컴포넌트            | 용도                               | 비고                        |
| ------------------- | ---------------------------------- | --------------------------- |
| `p-form-row`        | 폼 레이블/입력 구조화              | **필수** - 모든 폼에서 사용 |
| `p-nuxt-select`     | 드롭다운 선택 (NuxtUI select 래퍼) | **필수**                    |
| `p-input-box`       | 포맷팅 입력 (금액, 전화번호 등)    | 포맷팅 필요시만 사용        |
| `p-select-box`      | 기본 셀렉트박스                    | 레거시, p-nuxt-select 권장  |
| `p-checkbox`        | 체크박스                           |                             |
| `p-radiobox`        | 라디오 버튼                        |                             |
| `p-toggle-checkbox` | 토글 체크박스                      |                             |
| `p-button`          | 커스텀 버튼                        | NuxtUI u-button 우선 사용   |
| `p-tab-list`        | 탭 목록                            |                             |
| `p-tab-content`     | 탭 콘텐츠                          |                             |
| `p-tooltip`         | 툴팁                               |                             |
| `p-view-detail-item`| 상세 보기 항목                     |                             |

#### Date Picker (날짜 선택)

| 컴포넌트               | 용도              | 비고     |
| ---------------------- | ----------------- | -------- |
| `p-date-picker-work`   | 단일 날짜 선택    | **필수** |
| `p-date-picker-multi-work` | 기간 선택     |          |
| `p-day-select`         | 일자 빠른 선택    |          |

#### File (파일 처리)

| 컴포넌트        | 용도        | 비고     |
| --------------- | ----------- | -------- |
| `p-file-upload` | 파일 업로드 | **필수** |

#### Editor (리치 텍스트 에디터)

| 컴포넌트         | 용도                   | 비고                              |
| ---------------- | ---------------------- | --------------------------------- |
| `tiny-editor`    | TinyMCE 리치 텍스트    | **필수** - 에디터 사용시          |
| `tiny-editor-api`| TinyMCE Cloud API 버전 | 참고용                            |
| ~~`p-editor-quill`~~ | ~~Quill 에디터~~   | **사용 금지** - TinyMCE로 대체    |

> **중요**: Quill 에디터는 더 이상 사용하지 않습니다. 리치 텍스트 에디터가 필요한 경우 **TinyMCE**를 사용하세요.

#### Modal (모달)

| 컴포넌트          | 용도             | 비고                      |
| ----------------- | ---------------- | ------------------------- |
| `p-modal-common`  | 공통 모달 (NuxtUI 기반) | **권장**           |
| `p-modal-confirm` | 확인 모달        |                           |
| `p-modal-alert`   | 알림 모달        |                           |
| `p-modal`         | 기본 모달        | 레거시, p-modal-common 권장 |

#### Layout (레이아웃)

| 컴포넌트        | 용도          | 비고 |
| --------------- | ------------- | ---- |
| `p-bread-crumb` | 브레드크럼    |      |
| `p-full-loding` | 전체 화면 로딩 |      |
| `p-toast`       | 토스트 메시지 |      |

#### Pagination (페이지네이션)

| 컴포넌트            | 용도       | 비고                           |
| ------------------- | ---------- | ------------------------------ |
| `p-pagination-work` | 페이지네이션 | NuxtUI u-pagination도 사용 가능 |

#### Dropdown (드롭다운)

| 컴포넌트             | 용도              | 비고 |
| -------------------- | ----------------- | ---- |
| `common-dropdown`    | 공통 드롭다운     |      |
| `menu-dropdown`      | 메뉴 드롭다운     |      |
| `more-menu-dropdown` | 더보기 메뉴       |      |

#### 기타

| 컴포넌트              | 용도              | 비고 |
| --------------------- | ----------------- | ---- |
| `p-post-code`         | 주소 검색 (다음)  |      |
| `p-editor-html-only`  | HTML 전용 에디터  |      |
| `sidebar`             | 사이드바          |      |

---

### 필수 컴포넌트 사용 예시

#### p-form-row (폼 레이아웃)

```vue
<template>
  <p-form-row label="제목" is-required>
    <u-form-field name="subject">
      <u-input v-model="form.subject" />
    </u-form-field>
  </p-form-row>
</template>
```

#### p-input-box (포맷팅 입력)

```vue
<!-- 콤마 포맷팅 (금액) -->
<p-input-box v-model="amount" is-comma />
<!-- 1,000,000 -->

<!-- 휴대폰 번호 포맷팅 -->
<p-input-box v-model="phone" is-hp-number />
<!-- 010-1234-5678 -->

<!-- 사업자번호 포맷팅 -->
<p-input-box v-model="bizNo" is-biz-number />
<!-- 123-45-67890 -->
```

> **일반 텍스트 입력은 NuxtUI `u-input` 사용**

#### tiny-editor (리치 텍스트 에디터)

```vue
<template>
  <!-- 기본 에디터 -->
  <tiny-editor v-model="content" :height="400" />

  <!-- 파일 업로드 지원 에디터 -->
  <tiny-editor
    v-model="content"
    :height="400"
    :is-file="true"
    @upload-file="handleUploadFile"
    @imageButtonClick="handleImageButton"
  />
</template>

<script setup lang="ts">
import TinyEditor from '@/modules/_common/components/tinymce/tiny-editor.vue';

const content = ref('<p>초기 내용</p>');
</script>
```

> **TinyMCE 상세 사용법**: `_common/components/tinymce/README.md` 참조

---

## 테이블 컴포넌트 (vue3-easy-data-table)

프로젝트에서는 `vue3-easy-data-table`을 주로 사용합니다.

### 기본 사용법

```vue
<script setup lang="ts">
import { type Header } from 'vue3-easy-data-table';
import { useThemeStore } from '@/modules/_common/store/theme.store';

const themeStore = useThemeStore();

const headers: Header[] = [
  { text: '번호', value: 'nIndex', width: 100, fixed: true },
  { text: '아이디', value: 'testSeq', width: 100, sortable: true },
  { text: '제목', value: 'subject', width: 300, sortable: true },
  { text: '사용여부', value: 'isUse', width: 100 },
  { text: '등록일', value: 'insertDate', width: 100, sortable: true },
  { text: '비고', value: 'handle', width: 170 }
];

const listParams = ref({
  page: 1,
  row: 20,
  sortBy: '',
  sortType: ''
});
</script>

<template>
  <easy-data-table
    v-model:server-options="listParams"
    v-model:items-selected="listCheckBoxs"
    :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
    class="easy-rounded-table"
    theme-color="#4096ff"
    :server-items-length="listTotalRow"
    :headers="headers"
    :items="listData"
    server-side-sorting
    header-text-direction="center"
    body-text-direction="center"
    hide-footer
    @update-sort="updateSort"
    @click-row="onTableRowClick"
  >
    <!-- 커스텀 셀: 스위치 -->
    <template #item-isUse="item">
      <div class="flex justify-center">
        <u-switch
          :model-value="item.isUse === 'Y'"
          @update:model-value="(value) => changeIsUse(item, value)"
        />
      </div>
    </template>

    <!-- 커스텀 셀: 액션 버튼 -->
    <template #item-handle="item">
      <div class="flex justify-center gap-2">
        <u-button size="sm" color="neutral" variant="soft" @click="goDetail(item.id)">
          보기
        </u-button>
        <u-button size="sm" color="neutral" variant="soft" @click="goUpdate(item.id)">
          수정
        </u-button>
      </div>
    </template>
  </easy-data-table>

  <!-- 페이지네이션 (별도 컴포넌트) -->
  <div v-if="listData.length > 0" class="flex justify-center py-3">
    <u-pagination
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
      @update:page="listMovePage"
    />
  </div>
</template>
```

---

## 프로젝트 스타일 가이드

### 권장 패턴

```vue
<template>
  <!-- 간격: 4px 배수 -->
  <div class="p-4 gap-4">
    <!-- 그림자: shadow-sm, shadow (최대) -->
    <div class="shadow-sm">
      <!-- 둥근 모서리: rounded-md, rounded-lg (최대) -->
      <div class="rounded-lg">내용</div>
    </div>
  </div>
</template>
```

### 금지 패턴

```vue
<!-- 금지: 그라데이션 -->
<div class="bg-gradient-to-r from-blue-500 to-purple-500">금지</div>

<!-- 금지: 과도한 그림자 -->
<div class="shadow-xl shadow-2xl">금지</div>

<!-- 금지: 과도한 애니메이션 -->
<div class="animate-pulse animate-bounce">금지</div>

<!-- 금지: 확대 효과 -->
<button class="hover:scale-105 transform">금지</button>

<!-- 금지: 과도한 둥근 모서리 -->
<button class="rounded-full rounded-3xl">금지</button>
```

---

## 다크 모드 구현

### Pinia Store 기반 (프로젝트 방식)

```typescript
// store/theme.store.ts
import { defineStore } from 'pinia';

interface ThemeState {
  isDarkMode: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDarkMode: false
  }),
  actions: {
    setDarkMode() {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    },
    setLightMode() {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    },
    toggleTheme() {
      if (this.isDarkMode) {
        this.setLightMode();
      } else {
        this.setDarkMode();
      }
    },
    initTheme() {
      this.setLightMode(); // 기본값: 라이트 모드
    }
  },
  persist: true
});
```

### CSS 설정

```css
/* tailwind.css */
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}
```

---

## 트랜지션 유틸리티

```css
--transition-fast: 150ms;
--transition-normal: 200ms;
--transition-slow: 300ms;
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
```

```vue
<template>
  <button
    class="
      transition-colors
      duration-150
      ease-out
    "
  >
    버튼
  </button>
</template>
```

---

## 빠른 참조: 핵심 수치

### 스페이싱 스케일 (4px 기준)

```
0.5: 2px | 1: 4px | 2: 8px | 3: 12px | 4: 16px
5: 20px | 6: 24px | 8: 32px | 10: 40px | 12: 48px
```

### 컬러 토큰 (프로젝트 기준)

```css
:root {
  /* Primary */
  --ui-primary: #4096ff; /* customblue-400 */

  /* Semantic Colors */
  --color-redFF4: #ff4d4f; /* 오류/삭제 */
  --color-green52C: #52c41a; /* 성공 */
  --color-yellowFAA: #faad14; /* 경고 */
  --color-customSkyBlue1: #e6f4ff; /* 선택/호버 배경 */

  /* Neutral */
  --color-bodyBg: #f0f2f5; /* 페이지 배경 */
  --color-grayf5f5f5: #f5f5f5; /* 테이블 헤더 배경 */
  --color-grayd9d9d9: #d9d9d9; /* 테두리 */

  /* Border radius */
  --radius-custom4: 4px;
  --radius-custom6: 6px;
  --radius-custom8: 8px;
}
```

### 다크모드 토큰

```css
.dark {
  --ui-primary: #7cc4ff; /* customblue-300 */
  --color-black141414: #141414; /* 배경 */
  --color-gray303030: #303030; /* 테두리 */
  --color-gray424242: #424242; /* 강조 테두리 */
  --color-grayD9D9D9: #d9d9d9; /* 텍스트 */
}
```
