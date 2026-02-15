# 타이포그래피 트렌드 가이드 (2024-2025)

## 핵심 변화

- **Variable Fonts**: 표준으로 자리잡음
- **용량 절감**: Source Sans Pro 기준 개별 웨이트 대비 65% 절감
- **트렌드 폰트**: High-contrast Sans Serifs, Condensed Serifs, Inter, Satoshi

---

## Variable Fonts 설정

```css
@font-face {
  font-family: 'InterVariable';
  src: url('Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-stretch: 75% 125%;
}
```

### 프로젝트 기본 폰트
```css
@theme {
  --font-sans: 'Pretendard', system-ui, sans-serif;
  --font-display: 'Pretendard', sans-serif;
}
```

---

## 타이포그래피 스케일

| 토큰 | 크기 | Line Height | 용도 |
|------|------|-------------|------|
| `xs` | 12px | 1.5 | 캡션, 레이블 |
| `sm` | 14px | 1.5 | 보조 텍스트 |
| `base` | 16px | 1.5 | 본문 기본 |
| `lg` | 18px | 1.625 | 강조 본문 |
| `xl` | 20px | 1.5 | 소제목 |
| `2xl` | 24px | 1.33 | 섹션 제목 |
| `3xl` | 30px | 1.25 | 페이지 제목 |
| `display` | 72-144px | 1.1 | 히어로 섹션 |

---

## TailwindCSS v4 폰트 설정

```css
@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* 커스텀 폰트 스케일 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}
```

---

## 백오피스 타이포그래피 규칙

### 제목 계층
```vue
<!-- 페이지 제목 -->
<h1 class="text-2xl font-semibold text-neutral-900">페이지 제목</h1>

<!-- 섹션 제목 -->
<h2 class="text-xl font-medium text-neutral-800">섹션 제목</h2>

<!-- 카드 제목 -->
<h3 class="text-lg font-medium text-neutral-800">카드 제목</h3>

<!-- 소제목 -->
<h4 class="text-base font-medium text-neutral-700">소제목</h4>
```

### 본문 텍스트
```vue
<!-- 기본 본문 -->
<p class="text-sm text-neutral-600">본문 텍스트</p>

<!-- 강조 본문 -->
<p class="text-sm font-medium text-neutral-700">강조 텍스트</p>

<!-- 보조 텍스트 -->
<p class="text-xs text-neutral-500">보조 설명</p>
```

### 레이블
```vue
<!-- 폼 레이블 -->
<label class="text-sm font-medium text-neutral-700">레이블</label>

<!-- 테이블 헤더 -->
<th class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
  컬럼명
</th>
```

---

## Font Weight 사용 가이드

| Weight | 클래스 | 용도 |
|--------|--------|------|
| 400 | `font-normal` | 본문 기본 |
| 500 | `font-medium` | 강조, 레이블 |
| 600 | `font-semibold` | 제목, 버튼 |
| 700 | `font-bold` | 특별 강조 (제한적 사용) |

> **주의**: `font-bold` 이상은 백오피스에서 거의 사용하지 않음

---

## Line Height 가이드

| 용도 | Line Height | TailwindCSS |
|------|-------------|-------------|
| 제목 | 1.25 | `leading-tight` |
| 본문 | 1.5 | `leading-normal` |
| 긴 텍스트 | 1.625-1.75 | `leading-relaxed` |

---

## 접근성 고려사항

### 최소 폰트 크기
- 본문: 최소 14px (권장 16px)
- 보조 텍스트: 최소 12px

### 대비
- 본문 텍스트: 4.5:1 이상
- 큰 텍스트 (18px+): 3:1 이상

### 줄 간격
- 본문: 최소 1.5
- 긴 텍스트: 1.625 이상

---

## 트렌드 폰트 추천

### Sans Serif (권장)
- **Inter**: 가장 인기 있는 UI 폰트
- **Satoshi**: 모던하고 깔끔
- **Pretendard**: 한글 지원 최적화

### Monospace (코드용)
- **JetBrains Mono**: 개발자 친화적
- **Fira Code**: 리거처 지원

### Display (제목용)
- **Cal Sans**: 대담한 디스플레이
- **Outfit**: 모던 헤드라인
