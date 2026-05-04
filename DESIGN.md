# DESIGN.md - 피치CRM UI 프로토타입 디자인 시스템

> CRM Type 2 SaaS 플랫폼 UI 프로토타입의 디자인 규칙.  
> AI 에이전트는 UI 생성, 화면 수정, 디자인 판단 시 이 문서를 우선 참조한다.  
> 모든 응답, 코드 주석, 화면 문구, 커밋 메시지는 한글을 기본으로 한다.  
> 모든 컴포넌트 태그는 케밥케이스로 작성한다. 예: `<u-button>`, `<u-modal>`, `<p-input-box>`

---

## 1. 제품 방향

피치CRM은 **공통 CRM 코어 + 업종 특화 모듈**을 가진 업무용 SaaS 프로토타입이다. 화면은 마케팅 랜딩 페이지가 아니라, 운영자가 매일 반복해서 쓰는 백오피스 도구처럼 보여야 한다.

### 핵심 사용자

| 사용자 | 주요 업무 | UI 우선순위 |
|--------|----------|-------------|
| 센터 관리자 | 고객, 상담, 멤버십, 통계 확인 | 빠른 탐색, 요약, 상태 비교 |
| 상담/운영 담당자 | 고객 검색, 상담 등록, 메시지 발송 | 입력 효율, 오류 방지, 이력 추적 |
| 필라테스 강사 | 출석, 세션 기록, 회원 상태 메모 | 모바일 대응, 빠른 기록, 큰 터치 영역 |
| 부동산 담당자 | 매물 등록, 고객별 매칭 | 목록/상세 동시 비교, 필터링 |
| 경영/운영 리더 | KPI, AI 리포트 확인 | 핵심 숫자, 추세, 이상 징후 파악 |

### 디자인 톤

| 항목 | 기준 |
|------|------|
| 톤 | 신뢰감 있는 CRM SaaS, 정돈된 업무용 인터페이스 |
| 밀도 | Compact. 기본 폰트 14px, 테이블 셀 패딩 12px 8px |
| 분위기 | 깨끗하고 차분한 Blue 중심, 기능적 Emerald 보조 |
| 정보 구조 | 탐색보다 작업 흐름 우선. 첫 화면에서 사용 가능한 도구를 제공 |
| 장식 | 불필요한 배경 장식, 큰 히어로, 카드 남발 금지 |
| 반응형 | 데스크톱 백오피스 우선, 필라테스 강사/회원 화면은 모바일 우선 |

---

## 2. 프로젝트 구조와 화면 패턴

### 주요 모듈

| 영역 | 경로 | 디자인 성격 |
|------|------|-------------|
| 공통 레이아웃 | `src/modules/layout/` | CRM 상단 네비게이션, 가이드 레이아웃, 인트로 |
| 고객관리 | `src/modules-domain/customer/` | 검색, 목록, 상세 패널 중심 |
| 상담관리 | `src/modules-domain/consultation/` | 상담 CRUD, 메시지 발송, 이력 타임라인 |
| 필라테스 | `src/modules-domain/industry/pilates/` | 일정, 멤버십, 출석, 세션 기록 |
| 부동산 | `src/modules-domain/industry/realestate/` | 매물 목록, 고객 매칭, 상세 비교 |
| 통신 | `src/modules-domain/communication/` | 통화 이력, 녹취 상세, STT 텍스트 |
| 분석 | `src/modules-domain/analytics/` | KPI 카드, 차트, AI 리포트 |
| 가이드 | `src/modules/test-data/`, `src/modules-guide/` | UI 패턴 참조 코드 |

### 권장 UI 패턴

