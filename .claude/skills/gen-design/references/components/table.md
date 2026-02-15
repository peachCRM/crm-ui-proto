# 테이블 디자인 가이드

## 반응형 패턴

| 패턴                  | 설명                   | 용도           |
| --------------------- | ---------------------- | -------------- |
| **Horizontal scroll** | 컨테이너 내 스크롤     | 데이터 비교    |
| Card stack            | 모바일에서 카드로 변환 | 단순 데이터    |
| Priority columns      | 비필수 컬럼 숨김       | 복잡한 테이블  |
| Sticky column         | 첫 컬럼 고정           | ID 기반 데이터 |

---

## 크기 가이드

| 요소             | 값      |
| ---------------- | ------- |
| 행 높이 (편안함) | 48-56px |
| 행 높이 (밀집)   | 36-40px |
| 헤더 높이        | 40-48px |
| 셀 패딩          | 12-16px |

---

## Pagination

프로젝트 표준 페이지 크기: **10, 20, 30, 50, 100 per page**

---

## 프로젝트 테이블 스타일 클래스

> 프로젝트에서 정의된 커스텀 테이블 스타일입니다.

### 스타일 클래스 종류

| 클래스                | 용도                        | 특징                        |
| --------------------- | --------------------------- | --------------------------- |
| `.table`              | 기본 테이블                 | 단순 데이터 표시            |
| `.table_work`         | 작업용 테이블 (라이트 모드) | 호버 효과, 선택 행 강조     |
| `.table_work_dark`    | 작업용 테이블 (다크 모드)   | 다크 테마 색상              |
| `.table_report`       | 리포트/인쇄용 테이블        | 조밀한 패딩, 인쇄 최적화    |
| `.easy-rounded-table` | easy-data-table 둥근 모서리 | vue3-easy-data-table 전용   |

---

### .table (기본 테이블)

```css
.table th {
  font-weight: normal;
  padding: 15px 5px;
  border-left: 1px solid #dcdcdd;
  border-top: 1px solid #dcdcdd;
  border-bottom: 1px solid #dcdcdd;
  font-size: 15px;
  color: #444444;
  background-color: #fafafc;
}

.table td {
  font-weight: light;
  padding: 15px 5px;
  border-left: 1px solid #dcdcdd;
  border-bottom: 1px solid #dcdcdd;
  font-size: 15px;
  color: #666666;
  text-align: center;
}
```

---

### .table_work (작업용 테이블 - 라이트 모드)

```css
.table_work {
  min-width: 600px;
}

.table_work th {
  font-weight: semibold;
  padding: 12px 8px;
  box-shadow: inset 0 -1px #e4e4e4, inset 0 1px #e4e4e4;
  font-size: 14px;
  line-height: 22px;
  color: #1f1f1f;
  background-color: #f5f5f5;
}

.table_work td {
  font-weight: light;
  padding: 12px 8px;
  border-bottom: 1px solid #dcdcdd;
  font-size: 14px;
  line-height: 22px;
  color: #1f1f1f;
  background-color: #fff;
  text-align: center;
}

/* 호버 효과 */
.table_work tr:hover td {
  background-color: #e6f4ff;
}

/* 선택된 행 */
.table_work tr.select td {
  background-color: #e6f4ff;
}

/* 강조 행 (노란색) */
.table_work tr.bg-tr td {
  background: #ffff99;
}

/* 비활성 행 (회색) */
.table_work tr.bg-tr-gray td {
  background: #e4e4e4;
}
```

---

### .table_work_dark (작업용 테이블 - 다크 모드)

```css
.table_work_dark th {
  font-weight: semibold;
  padding: 12px 8px;
  border-top: 1px solid #424242;
  border-bottom: 1px solid #424242;
  font-size: 14px;
  line-height: 22px;
  color: #d9d9d9;
  background-color: #141414;
}

.table_work_dark td {
  font-weight: light;
  padding: 12px 8px;
  border-bottom: 1px solid #303030;
  font-size: 14px;
  line-height: 22px;
  color: #d9d9d9;
  background-color: #141414;
  text-align: center;
}

/* 선택된 행 (다크 모드) */
.table_work_dark tr.select td {
  background-color: #111a2c;
}
```

---

### .table_report (리포트/인쇄용 테이블)

