# 피치CRM UI 프로토타입 에이전트 가이드

> **목적**: CRM Type 2 SaaS 플랫폼의 UI 프로토타입을 빠르고 일관되게 생성하기 위한 에이전트 행동 규칙
> **기반 PRD**: CRM Type 2 아키텍처 + 필라테스 회원 관리 다이어그램
> **기술 스택**: Vue 3.5 + TypeScript 5.7 + Nuxt UI v4 + TailwindCSS v4 + Pinia v3 + Vite v6

---

## 1. 프로젝트 컨텍스트

### 1.1 시스템 구조

피치CRM Type 2는 **공통 CRM 코어 + 업종 특화 모듈** 아키텍처를 따른다.

| 레이어 | 설명 |
|--------|------|
| **공통 CRM 코어** | 고객관리, 상담, 메시징(카카오/SMS/메일), 파일, 알림, 통계 |
| **업종 특화 모듈** | 필라테스(세션기록, 상태지표, 동작태깅, 보고서), 부동산(매물, 매칭, 계약) |
| **통신 기능** | 전화연동(CTI), 음성녹취, AI 분석(STT/감정/요약) |
| **분석/통계** | KPI 모니터링, AI 리포트, 대시보드 |

### 1.2 모듈 구성

```
src/
├── modules/                  # 공통 인프라 모듈
│   ├── _common/              # 공통 컴포넌트/유틸/스토어
│   ├── intro/                # 인트로/로그인 화면
│   ├── layout/               # 앱 레이아웃
│   ├── left-menu/            # 좌측 네비게이션 메뉴
│   ├── space/                # 워크스페이스
│   └── test-data/            # 가이드 코드 (패턴 참조용)
│
├── modules-domain/           # 도메인 비즈니스 모듈
│   ├── analytics/            # 통계/분석 (KPI, AI 리포트)
│   ├── communication/        # 통신 (통화이력, 녹취)
│   ├── consultation/         # 상담관리 (등록, 알림톡/SMS, 이력)
│   ├── customer/             # 고객관리 (등록, 검색, 히스토리)
│   └── industry/             # 업종특화
│       ├── pilates/          # 필라테스 (수업, 멤버십, 출석, 세션기록)
│       └── realestate/       # 부동산 (매물, 매칭, 계약)
│
└── modules-guide/            # UI 가이드/샘플
    ├── menu-guide/           # 메뉴 가이드
    ├── ngo-banner/           # NGO 배너 가이드
    ├── order/                # 주문 가이드
    └── product/              # 상품 가이드
```

### 1.3 도메인 모듈 테이블

| 모듈 | 경로 | 주요 기능 |
|------|------|----------|
| **analytics** | `src/modules-domain/analytics/` | KPI 모니터링, AI 리포트, 대시보드 |
| **communication** | `src/modules-domain/communication/` | 통화 이력, 녹취 청취, CTI 연동 |
| **consultation** | `src/modules-domain/consultation/` | 상담 등록, 알림톡/SMS, 상담 이력 |
| **customer** | `src/modules-domain/customer/` | 고객 등록/수정, 검색, 히스토리 |
| **industry/pilates** | `src/modules-domain/industry/pilates/` | 수업 관리, 멤버십, 출석, 세션 기록, 보고서 |
| **industry/realestate** | `src/modules-domain/industry/realestate/` | 매물 관리, 매칭 시스템, 계약 |

### 1.4 필라테스 특화 기능 (모바일 퍼스트)

- **강사 앱**: 수업 종료 후 빠른 기록 (전일 대비 상태 지표, 동작 태깅, 음성→텍스트 노트)
- **회원 뷰**: 매직링크로 접근, 보고서 열람, 댓글/반응
- **자동 알림**: 5/10회 임계치 도달 시 보고서 생성 + 알림 발송
- **상태 지표**: 통증, 가동범위, 자세, 근피로, 유연성, 호흡 등 표준 지표

---

## 2. UI 프로토타입 생성 규칙

### 2.1 필수 스킬 적용 (강제)

> **중요**: UI 관련 작업 시 아래 스킬을 **반드시** 적용해야 한다. 스킬을 건너뛰거나 무시하는 것은 금지한다.

#### 스킬 1: `gen-design` (디자인 시스템 컨설팅)