| 화면 유형 | 권장 패턴 | 사용 예 |
|----------|----------|---------|
| 일반 CRUD | `crud` | 고객 등록, 상담 등록, 멤버십 관리 |
| 상세 비교 | `two-depth` | 고객 목록 + 상세 패널, 매칭 시스템 |
| 일정/예약 | `calendar` | 필라테스 수업 관리 |
| 모바일 기록 | `mega-form` 또는 단계형 폼 | 세션 기록, 상태 지표 |
| 이력/피드 | `infinite-scroll` | 고객 히스토리, 상담 이력 |
| 통계 | 커스텀 대시보드 | KPI 모니터링, AI 리포트 |

---

## 3. 비주얼 원칙

### 기본 원칙

- 업무 화면은 **고밀도이되 답답하지 않게** 구성한다.
- 페이지 섹션은 카드처럼 띄우기보다, 전체 폭 레이아웃과 얇은 구분선으로 나눈다.
- 카드 중첩은 금지한다. 카드는 반복 항목, KPI, 모달 내부 블록에만 쓴다.
- CTA는 한 화면에 한 가지 주 액션만 명확하게 둔다.
- 호버/활성/선택 상태는 색과 선으로 표현하고, 확대/튀는 모션은 쓰지 않는다.
- 테이블, 폼, 모달은 기존 `test-data` 패턴을 우선 따른다.

### 금지 패턴

| 금지 | 예시 | 이유 |
|------|------|------|
| 그라데이션 남용 | `bg-gradient-to-*`, `from-*`, `to-*` | 업무용 CRM 톤과 맞지 않음 |
| 과한 그림자 | `shadow-xl`, `shadow-2xl` | 정보 밀도 저하 |
| 확대 효과 | `hover:scale-*`, 장식용 `transform` | 반복 업무 UI에서 피로감 발생 |
| 장식 애니메이션 | `animate-bounce`, 장식용 `animate-pulse` | 상태 피드백과 혼동 |
| 큰 랜딩식 히어로 | 거대한 문구 + 배경 그래픽 | 앱 첫 화면에서 작업 진입이 늦어짐 |
| 카드 안 카드 | `<u-card>` 중첩 | 구조가 무거워지고 위계가 흐려짐 |
| raw HTML 입력 | `<input>`, `<select>`, `<table>` 직접 작성 | 일관성, 접근성, 유지보수 저하 |
| Quill 신규 사용 | `p-editor-quill` 신규 화면 적용 | 신규 UI는 TinyMCE 사용 |

---

## 4. 색상 시스템

### Primary - CRM Blue

| 단계 | 값 | 용도 |
|------|----|------|
| 50 | `#eff6ff` | 선택/호버 배경 |
| 100 | `#dbeafe` | 활성 메뉴 배경 |
| 300 | `#93bbff` | 포커스 링 보조 |
| 500 | `#287dff` | Primary 버튼, 링크, 브랜드 강조 |
| 600 | `#1a6ae6` | Primary 호버 |
| 700 | `#0059e0` | Primary 눌림 |

> 신규 UI의 기준 primary는 `#287dff`이다.  
> 기존 공통 스타일에는 `#4096ff` 계열 legacy 토큰이 일부 남아 있으나, 신규 화면은 `#287dff` 기준으로 맞춘다.

### Secondary - Emerald

| 값 | 용도 |
|----|------|
| `#10b981` | 성공 상태, 엑셀, 긍정 액션 |
| `#059669` | 성공/엑셀 호버 |
| `#ecfdf5` | 성공 배경 |

### Neutral

| 값 | 용도 |
|----|------|
| `#ffffff` | 표면, 모달, 입력 배경 |
| `#f8fafc` | 페이지 보조 배경 |
| `#f0f2f5` | 앱 기본 배경 (`bg-bodyBg`) |
| `#f5f5f5` | 테이블 헤더 |
| `#e4e4e4` | 일반 테두리 |
| `#64748b` | 보조 텍스트 |
| `#374151` | 본문 텍스트 |
| `#1f1f1f` | 제목, 강조 텍스트 |

### 상태 색상

