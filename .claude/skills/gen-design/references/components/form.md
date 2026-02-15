# 폼 / 인풋 디자인 가이드

## 인풋 해부학

```
Label* (상단 정렬, 14px, font-weight: 600)
┌─────────────────────────────────┐
│ [Icon] Placeholder/Value        │ ← 높이: 40px
└─────────────────────────────────┘
Helper text (12px, muted)
Error text (12px, red)
```

---

## 레이블 패턴

| 패턴 | 설명 | 권장 |
|------|------|------|
| **Top-aligned** | 스캔 용이, 접근성 최적 | 기본 권장 |
| Floating | 공간 효율적이나 접근성 우려 | 제한적 사용 |
| Left-aligned | 수직 공간 절약 필요 시 | 특수 상황 |

---

## Validation 피드백

- **인라인**: debounce 300ms
- **blur 시**: 필드 포커스 해제 시 검증
- **submit 시**: 최종 검증

### 에러 스타일
- 빨간 테두리: `#EF4444`
- 에러 아이콘
- 하단 에러 텍스트

---

## NuxtUI 폼 컴포넌트

### 기본 인풋

```vue
<template>
  <u-form-field label="이메일" required>
    <u-input
      v-model="email"
      type="email"
      placeholder="이메일 입력"
    />
  </u-form-field>
</template>
```

### 에러 상태

```vue
<template>
  <u-form-field label="이메일" required :error="emailError">
    <u-input
      v-model="email"
      type="email"
      placeholder="이메일 입력"
      :error="!!emailError"
    />
  </u-form-field>
</template>
```

### 헬퍼 텍스트

```vue
<template>
  <u-form-field label="비밀번호" required>
    <u-input v-model="password" type="password" />
    <template #hint>
      8자 이상, 영문/숫자/특수문자 포함
    </template>
  </u-form-field>
</template>
```

---

## 인풋 유형별 가이드

### 텍스트 인풋

```vue
<template>
  <u-input v-model="text" placeholder="입력" />

  <!-- 아이콘 포함 -->
  <u-input v-model="search" placeholder="검색" icon="i-heroicons-magnifying-glass" />

  <!-- 클리어 버튼 -->
  <u-input v-model="text" placeholder="입력">
    <template #trailing>
      <u-button
        v-if="text"
        icon="i-heroicons-x-mark"
        size="xs"
        variant="ghost"
        @click="text = ''"
      />
    </template>
  </u-input>
</template>
```

### 셀렉트

```vue
<template>
  <u-form-field label="카테고리">
    <u-select
      v-model="category"
      :options="categories"
      placeholder="선택하세요"
    />
  </u-form-field>
</template>

<script setup>
const categories = [
  { label: '전체', value: '' },
  { label: '카테고리1', value: '1' },
  { label: '카테고리2', value: '2' },
];
</script>
```

### 텍스트에어리어

```vue
<template>
  <u-form-field label="설명">
    <u-textarea
      v-model="description"
      placeholder="설명 입력"
      :rows="4"
    />
  </u-form-field>
</template>
```

### 체크박스 / 라디오

```vue
<template>
  <!-- 체크박스 -->
  <u-checkbox v-model="agreed" label="약관에 동의합니다" />

  <!-- 라디오 그룹 -->
  <u-radio-group v-model="selected" :options="options" />
</template>
```

### 스위치

```vue
<template>
  <u-form-field label="알림 수신">
    <u-switch v-model="notifications" />
  </u-form-field>
</template>
```

---

## 폼 레이아웃

### 세로 레이아웃 (기본)

```vue
<template>
  <form class="space-y-4">
    <u-form-field label="이름" required>
      <u-input v-model="form.name" />
    </u-form-field>

    <u-form-field label="이메일" required>
      <u-input v-model="form.email" type="email" />
    </u-form-field>

    <u-form-field label="전화번호">
      <u-input v-model="form.phone" type="tel" />
    </u-form-field>
  </form>
</template>
```

### 가로 레이아웃

```vue
<template>
  <form class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <u-form-field label="이름" required>
        <u-input v-model="form.firstName" />
      </u-form-field>

      <u-form-field label="성" required>
        <u-input v-model="form.lastName" />
      </u-form-field>
    </div>

    <u-form-field label="이메일" required>
      <u-input v-model="form.email" type="email" />
    </u-form-field>
  </form>
</template>
```

---

## 유효성 검증 (Yup)

```typescript
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('이름을 입력하세요'),
  email: yup.string().email('올바른 이메일을 입력하세요').required('이메일을 입력하세요'),
  phone: yup.string().matches(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, '올바른 전화번호를 입력하세요'),
});
```

```vue
<script setup>
const errors = ref<Record<string, string>>({});

async function validate() {
  try {
    await schema.validate(form.value, { abortEarly: false });
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      errors.value = err.inner.reduce((acc, e) => {
        acc[e.path!] = e.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return false;
  }
}
</script>

<template>
  <u-form-field label="이름" required :error="errors.name">
    <u-input v-model="form.name" :error="!!errors.name" />
  </u-form-field>
</template>
```

---

## 모바일 키보드 최적화

```vue
<template>
  <!-- 숫자 키보드 -->
  <u-input v-model="cardNumber" inputmode="numeric" pattern="[0-9]*" />

  <!-- 이메일 키보드 -->
  <u-input v-model="email" type="email" inputmode="email" />

  <!-- 전화번호 키보드 -->
  <u-input v-model="phone" type="tel" inputmode="tel" />

  <!-- URL 키보드 -->
  <u-input v-model="website" type="url" inputmode="url" />
</template>
```

---

## 접근성 체크리스트

- [ ] 모든 인풋에 `<label>` 연결 (for/id 매칭)
- [ ] 필수 필드: `aria-required="true"`
- [ ] 에러 메시지: `aria-describedby` 연결
- [ ] 유효하지 않은 필드: `aria-invalid="true"`
- [ ] 관련 인풋: `<fieldset>`, `<legend>` 그룹화

```vue
<template>
  <div>
    <label for="email">이메일 *</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? 'email-error' : 'email-hint'"
    />
    <p id="email-hint" class="text-xs text-neutral-500">
      업무용 이메일을 입력하세요
    </p>
    <p v-if="hasError" id="email-error" class="text-xs text-red-500">
      유효한 이메일을 입력하세요
    </p>
  </div>
</template>
```

> NuxtUI의 `UFormField`와 `UInput`은 기본적으로 접근성 요구사항을 충족합니다.

---

## 금지 패턴

```vue
<!-- 금지: placeholder만 사용 (레이블 없음) -->
<u-input placeholder="이름" />

<!-- 금지: 빨간색만으로 에러 표시 (색맹 고려) -->
<u-input class="border-red-500" />

<!-- 금지: 자동 포커스 남용 -->
<u-input autofocus />
```

---

## 권장 패턴

```vue
<template>
  <u-form-field label="이름" required :error="errors.name">
    <u-input
      v-model="form.name"
      placeholder="이름 입력"
      :error="!!errors.name"
    />
    <template #hint>
      실명을 입력하세요
    </template>
  </u-form-field>
</template>
```