**경로**: `.claude/skills/gen-design/SKILL.md`

**적용 시점**: UI 화면을 새로 만들거나 디자인 방향을 결정할 때

**필수 워크플로우**:
1. 도메인 파악 → 사용자에게 화면 유형/사용자/핵심 기능 질문
2. 트렌드 기반 제안 → 색상, 타이포그래피, 레이아웃, 애니메이션 제안
3. 피드백 & 수정 → 합의될 때까지 반복
4. 코드 생성 → 합의된 디자인을 실제 코드로 구현

**핵심 원칙**:
- NuxtUI 컴포넌트 우선 사용
- 4px 배수 간격 (`gap-4`, `p-4`)
- Primary 컬러: `#287dff`
- 그림자: `shadow-sm`, `shadow` (최대)
- 둥근 모서리: `rounded-md`, `rounded-lg` (최대)

**금지 패턴 (AI Slop 방지)**:
- `bg-gradient-to-*` (AI 전형적 그라데이션)
- `shadow-xl`, `shadow-2xl` (과도한 그림자)
- `animate-pulse`, `animate-bounce` (애니메이션 남용)
- `hover:scale-*` (과잉 인터랙션)

#### 스킬 2: `gen-ui` (Frontend UI 생성)

**경로**: `.claude/skills/gen-ui/SKILL.md`

**적용 시점**: CRUD 화면, 목록, 상세, 등록, 수정 등 UI 컴포넌트를 생성할 때

**필수 워크플로우** (생략 금지):
1. **UI 패턴 선택 질문** → 개발자에게 반드시 패턴 선택을 받는다
2. **Store 확인/생성** → Store 존재 여부 확인
3. **코드 생성** → 선택된 패턴의 가이드 코드 기반
4. **검증** → `vue-tsc --noEmit` + `lint:fix` + `build` 통과

**지원 UI 패턴**:

| 패턴 | 설명 | 사용 시기 |
|------|------|----------|
| **crud** | 목록 + 모달 | 일반적인 CRUD, 입력 10개 미만 |
| **page** | 목록 + 별도 페이지 | 입력 10개 이상, URL 공유 필요 |
| **two-depth** | 좌우 분할 | 목록/상세 동시 표시 |
| **infinite-scroll** | 무한 스크롤 | 피드형, 모바일 최적화 |
| **kanban** | 칸반 보드 | 상태별 카드 관리 |
| **calendar** | 달력 UI | 일정/예약 관리 |
| **mega-form** | 대량 입력 폼 | 50개 이상 필드 |

#### 스킬 3: `frontend-design` (시각적 품질 가이드)

**적용 시점**: 모든 UI 생성 시 시각적 품질 검증 기준으로 활용

**Design Thinking 프로세스**:
1. **Purpose**: 이 인터페이스가 해결하는 문제와 사용자 파악
2. **Tone**: 명확한 미적 방향 설정 (CRM 백오피스 = refined/professional)
3. **Constraints**: Vue 3 + NuxtUI + TailwindCSS 기술 제약
4. **Differentiation**: 기억에 남는 차별화 포인트

**시각적 품질 기준**:
- **타이포그래피**: Pretendard 기본, 용도에 맞는 폰트 페어링
- **색상**: 일관된 테마, CSS 변수 활용, 강한 주색 + 날카로운 강조색
- **모션**: 고영향 순간에 집중 (페이지 로드 staggered reveal, hover 서프라이즈)
- **공간 구성**: 의도적 레이아웃, 적절한 여백
- **배경/디테일**: 분위기와 깊이감 (단색 배경 지양)

**절대 금지**:
- 과도한 Inter/Roboto/Arial 사용
- 보라색 그라데이션 + 흰 배경 조합
- 예측 가능한 쿠키커터 레이아웃
- 맥락 없는 장식 요소

### 2.2 스킬 적용 우선순위

```
UI 작업 요청 수신
    │
    ▼
[1] gen-design 스킬 적용
    → 디자인 방향 합의 (색상, 레이아웃, 컴포넌트)
    │
    ▼
[2] gen-ui 스킬 적용
    → UI 패턴 선택 → Store 확인 → 코드 생성
    │
    ▼
[3] frontend-design 스킬 적용
    → 시각적 품질 검증 (AI Slop 방지, 디자인 일관성)
    │
    ▼
[4] 검증
    → vue-tsc + lint + build 통과
```