| 상태 | 색상 | 사용처 |
|------|------|--------|
| Success | `success`, `#10b981` | 저장 성공, 완료, 엑셀 |
| Warning | `warning`, `#f59e0b` | 주의, 임계치, 대기 |
| Error | `error`, `#ef4444` | 오류, 삭제, 실패 |
| Info | `info`, `#3b82f6` | 안내, 보조 정보 |
| PDF | `#ff2e00` | PDF 출력 전용 |

### 다크 모드

다크 모드는 `dark:` 클래스 기반으로 지원한다. 라이트 모드만 가정한 색상 하드코딩은 금지한다.

| 용도 | 값 |
|------|----|
| 배경 | `#141414` |
| 표면 | `#1f1f1f`, `#272727` |
| 테두리 | `#424242` |
| 본문 텍스트 | `#d9d9d9` |
| 선택 배경 | `#111a2c` |

---

## 5. 타이포그래피

### 폰트

```css
Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

본문 기본은 Pretendard이다. `Inter`, `Roboto`, `Arial`을 화면별로 새로 지정하지 않는다.

### 크기

| 토큰 | 크기 | 용도 |
|------|------|------|
| `text-xs` | 12px | 보조 라벨, 뱃지, 메타 |
| `text-sm` | 14px | 기본 본문, 테이블, 폼 |
| `text-base` | 16px | 섹션 제목, 모달 제목 보조 |
| `text-lg` | 18px | 페이지 제목, 주요 섹션 |
| `text-xl` | 20px | KPI 소형 숫자 |
| `text-2xl` | 24px | KPI 주요 숫자 |
| `text-[30px]` | 30px | 대시보드 대표 지표만 허용 |

### 규칙

- 화면 내부 카드/패널 제목은 `text-sm` 또는 `text-base`를 우선한다.
- 히어로급 큰 글자는 인트로 화면 외에는 쓰지 않는다.
- 글자 간격은 기본값을 유지한다. 음수 letter-spacing 금지.
- 긴 한글 라벨은 줄바꿈을 허용하고, 버튼 안에서 잘리지 않게 한다.

---

## 6. 레이아웃 시스템

### CRM 앱 레이아웃

| 레이아웃 | 파일 | 용도 |
|----------|------|------|
| CRM | `src/modules/layout/crm-layout.vue` | 고객, 상담, 업종, 통신, 분석 업무 화면 |
| Guide | `src/modules/layout/guide-layout.vue` | UI 패턴/도메인 예시 |
| Intro | `src/modules/layout/intro-layout.vue` | 인트로, 스페이스 선택 |

### 레이아웃 규칙

- 상단 네비게이션은 현재 위치와 업무 영역을 즉시 알 수 있어야 한다.
- 본문은 `p-4`, `gap-4` 기준으로 구성한다.
- 테이블 화면은 검색 영역, 액션 영역, 테이블, 페이지네이션 순서로 배치한다.
- 모바일에서는 검색 조건을 세로로 쌓고, 주요 액션은 하단 또는 상단 우측에 둔다.
- 필라테스 강사/회원 화면은 터치 영역 최소 높이 40px 이상을 지킨다.

### 반응형 기준

| 기준 | 사용 |
|------|------|
| 기본 | 모바일 1열 |
| `md:` | 폼 2열 전환 |
| `lg:` | 백오피스 좌우 분할, 테이블 여백 확장 |
| 테이블 | `overflow-x-auto`, `min-w-[600px]` 이상 |

---

## 7. Nuxt UI 사용 규칙

Nuxt UI v4 컴포넌트를 우선 사용한다. 태그는 케밥케이스로 작성한다.

### 버튼

```vue
<u-button color="primary" variant="solid" size="lg">저장</u-button>
<u-button color="neutral" variant="outline" size="lg">취소</u-button>
<u-button color="success" variant="solid" size="lg">엑셀 다운로드</u-button>
<u-button icon="i-lucide-search" color="neutral" variant="ghost" size="lg" />
```

| 액션 | 규칙 |
|------|------|
| 저장/제출 | `color="primary" variant="solid"` |
| 취소/닫기 | `color="neutral" variant="outline"` |
| 삭제 | `color="error" variant="solid"` 또는 confirm 모달 |
| 엑셀 | `color="success" variant="solid"` 또는 `.btn-excel` |
| PDF | `.btn-pdf` |
| 아이콘 버튼 | lucide 아이콘 우선, 툴팁 제공 |

버튼 그룹 순서는 `[보조 액션] [취소] [주 액션]`을 기본으로 한다.

### 폼

```vue
<u-form :state="form" :schema="schema" @submit="onSubmit">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <u-form-field label="고객명" name="customerName" required>
      <u-input v-model="form.customerName" size="lg" class="w-full" />
    </u-form-field>
  </div>
