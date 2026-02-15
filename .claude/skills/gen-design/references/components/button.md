# 버튼 (Button) 디자인 가이드

## 상태 디자인

| State | 처리 방식 |
|-------|----------|
| Default | 기본 색상, 변화 없음 |
| Hover | 배경 미세 변화, cursor: pointer, ~150ms |
| Active | 더 어두운 색상, scale(0.98) |
| Disabled | opacity: 0.5, pointer-events: none |
| Loading | 스피너 아이콘, 상호작용 비활성화 |
| Focus | 2px ring offset, 4.5:1 대비 아웃라인 |

---

## 사이즈 스케일 (shadcn/ui 표준)

| Size | Height | Padding | Font | Radius |
|------|--------|---------|------|--------|
| xs | 24px | px-2 | 11-12px | 2px |
| sm | 32px | px-3 | 13-14px | 4px |
| md | 40px | px-4 | 14px | 6px |
| lg | 44px | px-6 | 16px | 8px |
| xl | 48px | px-8 | 18px | 12px |

---

## Border-radius 트렌드

- **8-12px (소프트/라운드)**: 가장 인기
- **Pill (9999px)**: CTA와 태그에 사용
- **백오피스 권장**: `rounded-md` (6px), `rounded-lg` (8px)

---

## NuxtUI 버튼 사용

### 기본 사용

```vue
<template>
  <!-- Primary (CTA) -->
  <u-button color="primary">저장</u-button>

  <!-- Secondary -->
  <u-button color="neutral" variant="soft">취소</u-button>

  <!-- Outline -->
  <u-button variant="outline">더보기</u-button>

  <!-- Ghost -->
  <u-button variant="ghost">링크</u-button>

  <!-- Destructive -->
  <u-button color="red">삭제</u-button>
</template>
```

### 사이즈

```vue
<template>
  <u-button size="xs">아주 작게</u-button>
  <u-button size="sm">작게</u-button>
  <u-button size="md">기본</u-button>
  <u-button size="lg">크게</u-button>
  <u-button size="xl">아주 크게</u-button>
</template>
```

### 아이콘 버튼

```vue
<template>
  <!-- 아이콘만 -->
  <u-button icon="i-heroicons-plus" aria-label="추가" />

  <!-- 아이콘 + 텍스트 -->
  <u-button icon="i-heroicons-plus">추가</u-button>

  <!-- 텍스트 + 아이콘 (trailing) -->
  <u-button trailing-icon="i-heroicons-arrow-right">다음</u-button>
</template>
```

### 로딩 상태

```vue
<template>
  <u-button :loading="isLoading" :disabled="isLoading">
    {{ isLoading ? '저장 중...' : '저장' }}
  </u-button>
</template>
```

---

## 버튼 그룹

```vue
<template>
  <div class="flex gap-2">
    <u-button variant="soft">취소</u-button>
    <u-button>확인</u-button>
  </div>

  <!-- 오른쪽 정렬 -->
  <div class="flex justify-end gap-2">
    <u-button variant="soft">취소</u-button>
    <u-button>저장</u-button>
  </div>
</template>
```

---

## 커스텀 스타일링

### TailwindCSS 직접 사용

```vue
<template>
  <button
    class="
      inline-flex items-center justify-center
      h-10 px-4
      text-sm font-medium
      text-white bg-primary-500
      hover:bg-primary-600
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-primary-500
      focus-visible:ring-offset-2
      disabled:opacity-50
      disabled:pointer-events-none
      rounded-md
      transition-colors duration-150
    "
  >
    버튼
  </button>
</template>
```

---

## 버튼 계층 (Visual Hierarchy)

| 계층 | 용도 | 스타일 |
|------|------|--------|
| Primary | 주요 액션 (저장, 확인) | 채워진 배경, 대비되는 색상 |
| Secondary | 보조 액션 (취소, 이전) | 연한 배경 또는 outline |
| Tertiary | 부가 액션 (더보기, 링크) | ghost 또는 텍스트만 |
| Destructive | 삭제, 위험 액션 | 빨간색 계열 |

---

## 접근성 체크리스트

- [ ] 아이콘만 있는 버튼: `aria-label` 필수
- [ ] 토글 버튼: `aria-pressed` 사용
- [ ] 로딩 버튼: `aria-disabled="true"` + `aria-live` 알림
- [ ] 최소 타겟 사이즈: 24×24px (WCAG 2.5.8)
- [ ] 포커스 인디케이터: 2px+ ring, 4.5:1 대비

```vue
<template>
  <!-- 아이콘 버튼 -->
  <u-button icon="i-heroicons-magnifying-glass" aria-label="검색" />

  <!-- 토글 버튼 -->
  <u-button
    :aria-pressed="isActive"
    @click="isActive = !isActive"
  >
    {{ isActive ? '활성' : '비활성' }}
  </u-button>
</template>
```

---

## 금지 패턴

```vue
<!-- 금지: 확대 효과 -->
<button class="hover:scale-105 transform">금지</button>

<!-- 금지: 과도한 둥근 모서리 (버튼) -->
<button class="rounded-full">금지</button>

<!-- 금지: 그라데이션 배경 -->
<button class="bg-gradient-to-r from-blue-500 to-purple-500">금지</button>

<!-- 금지: 과도한 그림자 -->
<button class="shadow-xl">금지</button>
```

---

## 권장 패턴

```vue
<template>
  <!-- 기본 CTA -->
  <u-button color="primary">저장</u-button>

  <!-- 보조 액션 -->
  <u-button color="neutral" variant="soft">취소</u-button>

  <!-- 삭제 -->
  <u-button color="red" variant="soft">삭제</u-button>

  <!-- 링크 스타일 -->
  <u-button variant="ghost">더보기</u-button>
</template>
```