```css
.table_report {
  border-top: 2px solid #888888;
}

.table_report th {
  font-weight: normal;
  padding: 4px;
  border-left: 1px solid #9d9d9d;
  border-bottom: 1px solid #9d9d9d;
  font-size: var(--text-fontsize14);
  word-break: keep-all;
}

.table_report td {
  font-weight: light;
  padding: 4px;
  border-left: 1px solid #9d9d9d;
  border-bottom: 1px solid #9d9d9d;
  font-size: var(--text-fontsize14);
  text-align: center;
}

/* 변형: v1 (파란 배경 헤더) */
.table_report.v1 th {
  font-size: 16px;
  background-color: #dfeaf5;
}

/* 변형: v2 (좁은 줄간격) */
.table_report.v2 th,
.table_report.v2 td {
  line-height: 120%;
}
```

---

## vue3-easy-data-table (프로젝트 기준)

> 프로젝트에서는 `vue3-easy-data-table`을 주로 사용합니다.

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
        <u-button size="sm" color="neutral" variant="soft" @click="remove(item.id)">
          삭제
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

### Header 정의 옵션

```typescript
interface Header {
  text: string; // 헤더 텍스트
  value: string; // 데이터 키
  width?: number; // 컬럼 너비 (px)
  sortable?: boolean; // 정렬 가능 여부
  fixed?: boolean; // 고정 컬럼 여부
}
```

### 다크모드 적용

```vue
<template>
  <easy-data-table
    :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
    theme-color="#4096ff"
    ...
  />
</template>
```

---

## 정렬/필터 드롭다운

```vue
<template>
  <div class="flex items-center gap-3">
    <p-nuxt-select
      v-model="listParams.sortData"
      :options="sortList"
      value-key="value"
      class="w-[120px]"
      @change="handleSortChange"
    />
    <p-nuxt-select
      v-model="listParams.row"
      :options="rowList"
      value-key="value"
      class="w-22"
      @change="listAction"
    />
  </div>
</template>

<script setup>
const sortList = [
  { text: '등록일순', value: 'insertDate,asc' },
  { text: '등록일역순', value: 'insertDate,desc' }
];

const rowList = [
  { text: '10개', value: 10 },
  { text: '20개', value: 20 },
  { text: '50개', value: 50 },
  { text: '100개', value: 100 }
];
</script>
```

---

## NuxtUI 테이블 사용

### 기본 테이블

```vue
<script setup>
const columns = [
  { key: 'name', label: '이름' },
  { key: 'email', label: '이메일' },
  { key: 'role', label: '역할' },
  { key: 'status', label: '상태' },
  { key: 'actions', label: '' }
];

const rows = [
  { id: 1, name: '홍길동', email: 'hong@example.com', role: '관리자', status: '활성' },
  { id: 2, name: '김철수', email: 'kim@example.com', role: '편집자', status: '활성' }
];
</script>

<template>
  <u-table :rows="rows" :columns="columns">
    <template #status-data="{ row }">
      <u-badge :color="row.status === '활성' ? 'green' : 'gray'">
        {{ row.status }}
      </u-badge>
    </template>

    <template #actions-data="{ row }">
      <div class="flex gap-1">
        <u-button size="xs" variant="ghost" icon="i-heroicons-pencil" />
        <u-button size="xs" variant="ghost" color="red" icon="i-heroicons-trash" />
      </div>
    </template>
  </u-table>
</template>
```

---

## 빈 상태

```vue
<template>
  <u-table :rows="rows" :columns="columns">
    <template #empty>
      <div class="text-center py-12">
        <u-icon name="i-heroicons-inbox" class="w-12 h-12 mx-auto text-neutral-300" />
        <p class="text-sm text-neutral-500 mt-4">데이터가 없습니다</p>
        <u-button class="mt-4" size="sm" @click="refresh">새로고침</u-button>
      </div>
    </template>
  </u-table>
</template>
```

---

## 로딩 상태

```vue
<template>
  <u-table :rows="rows" :columns="columns" :loading="isLoading">
    <template #loading>
      <div class="text-center py-12">
        <u-spinner class="mx-auto" />
        <p class="text-sm text-neutral-500 mt-4">데이터 로딩 중...</p>
      </div>
    </template>
  </u-table>
</template>
```

---

## 반응형 테이블

### Horizontal Scroll (권장)