</u-form>
```

폼 규칙:

- 일반 텍스트는 `<u-input>`을 사용한다.
- 금액, 전화번호, 사업자번호 등 포맷 입력은 `<p-input-box>`를 사용한다.
- 날짜는 `<p-date-picker-work>` 또는 프로젝트 래퍼 컴포넌트를 사용한다.
- 폼 행 레이아웃은 `<p-form-row>`를 우선 검토한다.
- 유효성 검사는 Yup 패턴을 따른다.

### 셀렉트

```vue
<u-select v-model="status" :items="statusItems" size="lg" class="w-full" />
<p-nuxt-select v-model="managerId" :options="managerOptions" class="w-full" />
```

검색 가능한 셀렉트나 공통 옵션 포맷이 필요한 경우 `<p-nuxt-select>`를 우선한다.

### 모달

```vue
<u-modal v-model:open="open" title="고객 등록" :ui="{ content: 'max-w-[900px]' }">
  <template #body>
    ...
  </template>
</u-modal>
```

모달 규칙:

- 일반 등록/수정 모달 최대 너비는 `max-w-[900px]`를 기준으로 한다.
- 삭제/위험 액션은 `<p-modal-confirm>`을 사용한다.
- 단순 알림은 `<p-modal-alert>`를 사용한다.
- 모달 내부에 별도 카드 중첩을 만들지 않는다.

### 테이블

```vue
<u-table :data="rows" :columns="columns" class="table_work" />
```

테이블 규칙:

- raw `<table>` 직접 작성은 피한다.
- 업무 테이블은 `.table_work` 스타일을 우선 사용한다.
- 헤더는 줄바꿈을 피하고, 값이 긴 컬럼은 본문에서 말줄임 또는 줄바꿈을 제어한다.
- 숫자, 금액, 횟수는 우측 정렬한다.
- 선택 행은 `#e6f4ff` 계열 배경을 사용한다.

### 배지

```vue
<u-badge color="primary" variant="soft">신규</u-badge>
<u-badge color="success" variant="soft">완료</u-badge>
<u-badge color="warning" variant="soft">주의</u-badge>
<u-badge color="error" variant="soft">실패</u-badge>
<u-badge color="neutral" variant="outline">대기</u-badge>
```

상태 배지는 색상만으로 의미를 전달하지 말고, 텍스트를 반드시 함께 제공한다.

---

## 8. 공통 p- 컴포넌트

`src/modules/_common/components/`의 공통 컴포넌트를 우선 사용한다.

