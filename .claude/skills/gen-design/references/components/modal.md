# 모달 / 다이얼로그 디자인 가이드

## 오버레이 스타일

- **표준**: `rgba(0,0,0,0.5)`
- **모던 트렌드**: `backdrop-filter: blur(4px)` 추가

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
```

---

## 사이즈 가이드

| Size | Width | 용도 |
|------|-------|------|
| sm | 320-400px | 확인, 간단한 프롬프트 |
| md | 480-560px | 표준 폼, 정보 |
| lg | 640-720px | 복잡한 콘텐츠 |
| xl | 800-960px | 멀티스텝, 상세 폼 |

---

## 애니메이션

```css
/* 모달 등장 */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter {
  animation: modal-enter 200ms ease-out;
}
```

---

## NuxtUI 모달 사용

### 기본 모달

```vue
<script setup>
const isOpen = ref(false);
</script>

<template>
  <u-button @click="isOpen = true">모달 열기</u-button>

  <u-modal v-model="isOpen">
    <template #header>
      <h2 class="text-lg font-medium">모달 제목</h2>
    </template>

    <p class="text-sm text-neutral-600">모달 내용</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <u-button variant="soft" @click="isOpen = false">취소</u-button>
        <u-button @click="handleConfirm">확인</u-button>
      </div>
    </template>
  </u-modal>
</template>
```

### 사이즈 조절

```vue
<template>
  <!-- 작은 모달 -->
  <u-modal v-model="isOpen" :ui="{ width: 'sm:max-w-sm' }">
    <p>작은 확인 모달</p>
  </u-modal>

  <!-- 큰 모달 -->
  <u-modal v-model="isOpen" :ui="{ width: 'sm:max-w-3xl' }">
    <p>큰 폼 모달</p>
  </u-modal>
</template>
```

---

## 확인 다이얼로그

```vue
<script setup>
const isConfirmOpen = ref(false);
const confirmAction = ref<() => void>();

function openConfirm(action: () => void) {
  confirmAction.value = action;
  isConfirmOpen.value = true;
}

function handleConfirm() {
  confirmAction.value?.();
  isConfirmOpen.value = false;
}
</script>

<template>
  <u-button color="red" @click="openConfirm(deleteItem)">삭제</u-button>

  <u-modal v-model="isConfirmOpen" :ui="{ width: 'sm:max-w-sm' }">
    <div class="text-center py-4">
      <div class="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
        <icon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-500" />
      </div>
      <h3 class="text-lg font-medium">삭제 확인</h3>
      <p class="text-sm text-neutral-500 mt-2">
        정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </p>
    </div>

    <template #footer>
      <div class="flex justify-center gap-2">
        <u-button variant="soft" @click="isConfirmOpen = false">취소</u-button>
        <u-button color="red" @click="handleConfirm">삭제</u-button>
      </div>
    </template>
  </u-modal>
</template>
```

---

## 커스텀 오버레이 사용 (z-index 주의)

UModal의 기본 오버레이 대신 커스텀 오버레이를 사용할 때 z-index 충돌 주의:

```vue
<template>
  <!-- 오버레이: z-[10] 사용 (모달보다 낮아야 함) -->
  <div v-if="isOpen" class="fixed inset-0 z-[10] bg-black/50 dark:bg-black/70" @click.stop></div>

  <!-- 모달: :modal="false"로 기본 오버레이 비활성화 -->
  <u-modal
    v-model:open="isOpen"
    :dismissible="false"
    :modal="false"
    :ui="{
      content: 'min-w-sm max-w-[600px]',
      footer: 'justify-end'
    }"
  >
    <!-- 내용 -->
  </u-modal>
</template>
```

### z-index 가이드
| 요소 | z-index | 설명 |
|------|---------|------|
| 커스텀 오버레이 | z-[10] | 모달 뒤에 위치 |
| UModal 기본값 | z-50 | NuxtUI 기본 설정 |
| backdrop-blur 사용 시 | z-[10] | blur 효과가 모달에 적용되지 않도록 주의 |

> **주의**: `z-[100]` 이상 사용 시 모달이 오버레이 뒤로 가는 문제 발생

---

## 폼 모달

```vue
<script setup>
const isOpen = ref(false);
const form = ref({
  name: '',
  email: '',
  role: '',
});

