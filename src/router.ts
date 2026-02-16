import { createRouter, createWebHistory } from 'vue-router';

// 가이드 영역 - UI 패턴 하위 라우트
import testCrudRoutes from './modules/test-data/pages/crud/_crud.routes.ts';
import selectListRoutes from './modules/test-data/pages/select-list/_select-list.routes.ts';
import showMoreListRoutes from './modules/test-data/pages/show-more-list/_show-more-list.routes.ts';
import infiniteScrollListRoutes from './modules/test-data/pages/infinite-scroll-list/_infinite-scroll-list.routes.ts';
import testCrudExcelRoutes from './modules/test-data/pages/crud-excel/_crud-excel.routes.ts';
import testTwoDepthRoutes from './modules/test-data/pages/two-depth/_two-depth.routes.ts';

// 가이드 영역 - 도메인 예시 하위 라우트
import productRoutes from './modules-guide/product/pages/_product.routes.ts';
import orderRoutes from './modules-guide/order/pages/_order.routes.ts';

// 인트로/스페이스
import introRoutes from './modules/intro/pages/_intro.routes.ts';
import spaceRoutes from './modules/space/pages/_space.routes.ts';

// CRM 워크스페이스 도메인 라우트
import customerRoutes from './modules-domain/customer/pages/_customer.routes.ts';
import consultationRoutes from './modules-domain/consultation/pages/_consultation.routes.ts';
import pilatesRoutes from './modules-domain/industry/pilates/pages/_pilates.routes.ts';
import realestateRoutes from './modules-domain/industry/realestate/pages/_realestate.routes.ts';
import communicationRoutes from './modules-domain/communication/pages/_communication.routes.ts';
import analyticsRoutes from './modules-domain/analytics/pages/_analytics.routes.ts';

/**
 * 피치CRM Proto 라우터
 * Backend API 없이 Mock 데이터로 동작하는 프로토타이핑 환경
 *
 * 레이아웃 구조:
 * - intro-layout: 소개 페이지, 스페이스 선택 (/)
 * - crm-layout: CRM 워크스페이스 진입 후 (/customer, /consultation, ...)
 * - guide-layout: 가이드 영역 - UI 패턴 + 도메인 예시 (/guide/...)
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 인트로 페이지 (intro-layout)
    introRoutes,

    // 스페이스 선택 (intro-layout)
    spaceRoutes,

    // CRM 워크스페이스 (crm-layout)
    {
      path: '/',
      component: () => import('@/modules/layout/crm-layout.vue'),
      children: [
        // 고객관리
        customerRoutes,

        // 상담관리
        consultationRoutes,

        // 업종 특화
        {
          path: 'industry',
          children: [
            pilatesRoutes,
            realestateRoutes
          ]
        },

        // 통신
        communicationRoutes,

        // 통계/분석
        analyticsRoutes
      ]
    },

    // 가이드 영역 (guide-layout) - UI 패턴 + 도메인 예시 통합
    {
      path: '/guide',
      component: () => import('@/modules/layout/guide-layout.vue'),
      redirect: '/guide/pattern/crud/list',
      children: [
        // UI 패턴 가이드
        {
          path: 'pattern',
          children: [
            {
              path: 'guide',
              name: 'guide-overview',
              component: () => import('@/modules/test-data/pages/guide.vue')
            },
            testCrudRoutes,
            testTwoDepthRoutes,
            showMoreListRoutes,
            infiniteScrollListRoutes,
            testCrudExcelRoutes,
            selectListRoutes
          ]
        },
        // 도메인 예시
        {
          path: 'domain',
          children: [
            productRoutes,
            orderRoutes,
            {
              path: 'ngo-banner',
              children: [
                {
                  path: 'list',
                  name: 'guide-ngo-banner-list',
                  component: () => import('@/modules-guide/ngo-banner/pages/list.vue')
                }
              ]
            }
          ]
        }
      ]
    },

    // 호환성 리다이렉트 (기존 경로 → 가이드 경로)
    {
      path: '/test/:pathMatch(.*)*',
      redirect: (to) => {
        const subPath = Array.isArray(to.params.pathMatch)
          ? to.params.pathMatch.join('/')
          : to.params.pathMatch;
        return `/guide/pattern/${subPath}`;
      }
    },
    {
      path: '/shop/:pathMatch(.*)*',
      redirect: (to) => {
        const subPath = Array.isArray(to.params.pathMatch)
          ? to.params.pathMatch.join('/')
          : to.params.pathMatch;
        return `/guide/domain/${subPath}`;
      }
    },
    {
      path: '/ngo/:pathMatch(.*)*',
      redirect: (to) => {
        const subPath = Array.isArray(to.params.pathMatch)
          ? to.params.pathMatch.join('/')
          : to.params.pathMatch;
        return `/guide/domain/ngo-banner/${subPath}`;
      }
    },

    // 404 처리
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

export default router;
