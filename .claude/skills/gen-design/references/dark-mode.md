# 다크 모드 디자인 가이드 (2024-2025)

## 핵심 원칙

- **순수 검정 금지**: `#000` 대신 `#121212` 또는 `#141414` 사용 (눈의 피로 감소)
- **Elevation 계층**: 배경 밝기로 깊이 표현
- **채도 조절**: 다크모드에서 액센트 컬러 채도 20-30% 감소

---

## Elevation 계층 시스템

Google Material Design 기반:

| Level | 배경색    | 용도            |
| ----- | --------- | --------------- |
| 0     | `#121212` | 기본 배경       |
| 1     | `#1E1E1E` | 카드, 컨테이너  |
| 2     | `#252525` | 호버 상태       |
| 3     | `#2C2C2C` | 모달, 팝오버   |

---

## 프로젝트 다크모드 구현

### TailwindCSS 설정

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class' // 클래스 기반 다크모드
};
```

### CSS 설정 (tailwind.css)

```css
@import 'tailwindcss';

:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}
```

---

## Pinia Store 기반 테마 관리 (프로젝트 방식)

> **중요**: 이 프로젝트는 Nuxt의 `useColorMode()` 대신 **Pinia Store**로 다크모드를 관리합니다.

### theme.store.ts

```typescript
import { defineStore } from 'pinia';

interface ThemeState {
  isDarkMode: boolean;
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDarkMode: false
  }),

  actions: {
    // 다크모드로 전환
    setDarkMode() {
      this.isDarkMode = true;
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    },

    // 라이트모드로 전환
    setLightMode() {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    },

    // 테마 토글
    toggleTheme() {
      if (this.isDarkMode) {
        this.setLightMode();
      } else {
        this.setDarkMode();
      }
    },

    // 테마 초기화 (기본: 라이트 모드)
    initTheme() {
      this.setLightMode();
    }
  }
});
```

### 컴포넌트에서 사용

```vue
<script setup>
import { useThemeStore } from '@/modules/_common/store/theme.store';

const themeStore = useThemeStore();
</script>

<template>
  <u-button @click="themeStore.toggleTheme">
    {{ themeStore.isDarkMode ? '라이트 모드' : '다크 모드' }}
  </u-button>

  <!-- 테마에 따른 조건부 렌더링 -->
  <div :class="themeStore.isDarkMode ? 'bg-black141414' : 'bg-white'">
    콘텐츠
  </div>
</template>
```

### 테이블에서 다크모드 적용

```vue
<script setup>
import { useThemeStore } from '@/modules/_common/store/theme.store';

const themeStore = useThemeStore();
</script>

<template>
  <easy-data-table
    :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
    theme-color="#4096ff"
    :headers="headers"
    :items="listData"
  />
</template>
```

---

## CSS 변수 시스템 (프로젝트 기준)

### 라이트 모드

```css
:root {
  /* Primary */
  --ui-primary: var(--color-customblue-400); /* #4096ff */

  /* 배경 */
  --color-bodyBg: #f0f2f5;
  --color-sideMenuBg: #fafafa;
  --color-grayf5f5f5: #f5f5f5;

  /* 텍스트 */
  --color-customBlack1D1: #1d1d1d;
  --color-customBlack333: #333333;
  --color-customBlack444: #444444;
  --color-customGray595: #595959;

  /* 테두리 */
  --color-grayd9d9d9: #d9d9d9;
  --color-customGraye4: #e4e4e4;
}
```

### 다크 모드

```css
.dark {
  /* Primary (채도 감소) */
  --ui-primary: var(--color-customblue-300); /* #7cc4ff */

  /* 배경 */
  --color-black141414: #141414;
  --color-black0a0a0a: #0a0a0a;
  --color-black111a2c: #111a2c;

  /* 텍스트 */
  --color-grayD9D9D9: #d9d9d9;

  /* 테두리 */
  --color-gray303030: #303030;
  --color-gray424242: #424242;

  /* 그림자 (다크모드용) */
  --shadow-custom020_dark: 0 2px 0 #0a0a0a;
  --shadow-custom04100_dark: 0 4px 10px #0a0a0a;
}
```

---

## 다크모드 컴포넌트 예시

### 카드

```vue
<template>
  <div
    class="
      bg-white dark:bg-black141414
      border border-gray-200 dark:border-gray424242
      rounded-lg p-4
    "
  >
    <h3 class="text-customBlack1D1 dark:text-grayD9D9D9 font-medium">
      제목
    </h3>
    <p class="text-customGray595 dark:text-gray-400 text-sm mt-2">
      설명 텍스트
    </p>
  </div>
