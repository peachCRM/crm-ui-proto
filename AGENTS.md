# 피치CRM UI 프로토타입 에이전트 지침

Vue 3.5 + TypeScript + Nuxt UI v4 + TailwindCSS v4 + Pinia 기반 CRM SaaS UI 프로토타입. Backend 없이 Mock 데이터로만 동작한다.

## 사실원과 탐색

- 현재 checkout의 소스·`../crm-ai-dev/prd/` 확정 Spec이 최종 SoT다.
- 코드 심볼·경로·호출부는 `rg`로 찾는다. `docs/`는 소규모이므로 `rg -l "<키워드>" docs/`로 충분하다 (이 저장소에 qmd 인덱스·`docs/wiki/`는 없다).
- 모듈 구조·공통 컴포넌트 목록은 문서가 아니라 `src/modules/`, `src/modules-domain/`, `src/modules/_common/components/`를 직접 읽어 확인한다.

## 실행 라우팅 (필수 스킬)

- 디자인 방향 결정·신규 화면 디자인은 `gen-design` 스킬이 SoT다 (색상·간격·AI Slop 금지 패턴 포함).
- CRUD·목록·상세·등록·수정 UI 생성은 `gen-ui` 스킬이 SoT다 (UI 패턴 선택, Store·라우트·검색·Yup 검증 패턴 포함).
- UI 작업은 gen-design → gen-ui 순서로 적용하고 건너뛰지 않는다. 시각 규칙 상세는 root `DESIGN.md`를 따른다.

## 스킬 오버라이드 (스킬의 generic 규칙이 아니라 이 저장소 기준)

- 스킬이 말하는 `front/` 경로·`bun` 명령 대신, 이 저장소는 **루트가 프로젝트 루트이고 `npm`을 쓴다**.
- 스킬 예시의 `p-date-picker`는 이 저장소에 없다. 실제 컴포넌트는 `p-date-picker-work` / `p-date-picker-multi-work`다.

## Must Follow

- 리치 텍스트 에디터는 `tiny-editor`만 쓴다. `quill/` 폴더가 존재하지만 Quill 사용 금지.
- 공통 컴포넌트는 새로 만들지 말고 `src/modules/_common/components/`의 `p-` 컴포넌트를 우선 사용한다.
- 신규 모듈 골격은 `src/modules/test-data/`(가이드 코드)를 참조한다. Store는 Option API.
- Mock 데이터는 Store에서 직접 관리하고, 실제 API 호출 위치는 주석으로 엔드포인트를 표시한다.
- 업무 로직·권한·코드값·상태값·인증값·외부 연동 결과를 하드코딩하거나 임의 폴백으로 성공 처리하지 않는다. 원천 계약이 없으면 구현을 중단하고 누락을 보고한다.
- 라우트는 `src/router.ts`에 등록하고, 모듈별 라우트 파일은 `_[모듈명].routes.ts`를 쓴다.

## 완료 게이트

- UI 변경: `npm run build:check && npm run lint:fix` (build:check = vue-tsc -b + vite build)
- 테스트가 있는 변경: `npm run test:run`

## 참조 문서

- 확정 Spec: `../crm-ai-dev/prd/00-MVP-개발전략.md` ~ `04-부동산-업종-스펙.md`
- 시각 디자인: root `DESIGN.md`
- 개발 가이드라인: `.cursor/rules/*.mdc`