| 컴포넌트 | 용도 |
|----------|------|
| `<p-input-box>` | 금액, 전화번호, 주민번호, 사업자번호 등 포맷 입력 |
| `<p-input-row-box>` | 행 형태 입력 박스 |
| `<p-nuxt-select>` | 검색/공통 옵션 셀렉트 |
| `<p-select-box>` | 일반 셀렉트 |
| `<p-checkbox>` | 체크박스 |
| `<p-radiobox>` | 라디오 |
| `<p-toggle-checkbox>` | 토글 |
| `<p-form-row>` | 폼 행 레이아웃 |
| `<p-button>` | 프로젝트 공통 버튼 |
| `<p-tab-list>`, `<p-tab-content>` | 탭 |
| `<p-tooltip>` | 툴팁 |
| `<p-modal-alert>` | 알림 모달 |
| `<p-modal-confirm>` | 확인 모달 |
| `<p-date-picker-work>` | 단일 날짜 |
| `<p-date-picker-multi-work>` | 다중 날짜 |
| `<p-day-select>` | 요일/빠른 날짜 선택 |
| `<p-pagination-work>` | 페이지네이션 |
| `<p-file-upload>` | 파일 업로드 |
| `<tiny-editor>` | 리치 텍스트 에디터 |

### 리치 텍스트

- 신규 화면은 `tiny-editor`를 사용한다.
- `p-editor-quill`은 기존 가이드/레거시 호환 목적으로만 둔다.
- 신규 기능에서 Quill 기반 UI를 추가하지 않는다.

---

## 9. 도메인별 디자인 규칙

### 고객관리

- 목록, 검색, 상세 패널의 세 흐름을 빠르게 오갈 수 있어야 한다.
- 고객명, 연락처, 태그, 최근 상담일, 상태를 표에서 우선 노출한다.
- 상세 패널은 기본 정보, 상담 이력, 메시지 이력, 업종별 정보를 탭으로 분리한다.
- 위험 정보나 VIP 표시는 배지와 얇은 강조선으로 처리한다.

### 상담관리

- 상담 등록은 빠른 입력이 핵심이다. 상담 내용, 후속 액션, 메시지 발송 여부를 한 화면에 배치한다.
- 메시지 발송 화면은 템플릿 선택, 미리보기, 수신자 확인 순서로 구성한다.
- 상담 이력은 시간순 스캔이 쉬운 타임라인 또는 리스트 형태를 권장한다.

### 필라테스

- 강사 화면은 모바일 터치 사용을 기준으로 한다.
- 세션 기록은 통증, 가동범위, 자세, 근피로, 유연성, 호흡 등의 상태 지표를 빠르게 선택하도록 한다.
- 5회/10회 등 임계치 도달 상태는 `warning` 배지와 보조 설명으로 표시한다.
- 회원 보고서는 그래프, 변화 요약, 수업별 메모 순서로 읽히게 한다.

### 부동산

- 매물 목록은 지역, 거래 유형, 가격, 면적, 상태를 한눈에 비교할 수 있어야 한다.
- 매칭 시스템은 `two-depth` 패턴을 우선한다.
- 좌측은 고객/조건, 우측은 추천 매물과 매칭 근거를 보여준다.
- 계약/마감 등 상태는 강한 색보다 배지와 필터로 관리한다.

### 통신

- 통화 이력은 시간, 발신/수신, 고객 매칭, 상담 연결 여부를 우선 노출한다.
- 녹취 상세는 플레이어, STT 텍스트, 요약, 감정/키워드 분석 순서로 배치한다.
- 민감 정보는 과도하게 강조하지 않고 필요한 맥락에서만 표시한다.

### 통계/분석

- KPI 카드는 4개 내외 단위로 묶고, 숫자와 전일/전주 대비 변화율을 함께 제공한다.
- 차트는 색을 많이 쓰지 말고 primary, emerald, warning, neutral 조합으로 제한한다.
- AI 리포트는 결론, 근거 데이터, 추천 액션 순서로 구성한다.

---

## 10. 간격, 반경, 깊이

### 간격

| 상황 | 기준 |
|------|------|
| 페이지 padding | `p-4` |
| 섹션 간격 | `gap-4`, `space-y-4` |
| 폼 필드 간격 | `gap-4` |
| 버튼 간격 | `gap-2` |
| 테이블 셀 | `12px 8px` |

### 반경

| 클래스 | 사용 |
|--------|------|
| `rounded-sm` | 뱃지, 작은 상태 요소 |
| `rounded-md` | 버튼, 입력 |
| `rounded-lg` | 카드, 모달, 드롭다운 |

