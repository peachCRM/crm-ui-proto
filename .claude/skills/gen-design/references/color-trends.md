# 색상 트렌드 가이드 (2024-2025)

## 핵심 변화

- **oklch 색상 포맷**: TailwindCSS v4 기본 사용
- **어스톤 vs 네온**: 양극화 트렌드
- **Pantone 올해의 컬러**: 2024 Peach Fuzz(13-1023), 2025 Mocha Mousse(#A47864)

---

## 2024-2025 컬러 팔레트

| 카테고리        | 색상 예시                                            | 사용 맥락                  |
| --------------- | ---------------------------------------------------- | -------------------------- |
| **어스톤**      | Deep Forest Green `#2D5A27`, Sandy Beige, Terracotta | 자연스럽고 안정적인 브랜드 |
| **네온/비비드** | Electric Blue, Neon Pink, Sunny Yellow `#FFDD44`     | 에너지틱한 B2C 앱          |
| **소프트 톤**   | Peach Fuzz, Mocha Mousse `#A47864`                   | 웜톤 기반 접근성 높은 UI   |

---

## 프로젝트 색상 시스템 (전체)

### Primary 팔레트 (customblue)

```css
@theme {
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
}

:root {
  --ui-primary: var(--color-customblue-400); /* #4096ff */
}

.dark {
  --ui-primary: var(--color-customblue-300); /* #7cc4ff */
}
```

### 기타 파란색 변형

```css
@theme {
  --color-customBlueFirst: #1f5ce4;
  --color-customBlueEnd: #1d95f1;
  --color-customBlue266: #2662e9;
  --color-customBlue0d4: #0d4cd9;
  --color-customBlue167: #1677ff;
  --color-customBlue3D7: #3d72ea;

  /* 스카이 블루 (선택/호버용) */
  --color-customSkyBlue1: #e6f4ff; /* 테이블 선택 배경 */
  --color-customSkyBlue2: #4096ff; /* 포커스 링 */
  --color-customSkyBlue3: #91caff;

  --color-customVioletPrimary: #4096ff;
  --color-colorPrimary: #4096ff;
}
```

---

### Semantic Colors (상태 색상)

```css
@theme {
  /* 오류/삭제 */
  --color-redFF4: #ff4d4f;
  --color-redFFF: #fff2f0; /* 오류 배경 */
  --color-redFFC: #ffccc7; /* 오류 테두리 */
  --color-redF52: #f5222d; /* 강한 오류 */

  /* 경고 */
  --color-yellowFAA: #faad14;

  /* 성공 */
  --color-green52C: #52c41a;

  /* 주의 */
  --color-orangeFB9: #fb923c;
}
```

---

### Gray 계열 (전체)

```css
@theme {
  /* 밝은 회색 (배경용) */
  --color-customGrayFaf: #fafafc;
  --color-customGrayEFE: #efefef;
  --color-customGrayEce: #ececec;
  --color-customGraye4: #e4e4e4;
  --color-grayf5f5f5: #f5f5f5;
  --color-grayf0f0f0: #f0f0f0;
  --color-grayfafafa: #fafafa;
  --color-graybfbfbf: #bfbfbf;
  --color-grayd9d9d9: #d9d9d9;
  --color-graya6a6a6: #a6a6a6;

  /* 중간 회색 (텍스트/테두리용) */
  --color-customGray999: #999999;
  --color-customGray959: #959595;
  --color-customgray8c8: #8c8c8c;
  --color-customGray8c: #8c8c8c;
  --color-gray727272: #727272;
  --color-customGray595: #595959;

  /* 어두운 회색 (다크모드용) */
  --color-gray424242: #424242;
  --color-gray404040: #404040;
  --color-gray303030: #303030;
  --color-customGray1f1: #1f1f1f;

  /* 테두리 회색 */
  --color-borderGray888: #888888;
  --color-borderGray: #9d9d9d;
}
```

---

### Black 계열

```css
@theme {
  --color-customBlack000: #000000;
  --color-customBlack1D1: #1d1d1d;
  --color-customBlack222: #222222;
  --color-customBlack333: #333333;
  --color-customBlack444: #444444;
  --color-customBlack555: #555555;
  --color-customBlack666: #666666;

  /* 다크모드 배경용 */
  --color-black141414: #141414;
  --color-black272727: #272727;
  --color-black111a2c: #111a2c; /* 선택 행 배경 */
  --color-black3c89e8: #3c89e8;
}
```

---

### 배경색

```css
@theme {
  --color-bodyBg: #f0f2f5; /* 페이지 배경 */
  --color-sideMenuBg: #fafafa; /* 사이드메뉴 배경 */
}
```

---

### 기본/베이스 색상

```css
@theme {
  --color-default: #444444;
  --color-base: #333333;
  --text-color-default: #000000;
  --border-color-default: #1677ff;
}
```

---

### Sign (로그인/인증 페이지용)

```css
@theme {
  --color-signPrimary: #013091;
  --color-signBgPrimary: #f8f9fd;
  --color-signHeadPrimary: #1f1f1f;
  --color-signBtnPrimary: #2662e9;
  --color-signBtnSecondary: #497ff5;
  --color-signBoardSecondary: #d9d9d9;
  --color-signBorderPrimary: #bebebe;
}
```

---

## 색상 사용 가이드

### 용도별 권장 색상

| 용도           | 라이트 모드                          | 다크 모드                           |
| -------------- | ------------------------------------ | ----------------------------------- |
| Primary CTA    | `customblue-400` (#4096ff)           | `customblue-300` (#7cc4ff)          |
| 본문 텍스트    | `customBlack1D1` (#1d1d1d)           | `grayd9d9d9` (#d9d9d9)              |
| 보조 텍스트    | `customGray595` (#595959)            | `gray727272` (#727272)              |
| 페이지 배경    | `bodyBg` (#f0f2f5)                   | `black141414` (#141414)             |
| 카드 배경      | white (#ffffff)                      | `black272727` (#272727)             |
| 테이블 헤더    | `grayf5f5f5` (#f5f5f5)               | `black141414` (#141414)             |
| 선택/호버 배경 | `customSkyBlue1` (#e6f4ff)           | `black111a2c` (#111a2c)             |
| 기본 테두리    | `grayd9d9d9` (#d9d9d9)               | `gray303030` (#303030)              |
| 강조 테두리    | `customGraye4` (#e4e4e4)             | `gray424242` (#424242)              |
| 오류           | `redFF4` (#ff4d4f)                   | `redFF4` (#ff4d4f)                  |
| 성공           | `green52C` (#52c41a)                 | `green52C` (#52c41a)                |
| 경고           | `yellowFAA` (#faad14)                | `yellowFAA` (#faad14)               |

---

## oklch 색상 시스템

TailwindCSS v4에서 기본 사용:

```css
@theme {
  --color-brand-500: oklch(0.55 0.18 250);
  --color-mint-500: oklch(0.72 0.11 178);
}
```

### oklch 장점

- 인간 지각에 더 가까운 색상 보간
- 일관된 밝기 유지
- 접근성 대비 계산 용이

---

## Glassmorphism 구현

Apple Vision Pro, macOS Big Sur, Windows 11 Fluent Acrylic에서 사용:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1); /* 10-30% 불투명도 */
  backdrop-filter: blur(25px); /* 최소 25px, 복잡한 배경은 100px */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

/* 기능 감지 fallback */
@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.9);
  }
}
```

### 백오피스 적용 시 주의

- 과도한 사용 금지 (1-2개 포인트 요소에만)
- 텍스트 가독성 확보 필수
- 성능 고려 (backdrop-filter는 무거움)

---

## 데이터 시각화 컬러

### 상태 표시

```css
--status-active: #52c41a; /* 활성 - 초록 */
--status-inactive: #8c8c8c; /* 비활성 - 회색 */
--status-pending: #faad14; /* 대기 - 주황 */
--status-error: #ff4d4f; /* 오류 - 빨강 */
```

### 차트 팔레트 (6색)

```css
--chart-1: #4096ff; /* customblue */
--chart-2: #52c41a; /* green */
--chart-3: #faad14; /* amber */
--chart-4: #ff4d4f; /* red */
--chart-5: #8b5cf6; /* violet */
--chart-6: #06b6d4; /* cyan */
```

---

## 접근성 대비 기준

| 요소                 | AA 기준 | AAA 기준 |
| -------------------- | ------- | -------- |
| 일반 텍스트 (<18pt)  | 4.5:1   | 7:1      |
| 큰 텍스트 (≥18pt)    | 3:1     | 4.5:1    |
| UI 컴포넌트 & 그래픽 | 3:1     | 3:1      |

### 검증 도구

- WebAIM Contrast Checker
- axe DevTools
- Figma Contrast 플러그인

---

## NuxtUI v4 색상 설정

### vite.config.ts

```typescript
ui({
  ui: {
    colors: {
      primary: 'customblue', // 프로젝트 커스텀 파란색
      secondary: 'green',
      neutral: 'gray'
    }
  }
});
```

### Semantic Color Aliases

| 색상      | 프로젝트 값  | 용도                 |
| --------- | ------------ | -------------------- |
| primary   | customblue   | CTA, 브랜드 요소     |
| secondary | green        | 보조 액션            |
| success   | green        | 성공 상태            |
| error     | red          | 오류 상태            |
| warning   | yellow       | 경고 상태            |
| info      | blue         | 정보 표시            |
| neutral   | gray         | 텍스트, 테두리, 배경 |

---

## 빠른 참조: 주요 색상 코드

```css
/* Primary */
#4096ff /* customblue-400 (라이트 모드 Primary) */
#7cc4ff /* customblue-300 (다크 모드 Primary) */

/* 배경 */
#f0f2f5 /* bodyBg (페이지 배경) */
#141414 /* black141414 (다크 모드 배경) */
#e6f4ff /* customSkyBlue1 (선택 행 배경) */
#111a2c /* black111a2c (다크 모드 선택 배경) */

/* 텍스트 */
#1d1d1d /* customBlack1D1 (기본 텍스트) */
#595959 /* customGray595 (보조 텍스트) */
#d9d9d9 /* grayd9d9d9 (다크 모드 텍스트) */

/* 테두리 */
#d9d9d9 /* grayd9d9d9 (기본 테두리) */
#303030 /* gray303030 (다크 모드 테두리) */

/* 상태 */
#ff4d4f /* redFF4 (오류) */
#52c41a /* green52C (성공) */
#faad14 /* yellowFAA (경고) */
```
