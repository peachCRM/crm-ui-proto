# 네비게이션 디자인 가이드

## 사이드바 패턴

| 유형 | 너비 | 용도 |
|------|------|------|
| **Full** | 240-280px | 콘텐츠 앱, 대시보드 |
| Collapsed | 60-72px | 공간 절약 |
| Rail | 80px | 아이콘+레이블 하이브리드 |

---

## Navbar 패턴

| 패턴 | 설명 |
|------|------|
| Static | 고정 위치 없음 |
| Sticky | 스크롤 시 상단 고정 |
| Hide on scroll | 아래 스크롤 시 숨김, 위로 스크롤 시 표시 |
| Transparent → solid | 스크롤 시 배경 추가 |

---

## Tab 디자인

- 높이: 최소 **48px**
- 하단 인디케이터: **2-3px**
- 슬라이드 애니메이션: **200ms**

---

## 사이드바 구현

### 기본 사이드바

```vue
<script setup>
const isCollapsed = ref(false);

const menuItems = [
  { icon: 'i-heroicons-home', label: '대시보드', to: '/' },
  { icon: 'i-heroicons-users', label: '사용자', to: '/users' },
  { icon: 'i-heroicons-document', label: '문서', to: '/documents' },
  { icon: 'i-heroicons-cog', label: '설정', to: '/settings' },
];
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-screen bg-white border-r border-neutral-200',
      'transition-all duration-200',
      isCollapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- 로고 -->
    <div class="h-16 flex items-center px-4 border-b border-neutral-200">
      <img v-if="!isCollapsed" src="/logo.svg" class="h-8" alt="Logo" />
      <img v-else src="/logo-icon.svg" class="h-8 mx-auto" alt="Logo" />
    </div>

    <!-- 메뉴 -->
    <nav class="p-2">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.to">
          <nuxt-link
            :to="item.to"
            :class="[
              'flex items-center gap-3 px-3 py-2 rounded-md',
              'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
              'transition-colors duration-150',
              isCollapsed && 'justify-center'
            ]"
            active-class="bg-primary-50 text-primary-600"
          >
            <icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>

    <!-- 접기 버튼 -->
    <button
      class="absolute bottom-4 right-[-12px] w-6 h-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center"
      @click="isCollapsed = !isCollapsed"
    >
      <icon
        :name="isCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'"
        class="w-4 h-4"
      />
    </button>
  </aside>
</template>
```

### 중첩 메뉴

```vue
<script setup>
const expandedMenus = ref<string[]>([]);

const menuItems = [
  { icon: 'i-heroicons-home', label: '대시보드', to: '/' },
  {
    icon: 'i-heroicons-users',
    label: '사용자 관리',
    children: [
      { label: '사용자 목록', to: '/users' },
      { label: '권한 관리', to: '/users/permissions' },
    ],
  },
];

function toggleMenu(label: string) {
  const index = expandedMenus.value.indexOf(label);
  if (index === -1) {
    expandedMenus.value.push(label);
  } else {
    expandedMenus.value.splice(index, 1);
  }
}
</script>

<template>
  <nav class="p-2">
    <ul class="space-y-1">
      <li v-for="item in menuItems" :key="item.label">
        <!-- 단일 메뉴 -->
        <nuxt-link
          v-if="!item.children"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100"
        >
          <icon :name="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </nuxt-link>

        <!-- 중첩 메뉴 -->
        <div v-else>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100"
            @click="toggleMenu(item.label)"
          >
            <icon :name="item.icon" class="w-5 h-5" />
            <span class="flex-1 text-left">{{ item.label }}</span>
            <icon
              :name="expandedMenus.includes(item.label) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="w-4 h-4"
            />
          </button>

          <ul v-show="expandedMenus.includes(item.label)" class="ml-8 mt-1 space-y-1">
            <li v-for="child in item.children" :key="child.to">
              <nuxt-link
                :to="child.to"
                class="block px-3 py-2 rounded-md text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              >
                {{ child.label }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>
```

---

## 탭 네비게이션