### 2.3 모듈별 UI 가이드

#### 고객관리 (`modules-domain/customer/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| 고객 검색 | crud 또는 adv-search | 다중 조건 검색, 태그 필터 |
| 고객 등록/수정 | page 또는 mega-form | 업종별 커스텀 필드 |
| 고객 히스토리 | infinite-scroll | 타임라인형 이력 표시 |

#### 상담관리 (`modules-domain/consultation/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| 상담 등록 | crud | 상담 내용 + 알림톡 발송 |
| 알림톡/SMS | page | 템플릿 관리, 발송 결과 추적 |
| 상담 이력 | infinite-scroll | 시간순 이력, 상태 필터 |

#### 업종특화 - 필라테스 (`modules-domain/industry/pilates/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| 수업 관리 | calendar | 일정 캘린더, 수업 등록/수정 |
| 멤버십 관리 | crud | 멤버십 CRUD, 잔여 횟수 표시 |
| 출석 체크 | select-list | 당일 수업별 출석 체크 |
| 세션 기록 | mega-form | 상태 지표 입력, 동작 태깅 |
| 보고서 | page | 변화 그래프, 수업별 요약 타임라인 |

#### 업종특화 - 부동산 (`modules-domain/industry/realestate/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| 매물 관리 | crud + excel | 매물 CRUD, 엑셀 업로드 |
| 매칭 시스템 | two-depth | 좌: 고객 목록, 우: 매칭 매물 |

#### 통신 (`modules-domain/communication/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| 통화 이력 | crud | 통화 목록, 고객 자동 매칭 |
| 녹취 청취 | page | 음성 플레이어, STT 텍스트 |

#### 통계/분석 (`modules-domain/analytics/`)

| 화면 | 권장 패턴 | 핵심 기능 |
|------|----------|----------|
| KPI 모니터링 | (커스텀 대시보드) | ApexCharts 차트, KPI 카드 |
| AI 리포트 | page | AI 분석 결과, 인사이트 요약 |

---

## 3. 코드 생성 표준

### 3.1 파일 구조

```
src/modules-domain/[모듈명]/
├── pages/                    # 화면 컴포넌트
│   ├── list.vue              # 목록 메인 (껍데기)
│   ├── list-search.vue       # 검색 영역
│   ├── list-table.vue        # 테이블 영역
│   ├── detail.vue            # 상세 보기
│   ├── insert.vue            # 등록
│   ├── update.vue            # 수정
│   └── _[모듈명].routes.ts   # 라우트 정의
├── store/                    # 상태 관리 (Option API)
│   └── [모듈명].store.ts
└── type/                     # 타입 정의
    └── [모듈명].type.ts
```

### 3.2 가이드 코드 참조

**모든 UI 생성 시 `src/modules/test-data/` 폴더의 패턴을 반드시 참조한다.**

- Store 패턴: `test-data/store/test-data.store.ts`
- Type 패턴: `test-data/type/test-data.type.ts`
- CRUD 패턴: `test-data/pages/crud/`
- Route 패턴: `test-data/pages/_test.routes.ts`

### 3.3 필수 코드 패턴

| 패턴 | 적용 위치 | 설명 |
|------|----------|------|
| `<form @submit.prevent="listAction">` | list-search.vue | 검색 폼 제출 |
| `@change="listAction"` | select, radio | 즉시 검색 |
| `@update:page="listMovePage"` | pagination | 페이지 이동 |
| watch (route → listParams) | list-search.vue | URL 동기화 |
| watch (route → getList) | list-table.vue | URL 기반 조회 |
| Yup 유효성 검사 | insert, update | 필수 검증 |

### 3.4 공통 컴포넌트 목록 (p- 프리픽스)

공통 컴포넌트 위치: `src/modules/_common/components/`