`rounded-xl` 이상은 특별한 화면 경험이 필요한 경우에만 사용한다. 일반 업무 UI에서는 기본적으로 쓰지 않는다.

### 그림자

| 클래스 | 사용 |
|--------|------|
| `shadow-sm` | 헤더, 얕은 표면 |
| `shadow` | 드롭다운, 모달 보조 |

`shadow-lg` 이상은 신규 UI에서 사용하지 않는다.

---

## 11. 접근성과 사용성

- 모든 아이콘 버튼에는 툴팁 또는 `aria-label`을 제공한다.
- 색상만으로 상태를 구분하지 않는다. 텍스트와 배지를 함께 쓴다.
- 폼 필수값은 `required`와 라벨 표시를 함께 적용한다.
- 모달 닫기, 저장, 취소 흐름은 키보드 사용을 방해하지 않는다.
- 모바일 터치 타깃은 최소 40px 높이를 확보한다.
- 로딩은 버튼 비활성, 스켈레톤, 짧은 상태 문구로 표현한다.
- 빈 상태는 원인과 다음 액션을 함께 보여준다.

---

## 12. AI 에이전트 작업 규칙

UI 작업 시 아래 순서를 따른다.

1. `gen-design` 기준으로 화면 목적, 사용자, 핵심 작업, 제약을 확인한다.
2. `gen-ui` 기준으로 UI 패턴을 선택한다.
3. `src/modules/test-data/`의 기존 패턴을 먼저 확인한다.
4. Store와 타입이 있으면 그 인터페이스를 기준으로 화면을 만든다.
5. 신규 UI는 Nuxt UI와 `p-` 공통 컴포넌트를 우선 사용한다.
6. AI Slop 금지 패턴을 점검한다.
7. 완료 전 `bun run lint`, `bun run build`를 확인한다.
8. 타입 체크는 `bun run build:check`를 목표로 하되, 기존 레거시 타입 오류가 있으면 원인과 범위를 보고한다.

### 코드 작성 규칙

- `<script setup lang="ts">`를 사용한다.
- 컴포넌트 태그는 케밥케이스로 작성한다.
- 단일 사용처 추상화를 만들지 않는다.
- 색상은 가능한 토큰, CSS 변수, Nuxt UI color를 사용한다.
- Tailwind 클래스가 길어지면 배열 바인딩으로 묶는다.
- 신규 주석은 복잡한 의도를 설명할 때만 추가한다.
- 요청 범위 밖의 리팩토링은 하지 않는다.

### 검증 체크리스트

```text
□ 현재 도메인과 사용자 목적에 맞는 화면인가
□ 기존 test-data 패턴과 충돌하지 않는가
□ Nuxt UI 또는 p- 공통 컴포넌트를 우선 사용했는가
□ primary #287dff 기준을 지켰는가
□ 다크 모드에서 텍스트/배경 대비가 깨지지 않는가
□ 카드 중첩, 그라데이션, 과한 그림자, hover scale이 없는가
□ 모바일에서 텍스트와 버튼이 겹치지 않는가
□ lint/build 결과를 확인했는가
```

---

## 13. 현재 설정 기준

| 항목 | 현재 기준 |
|------|----------|
| 프레임워크 | Vue 3 + TypeScript + Vite |
| UI | Nuxt UI v4 |
| 스타일 | TailwindCSS v4 |
| 상태관리 | Pinia |
| 차트 | ApexCharts |
| 리치 텍스트 | TinyMCE 우선 |
| 실행 | `bun start` |
| 빌드 | `bun run build` |
| 린트 | `bun run lint` |

이 문서는 프로토타입의 기준 문서다. 코드와 문서가 다를 경우, 신규 화면은 이 문서를 우선하고 기존 화면은 별도 리팩토링 요청이 있을 때만 수정한다.