</template>
```

### 버튼

```vue
<template>
  <!-- Primary -->
  <button
    class="
      bg-customblue-400 dark:bg-customblue-300
      hover:bg-customblue-500 dark:hover:bg-customblue-400
      text-white
    "
  >
    Primary
  </button>

  <!-- Secondary -->
  <button
    class="
      bg-gray-100 dark:bg-gray-800
      hover:bg-gray-200 dark:hover:bg-gray-700
      text-customBlack1D1 dark:text-grayD9D9D9
    "
  >
    Secondary
  </button>
</template>
```

### 테이블

```vue
<template>
  <!-- 라이트 모드: table_work -->
  <!-- 다크 모드: table_work_dark -->
  <table :class="themeStore.isDarkMode ? 'table_work_dark' : 'table_work'">
    <thead>
      <tr class="bg-grayf5f5f5 dark:bg-black141414">
        <th class="text-customGray595 dark:text-grayD9D9D9">컬럼</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-customSkyBlue1 dark:hover:bg-black111a2c">
        <td class="text-customBlack333 dark:text-grayD9D9D9">데이터</td>
      </tr>
    </tbody>
  </table>
</template>
```

---

## 프로젝트 테이블 스타일 클래스

| 클래스             | 용도                 |
| ------------------ | -------------------- |
| `.table_work`      | 라이트 모드 테이블   |
| `.table_work_dark` | 다크 모드 테이블     |
| `.table_report`    | 리포트/인쇄용 테이블 |

---

## 다크모드 체크리스트

### 필수 확인 사항

- [ ] 텍스트 대비 4.5:1 이상 유지
- [ ] 그림자 대신 테두리로 구분 (다크모드에서 그림자 안 보임)
- [ ] 이미지/아이콘 대비 확인
- [ ] 액센트 컬러 채도 조절 (`#4096ff` → `#7cc4ff`)
- [ ] 포커스 인디케이터 가시성
- [ ] `themeStore.isDarkMode` 조건부 클래스 적용

### 테스트 방법

```javascript
// 개발자 도구 콘솔에서
document.documentElement.classList.toggle('dark');
```

---

## 접근성 고려사항

### 대비 유지

다크모드에서도 WCAG 2.2 AA 기준 충족:

- 일반 텍스트: 4.5:1
- 큰 텍스트: 3:1
- UI 컴포넌트: 3:1

### 색상만으로 정보 전달 금지

```vue
<!-- 잘못된 예 -->
<span class="text-red-500 dark:text-red-400">오류</span>

<!-- 올바른 예: 아이콘 + 텍스트 -->
<span class="text-red-500 dark:text-red-400 flex items-center gap-1">
  <u-icon name="i-heroicons-exclamation-circle" />
  오류
</span>
```

---

## 다크모드 색상 팔레트 요약

### 배경

| 용도      | 라이트        | 다크       |
| --------- | ------------- | ---------- |
| 페이지    | `#f0f2f5`     | `#141414`  |
| 카드      | `#ffffff`     | `#1e1e1e`  |
| 선택 행   | `#e6f4ff`     | `#111a2c`  |
| 테이블 헤더 | `#f5f5f5`   | `#141414`  |

### 텍스트

| 용도   | 라이트    | 다크      |
| ------ | --------- | --------- |
| 기본   | `#1d1d1d` | `#d9d9d9` |
| 보조   | `#595959` | `#a1a1aa` |
| 비활성 | `#8c8c8c` | `#71717a` |

### 테두리

| 용도     | 라이트    | 다크      |
| -------- | --------- | --------- |
| 기본     | `#d9d9d9` | `#303030` |
| 강조     | `#e4e4e4` | `#424242` |