#### forms/ - 입력 폼 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `p-input-box` | 포맷팅 입력 (금액, 전화번호 등) |
| `p-input-row-box` | 행 형태 입력 박스 |
| `p-nuxt-select` | 드롭다운 선택 (NuxtUI 기반) |
| `p-select-box` | 일반 셀렉트 박스 |
| `p-checkbox` | 체크박스 |
| `p-radiobox` | 라디오 버튼 |
| `p-toggle-checkbox` | 토글 체크박스 |
| `p-form-row` | 폼 레이아웃 행 |
| `p-button` | 공통 버튼 |
| `p-btn-type` | 버튼 타입 선택 |
| `p-tab-list` | 탭 목록 |
| `p-tab-content` | 탭 콘텐츠 |
| `p-tooltip` | 툴팁 |
| `p-view-detail-item` | 상세보기 항목 |
| `p-modal-box` | 모달 내부 박스 |

#### modal/ - 모달 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `p-modal` | 기본 모달 |
| `p-modal-common` | 공통 모달 레이아웃 |
| `p-modal-alert` | 알림 모달 |
| `p-modal-confirm` | 확인/취소 모달 |

#### date-picker/ - 날짜 선택 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `p-date-picker-work` | 단일 날짜 선택 |
| `p-date-picker-multi-work` | 다중 날짜 선택 |
| `p-day-select` | 요일 선택 |

#### 기타 컴포넌트

| 컴포넌트 | 경로 | 설명 |
|---------|------|------|
| `p-pagination-work` | pagination/ | 페이지네이션 |
| `p-file-upload` | file/ | 파일 업로드 |
| `p-post-code` | sign/ | 우편번호 검색 |
| `sidebar` | sidebar/ | 사이드바 |
| `p-bread-crumb` | layouts/ | 브레드크럼 |
| `p-full-loding` | layouts/ | 전체 로딩 |
| `p-toast` | layouts/ | 토스트 알림 |
| `tiny-editor` | tinymce/ | 리치 텍스트 에디터 (Quill 금지) |
| `common-dropdown` | dropdown/ | 공통 드롭다운 |
| `menu-dropdown` | dropdown/ | 메뉴 드롭다운 |
| `more-menu-dropdown` | dropdown/ | 더보기 드롭다운 |

### 3.5 컴포넌트 선택 규칙

| 용도 | 컴포넌트 |
|------|---------|
| 리치 텍스트 에디터 | `tiny-editor` (Quill 금지) |
| 일반 텍스트 입력 | `u-input` |
| 포맷팅 입력 (금액, 전화번호) | `p-input-box` |
| 드롭다운 선택 | `p-nuxt-select` |
| 날짜 선택 | `p-date-picker-work` |
| 파일 업로드 | `p-file-upload` |
| 폼 레이아웃 | `p-form-row` |
| 모달 | `u-modal` 또는 `p-modal-common` |

---

## 4. 기술 스택

### 4.1 주요 의존성 버전

| 패키지 | 버전 |
|--------|------|
| vue | ^3.5.16 |
| vite | ^6.3.5 |
| pinia | ^3.0.1 |
| @nuxt/ui | ^4.0.1 |
| tailwindcss | ^4.1.4 |
| typescript | ~5.7.2 |
| vue-router | ^4.5.0 |
| @vueuse/core | ^13.0.0 |
| apexcharts | ^4.5.0 |
| axios | ^1.11.0 |
| dayjs | ^1.11.13 |
| yup | ^1.7.1 |
| class-validator | ^0.14.0 |

### 4.2 개발 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run local` | localhost 모드로 개발 서버 실행 |
| `npm run dev` | 기본 개발 서버 실행 (0.0.0.0) |
| `npm run prod` | production 모드로 개발 서버 실행 |
| `npm run build` | production 빌드 |
| `npm run build:dev` | development 빌드 |
| `npm run build:check` | 타입 체크 + 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 포맷 |

---

## 5. 디자인 시스템

### 5.1 색상 체계

| 용도 | 토큰 | 값 |
|------|------|-----|
| Primary | `primary` | `#287dff` |
| Error | `error` | Semantic |
| Success | `success` | Semantic |
| Warning | `warning` | Semantic |
| Info | `info` | Semantic |
| Neutral | `neutral` | Semantic |
| 배경 | `bg-bodyBg` | 프로젝트 정의 |

### 5.2 타이포그래피

- **기본 폰트**: Pretendard
- **폰트 스케일**: TailwindCSS 기본 스케일 활용
- **가독성**: 본문 `text-sm` ~ `text-base`, 제목 `text-lg` ~ `text-2xl`

