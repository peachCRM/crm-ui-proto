# 피치CRM UI 프로토타입

CRM Type 2 SaaS 플랫폼의 바이브코딩 기반 UI 프로토타입 — Vue 3 + Nuxt UI v4 + TailwindCSS v4.

## 빠른 시작

```bash
npm install
npm run local    # localhost 모드 (권장)
npm run dev      # 기본 개발 서버
npm run build    # production 빌드
```

## 구조

```mermaid
graph TD
  subgraph src
    subgraph modules["modules/ (인프라)"]
      _common["_common/\n공통 컴포넌트/스토어"]
      layout["layout/\n앱 레이아웃"]
      left_menu["left-menu/\n네비게이션"]
      test_data["test-data/\n가이드 코드"]
    end

    subgraph modules_domain["modules-domain/ (비즈니스)"]
      customer["customer/\n고객관리"]
      consultation["consultation/\n상담관리"]
      communication["communication/\n통신(CTI/녹취)"]
      analytics["analytics/\n통계/분석"]
      subgraph industry["industry/ (업종특화)"]
        pilates["pilates/\n필라테스"]
        realestate["realestate/\n부동산"]
      end
    end

    subgraph modules_guide["modules-guide/ (UI 가이드)"]
      order["order/"]
      product["product/"]
    end
  end
```

## 기술 스택

```mermaid
graph LR
  subgraph UI["UI 레이어"]
    NuxtUI["@nuxt/ui v4\n(컴포넌트)"]
    Tailwind["TailwindCSS v4\n(스타일)"]
    Pretendard["Pretendard\n(폰트)"]
  end

  subgraph State["상태 관리"]
    Pinia["Pinia v3\n(스토어)"]
    VueRouter["Vue Router v4\n(라우팅)"]
  end

  subgraph Core["코어"]
    Vue["Vue 3.5\n(Composition API)"]
    TS["TypeScript 5.7"]
    Vite["Vite v6\n(빌드)"]
  end

  subgraph Util["유틸리티"]
    ApexCharts["ApexCharts v4\n(차트)"]
    TinyMCE["TinyMCE v8\n(에디터)"]
    Yup["Yup\n(검증)"]
    Axios["Axios\n(HTTP)"]
    DayJS["Day.js\n(날짜)"]
  end

  Core --> State
  State --> UI
  UI --> Util
```

## 개발 흐름

```mermaid
flowchart LR
  PM["기획자\n요구사항 정의"] --> Agent
  subgraph Agent["AI 에이전트 (Claude Code)"]
    D["gen-design\n디자인 방향 합의"] --> G["gen-ui\nUI 패턴 선택 + 코드 생성"]
    G --> V["frontend-design\n시각적 품질 검증"]
    V --> B["빌드 검증\nvue-tsc + lint + build"]
  end
  Agent --> Proto["UI 프로토타입\n(Mock 데이터 동작)"]
  Proto --> Dev["개발팀\n실제 API 연동 + 배포"]
```

## AI 가이드

에이전트 코딩 규칙, 컴포넌트 목록, 모듈별 UI 패턴, 디자인 시스템 전체 → [AGENTS.md](./AGENTS.md)