### NuxtUI 탭

```vue
<script setup>
const tabs = [
  { label: '기본 정보', slot: 'basic' },
  { label: '상세 정보', slot: 'detail' },
  { label: '첨부 파일', slot: 'files' },
];
</script>

<template>
  <u-tabs :items="tabs">
    <template #basic>
      <div class="p-4">기본 정보 내용</div>
    </template>
    <template #detail>
      <div class="p-4">상세 정보 내용</div>
    </template>
    <template #files>
      <div class="p-4">첨부 파일 내용</div>
    </template>
  </u-tabs>
</template>
```

### 커스텀 탭

```vue
<script setup>
const activeTab = ref('basic');
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'detail', label: '상세 정보' },
  { id: 'files', label: '첨부 파일' },
];
</script>

<template>
  <div>
    <!-- 탭 헤더 -->
    <div class="border-b border-neutral-200">
      <nav class="flex gap-4 px-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'relative py-3 text-sm font-medium transition-colors duration-150',
            activeTab === tab.id
              ? 'text-primary-600'
              : 'text-neutral-500 hover:text-neutral-700'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <!-- 인디케이터 -->
          <span
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
          />
        </button>
      </nav>
    </div>

    <!-- 탭 콘텐츠 -->
    <div class="p-4">
      <div v-show="activeTab === 'basic'">기본 정보</div>
      <div v-show="activeTab === 'detail'">상세 정보</div>
      <div v-show="activeTab === 'files'">첨부 파일</div>
    </div>
  </div>
</template>
```

---

## 브레드크럼

```vue
<script setup>
const breadcrumbs = [
  { label: '홈', to: '/' },
  { label: '사용자 관리', to: '/users' },
  { label: '사용자 상세' },
];
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2">
        <nuxt-link
          v-if="crumb.to"
          :to="crumb.to"
          class="text-neutral-500 hover:text-neutral-700"
        >
          {{ crumb.label }}
        </nuxt-link>
        <span v-else class="text-neutral-900 font-medium">{{ crumb.label }}</span>

        <icon
          v-if="index < breadcrumbs.length - 1"
          name="i-heroicons-chevron-right"
          class="w-4 h-4 text-neutral-400"
        />
      </li>
    </ol>
  </nav>
</template>
```

---

## 접근성 체크리스트

- [ ] `<nav>` + `aria-label`
- [ ] 현재 페이지: `aria-current="page"`
- [ ] 드롭다운: `aria-expanded` 사용
- [ ] 키보드 접근: Tab, Enter, Space, Arrow keys

```vue
<template>
  <nav aria-label="메인 네비게이션">
    <ul>
      <li>
        <nuxt-link
          to="/dashboard"
          :aria-current="$route.path === '/dashboard' ? 'page' : undefined"
        >
          대시보드
        </nuxt-link>
      </li>
      <li>
        <button
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          설정
        </button>
        <ul v-show="isMenuOpen" role="menu">
          <li role="menuitem"><a href="/settings/profile">프로필</a></li>
          <li role="menuitem"><a href="/settings/security">보안</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
```

---

## 금지 패턴

```vue
<!-- 금지: aria-current 없는 현재 페이지 표시 -->
<a href="/" class="text-primary-500">현재 페이지</a>

<!-- 금지: 키보드로 접근 불가능한 드롭다운 -->
<div @mouseenter="openMenu">메뉴</div>

<!-- 금지: 과도한 애니메이션 -->
<nav class="animate-pulse">...</nav>
```

---

## 권장 패턴

```vue
<template>
  <nav aria-label="메인 네비게이션">
    <ul class="flex items-center gap-4">
      <li v-for="item in menuItems" :key="item.to">
        <nuxt-link
          :to="item.to"
          :aria-current="$route.path === item.to ? 'page' : undefined"
          :class="[
            'px-3 py-2 rounded-md text-sm font-medium',
            'transition-colors duration-150',
            $route.path === item.to
              ? 'bg-primary-50 text-primary-600'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          ]"
        >
          {{ item.label }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
```