async function handleSubmit() {
  // 유효성 검사 및 제출
  await submitForm(form.value);
  isOpen.value = false;
}
</script>

<template>
  <u-modal v-model="isOpen">
    <template #header>
      <h2 class="text-lg font-medium">사용자 등록</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <u-form-field label="이름" required>
        <u-input v-model="form.name" placeholder="이름 입력" />
      </u-form-field>

      <u-form-field label="이메일" required>
        <u-input v-model="form.email" type="email" placeholder="이메일 입력" />
      </u-form-field>

      <u-form-field label="역할">
        <u-select
          v-model="form.role"
          :options="['관리자', '편집자', '뷰어']"
          placeholder="역할 선택"
        />
      </u-form-field>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <u-button variant="soft" @click="isOpen = false">취소</u-button>
        <u-button @click="handleSubmit">등록</u-button>
      </div>
    </template>
  </u-modal>
</template>
```

---

## 모바일 Bottom Sheet

모바일에서는 Bottom Sheet 패턴 권장:

```vue
<template>
  <u-modal
    v-model="isOpen"
    :ui="{
      base: 'sm:rounded-lg rounded-t-xl rounded-b-none',
      margin: 'sm:my-8 mt-auto mb-0',
      width: 'sm:max-w-md w-full',
    }"
  >
    <!-- 드래그 핸들 -->
    <div class="flex justify-center py-2 sm:hidden">
      <div class="w-8 h-1 bg-neutral-300 rounded-full"></div>
    </div>

    <div class="p-4">
      <h3 class="font-medium">Bottom Sheet</h3>
      <p class="text-sm text-neutral-500 mt-2">모바일 최적화 모달</p>
    </div>
  </u-modal>
</template>
```

### Bottom Sheet 스펙
- 드래그 핸들: 32×4px
- Snap 포인트: collapsed / half / full
- max-height: 90vh

---

## 접근성 체크리스트

- [ ] `role="dialog"`, `aria-modal="true"`
- [ ] `aria-labelledby`로 제목 연결
- [ ] 포커스 트랩 (Tab이 모달 내부만 순환)
- [ ] Escape 키로 닫기
- [ ] 닫힐 때 트리거 요소로 포커스 복귀

```vue
<template>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    @keydown.esc="close"
  >
    <h2 id="modal-title">모달 제목</h2>
    <!-- 내용 -->
  </div>
</template>
```

> NuxtUI의 `UModal`은 기본적으로 접근성 요구사항을 충족합니다.

---

## 포커스 관리

```typescript
// composables/useModalFocus.ts
export function useModalFocus() {
  const triggerElement = ref<HTMLElement | null>(null);

  function open(trigger: HTMLElement) {
    triggerElement.value = trigger;
  }

  function close() {
    // 트리거로 포커스 복귀
    triggerElement.value?.focus();
    triggerElement.value = null;
  }

  return { open, close };
}
```

---

## 금지 패턴

```vue
<!-- 금지: 과도한 애니메이션 -->
<div class="animate-bounce">금지</div>

<!-- 금지: 배경 클릭 닫기 비활성화 (접근성 문제) -->
<u-modal :close-on-overlay-click="false">금지</u-modal>

<!-- 금지: ESC 키 닫기 비활성화 -->
<u-modal @keydown.esc.prevent>금지</u-modal>
```

---

## 권장 패턴

```vue
<template>
  <u-modal v-model="isOpen">
    <template #header>
      <h2 class="text-lg font-medium">명확한 제목</h2>
    </template>

    <div class="space-y-4">
      <!-- 구조화된 내용 -->
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <!-- 취소가 왼쪽, 확인이 오른쪽 -->
        <u-button variant="soft" @click="isOpen = false">취소</u-button>
        <u-button @click="handleConfirm">확인</u-button>
      </div>
    </template>
  </u-modal>
</template>
```