```vue
<template>
  <div class="overflow-x-auto">
    <easy-data-table
      class="easy-rounded-table min-w-[800px]"
      ...
    />
  </div>
</template>
```

### 모바일 카드 스택

```vue
<template>
  <!-- 데스크톱: 테이블 -->
  <div class="hidden md:block">
    <easy-data-table ... />
  </div>

  <!-- 모바일: 카드 리스트 -->
  <div class="md:hidden space-y-4">
    <u-card v-for="row in listData" :key="row.id">
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-xs text-neutral-500">이름</span>
          <span class="font-medium">{{ row.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-neutral-500">이메일</span>
          <span>{{ row.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-neutral-500">상태</span>
          <u-badge :color="row.status === '활성' ? 'green' : 'gray'">
            {{ row.status }}
          </u-badge>
        </div>
      </div>
    </u-card>
  </div>
</template>
```

---

## 테이블 색상 참조

### 라이트 모드

| 요소       | 색상      | 코드      |
| ---------- | --------- | --------- |
| 헤더 배경  | 연한 회색 | `#f5f5f5` |
| 헤더 텍스트| 어두운 회색| `#1f1f1f` |
| 셀 배경    | 흰색      | `#ffffff` |
| 셀 텍스트  | 어두운 회색| `#1f1f1f` |
| 테두리     | 연한 회색 | `#dcdcdd` |
| 호버 배경  | 연한 파랑 | `#e6f4ff` |
| 선택 배경  | 연한 파랑 | `#e6f4ff` |

### 다크 모드

| 요소       | 색상      | 코드      |
| ---------- | --------- | --------- |
| 헤더 배경  | 어두운 회색| `#141414` |
| 헤더 텍스트| 연한 회색 | `#d9d9d9` |
| 셀 배경    | 어두운 회색| `#141414` |
| 셀 텍스트  | 연한 회색 | `#d9d9d9` |
| 테두리     | 중간 회색 | `#303030` |
| 선택 배경  | 어두운 파랑| `#111a2c` |

---

## 접근성 체크리스트

- [ ] `<caption>` 테이블 제목
- [ ] `<th>` + `scope="col|row"` 헤더
- [ ] 복잡한 테이블: `headers` 속성
- [ ] 정렬 상태: `aria-sort` 속성

```vue
<template>
  <table>
    <caption class="sr-only">사용자 목록</caption>
    <thead>
      <tr>
        <th scope="col" :aria-sort="getSortDirection('name')">이름</th>
        <th scope="col">이메일</th>
        <th scope="col">상태</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.status }}</td>
      </tr>
    </tbody>
  </table>
</template>
```

---

## 금지 패턴

```vue
<!-- 금지: 스크롤 없는 넘치는 테이블 -->
<table class="w-full">...</table>

<!-- 금지: 테이블 헤더 없음 -->
<table>
  <tbody>...</tbody>
</table>

<!-- 금지: 과도한 호버 효과 -->
<tr class="hover:scale-105 hover:shadow-xl">...</tr>
```

---

## 권장 패턴

```vue
<template>
  <div class="overflow-x-auto">
    <easy-data-table
      v-model:server-options="listParams"
      :table-class-name="themeStore.isDarkMode ? 'dark-mode-table' : ''"
      class="easy-rounded-table"
      theme-color="#4096ff"
      :headers="headers"
      :items="listData"
      :server-items-length="listTotalRow"
      server-side-sorting
      header-text-direction="center"
      body-text-direction="center"
      hide-footer
      @click-row="onTableRowClick"
    >
      <!-- 상태 배지 -->
      <template #item-status="item">
        <u-badge :color="getStatusColor(item.status)">
          {{ item.status }}
        </u-badge>
      </template>

      <!-- 액션 버튼 -->
      <template #item-handle="item">
        <div class="flex justify-center gap-2">
          <u-button size="sm" color="neutral" variant="soft" @click="edit(item)">
            수정
          </u-button>
          <u-button size="sm" color="red" variant="soft" @click="remove(item)">
            삭제
          </u-button>
        </div>
      </template>
    </easy-data-table>
  </div>

  <!-- 페이지네이션 -->
  <div class="flex justify-center mt-4">
    <u-pagination
      v-model:page="listParams.page"
      :items-per-page="listParams.row"
      :total="listTotalRow"
    />
  </div>
</template>
```