### 5.3 간격 & 레이아웃

- **간격 단위**: 4px 배수 (`p-2`, `p-4`, `gap-4`)
- **그림자**: `shadow-sm`, `shadow` (최대)
- **둥근 모서리**: `rounded-md`, `rounded-lg` (최대)
- **반응형**: 모바일 우선 (`flex flex-col md:flex-row`)

### 5.4 다크모드

```html
<div class="bg-white dark:bg-black141414">
```

---

## 6. 프로토타입 특화 규칙

### 6.1 Mock 데이터 전략

- Backend API 없이 Mock 데이터로 동작
- Store에서 Mock 데이터 직접 관리
- API 호출 부분은 주석으로 실제 엔드포인트 표시

### 6.2 라우팅

- `src/router.ts`에 모든 라우트 등록
- 라우트 파일: `_[모듈명].routes.ts`
- 기본 리다이렉트: `/customer/search`

### 6.3 좌측 메뉴 구조

섹션(Section) → 메뉴(Menu) → 하위메뉴(Child) 3단계 구조:

| 섹션 | 메뉴 | 하위메뉴 |
|------|------|---------|
| 고객 | 고객 관리 | 고객 등록/수정, 고객 검색, 고객 히스토리 |
| 상담 | 상담 관리 | 상담 등록, 알림톡/SMS, 상담 이력 |
| 업종기능 | 필라테스 | 수업 관리, 멤버십 관리, 출석 체크 |
| 업종기능 | 부동산 | 매물 관리, 매칭 시스템 |
| 통신 | 전화 | 통화 이력, 녹취 청취 |
| 통계/분석 | KPI 모니터링, AI 리포트 | - |

---

## 7. Cursor Rules (.cursor/rules/)

| 파일 | 설명 |
|------|------|
| `default-guide.mdc` | 기본 개발 가이드라인 |
| `components-guide.mdc` | 컴포넌트 작성 가이드 |
| `modules-crud.mdc` | CRUD 모듈 패턴 |
| `modules-store.mdc` | Pinia 스토어 패턴 |
| `modules-type.mdc` | TypeScript 타입 정의 패턴 |
| `modules-audit.mdc` | 감사 로그 패턴 |
| `modules-tdd.mdc` | TDD 테스트 패턴 |
| `modules-validator.mdc` | Yup 유효성 검사 패턴 |
| `page-routing.mdc` | 페이지 라우팅 패턴 |
| `error-guide.mdc` | 에러 처리 가이드 |
| `tailwindcss-guide.mdc` | TailwindCSS v4 사용 가이드 |

---

## 8. 검증 체크리스트

모든 UI 작업 완료 시 아래를 반드시 확인:

```
┌──────────────────────────────────────────────────┐
│ UI 프로토타입 완료 체크리스트                       │
│                                                  │
│ □ gen-design 스킬 적용 (디자인 방향 합의)          │
│ □ gen-ui 스킬 적용 (UI 패턴 선택 → 코드 생성)     │
│ □ frontend-design 스킬 적용 (시각적 품질 검증)     │
│ □ AI Slop 패턴 없음 확인                          │
│ □ test-data 가이드 코드 패턴 준수                  │
│ □ 반응형 디자인 적용 (모바일 + 데스크톱)            │
│ □ 다크모드 지원                                   │
│ □ vue-tsc --noEmit 통과                           │
│ □ lint:fix 통과                                   │
│ □ build 성공                                     │
└──────────────────────────────────────────────────┘
```

---

## 9. 참조 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| CRM Type 2 아키텍처 | `crm-ai-dev/prd/250921-CRM_타입2_아키텍처_다이어그램.md` | 전체 시스템 구조 |
| 필라테스 회원 관리 | `crm-ai-dev/prd/250923-필라테스_회원_관리_다이어그램.md` | 필라테스 특화 기능 |
| 가이드 코드 | `src/modules/test-data/` | 코드 패턴 참조 |
| Cursor Rules | `.cursor/rules/*.mdc` | 개발 가이드라인 |
| gen-design 스킬 | `.claude/skills/gen-design/SKILL.md` | 디자인 시스템 |
| gen-ui 스킬 | `.claude/skills/gen-ui/SKILL.md` | UI 생성 |
