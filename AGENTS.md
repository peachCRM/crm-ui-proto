# crm-ui-proto-www - AI 에이전트 가이드

Vue 3 + Nuxt UI v4 + TailwindCSS v4 CRM SaaS UI 프로토타입. Backend 없이 Mock 데이터로만 동작한다. 루트가 프로젝트 루트이고 **npm**을 쓴다. 모듈은 `src/modules/`·`src/modules-domain/`·`src/modules-guide/`.

## 탐색

- 확정 근거는 현재 checkout의 소스와 `../crm-ai-dev/prd/` 확정 Spec(`00-MVP-개발전략.md` ~ 업종 스펙)이다. qmd 인덱스·wiki·E2E가 없다 — 심볼·경로·호출부·컴포넌트는 `rg`로 찾고, 공통 컴포넌트는 `src/modules/_common/components/` 실물을 확인한다. 상세 가이드라인은 `.cursor/rules/*.mdc`.
- UI 작업은 `/gen-design`(방향·AI Slop 금지 패턴) → `/gen-ui`(패턴·Store·라우트·Yup 검증) 순서를 건너뛰지 않는다.
- 스킬 오버라이드: 스킬의 `front/` 경로·`bun` 명령은 이 저장소에서 루트 경로·`npm`이다. 스킬 예시의 `p-date-picker`는 없고 `p-date-picker-work` / `p-date-picker-multi-work`가 실물이다.

## Must Follow

- **업무 로직·권한·코드값·상태값·인증값·외부 연동 결과를 하드코딩하거나 임의 폴백으로 성공 처리하지 않는다.** 프로토타입 Mock만 예외: Store에서 관리하고 실제 API 위치는 주석으로 표시한다. Mock을 실제 연동인 것처럼 위장하지 않는다.
- 리치 에디터는 `tiny-editor`만. `quill/` 폴더가 있어도 Quill 사용 금지.
- 라우트는 모듈별 `_[모듈명].routes.ts`에 정의하고 `src/router.ts`에 등록한다.
- 단일 사용처 추상화 금지 (가이드 패턴보다 우선한다).

## 프론트엔드

골격·Store 구성·컴포넌트 배치는 `src/modules/test-data/`를 따른다.

- 프론트 UI 신규·변경 시 root `DESIGN.md`의 색상·타이포그래피·간격·컴포넌트 원칙을 적용한다. 기존 공통 컴포넌트·스타일과 충돌하면 checkout 소스를 우선하고 사유를 남긴다.
- Store에 `isLoading`/`error` 상태와 try-catch를 두지 않는다. 모든 데이터 접근은 Store를 통해 하고 template에서는 `computed()`로 래핑한다. Store는 Pinia Option API.
- TailwindCSS 클래스 5개 이상은 배열로 그룹화한다.
- Store TDD·단위 테스트를 새로 작성하지 않는다.

## 완료 게이트

`npm run build:check && npm run lint:fix` (build:check = vue-tsc -b + vite build)
