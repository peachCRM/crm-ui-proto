# PRD 기반 UI 프로토타입 구성 전략

> 작성일: 2026-05-03  
> 대상 프로젝트: `crm-ui-proto-www`  
> 참조 PRD: `/Users/nettem/source/peachCRM/crm-ai-dev/prd`

---

## 1. 결론

피치CRM UI를 빠르게 구성하려면 **`modules-task` 기반 Mock UI 방식**이 가장 효과적이다.

권장 흐름:

```text
crm-ai-dev/prd
  → crm-ui-proto-www/src/modules-task/[날짜]-crm-type2-ui/
  → Mock 데이터 기반 화면/메뉴 검증
  → 확정 화면만 src/modules-domain/ 으로 승격
```

`only html` 방식은 초반 시각화 속도는 빠르지만, Vue/NuxtUI/Store/라우팅으로 다시 옮기는 비용이 커서 메인 전략으로 적합하지 않다.

---

## 2. 선택지 비교

| 방식 | 장점 | 단점 | 판단 |
|------|------|------|------|
| `only html` 프로토타입 | 가장 빠른 정적 시안 제작 | Vue 컴포넌트, Store, 라우팅 재사용 불가. 이후 재작업 큼 | 단기 시각 검토용 |
| `modules-domain` 직접 구현 | 최종 코드와 가까움 | PRD 변경/실험 화면이 운영 모듈에 섞임 | 스펙 확정 후 적합 |
| `modules-task` 기반 Mock UI | Vue/NuxtUI/라우팅/Mock Store 재사용 가능. 검증 후 승격 쉬움 | 초기 구조 세팅이 약간 필요 | **현재 단계 최적** |

---

## 3. 추천 구조

```text
src/modules-task/
└── 2605/
    └── 260503-crm-type2-prd-ui/
        ├── _task-meta.ts
        ├── _routes.ts
        ├── layout/
        │   └── task-layout.vue
        ├── docs/
        │   ├── menu-map.md
        │   └── screen-map.md
        ├── mock/
        │   └── crm.mock.ts
        ├── modules-basic/
        ├── modules-pilates/
        ├── modules-realestate/
        └── modules-analytics/
```

핵심은 PRD를 바로 최종 모듈에 넣지 않고, **태스크 단위 실험 공간**에서 메뉴와 화면 흐름을 먼저 검증하는 것이다.

---

## 4. 작업 순서

1. `/crm-ai-dev/prd`의 4개 PRD를 읽어 메뉴 맵과 화면 맵을 정리한다.
2. `src/modules-task`에 피치CRM Type 2 태스크 라우트와 태스크 홈을 만든다.
3. 기본 CRM, 필라테스, 부동산, 분석 화면을 Mock 데이터 기반으로 빠르게 구현한다.
4. 실제 메뉴 탐색, 목록/상세/모달/대시보드 흐름을 브라우저에서 검토한다.
5. 확정된 화면만 `src/modules-domain/`으로 이동하거나 동일 패턴으로 재구성한다.

---

## 5. `only html`을 쓸 수 있는 경우

HTML 프로토타입은 메인 개발 전략이 아니라 보조 수단으로 제한한다.

사용해도 좋은 경우:

- 하루 안에 공유해야 하는 정적 화면 시안
- 경영진/기획자에게 보여줄 단발성 레이아웃 검토
- 대시보드 배치나 보고서 인쇄 화면의 빠른 시각 실험
- 실제 앱 컴포넌트 재사용성이 낮은 화면

사용하지 않는 것이 좋은 경우:

- 메뉴/라우팅이 필요한 화면
- 목록, 검색, 상세, 모달, 페이지네이션이 엮인 화면
- Mock Store와 상태 변화가 필요한 화면
- 나중에 `modules-domain`으로 승격할 가능성이 높은 화면

---

## 6. 개발 효율 기준 판단

현재 피치CRM은 메뉴, 업종별 화면, Mock 데이터, 라우팅, 공통 컴포넌트 검증이 함께 필요하다. 따라서 버릴 코드가 많은 HTML보다, Vue 앱 안에서 바로 동작하는 `modules-task` 방식이 장기적으로 더 빠르다.

정리하면:

```text
빠른 시각화만 필요하면 only html
실제 앱 흐름 검증이 필요하면 modules-task
확정된 기능 구현은 modules-domain
```

이번 피치CRM UI 프로토타입의 기본 전략은 **`modules-task` 기반 PRD UI화 → 검증 → `modules-domain` 승격**으로 잡는다.
