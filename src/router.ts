import { createRouter, createWebHistory } from 'vue-router';
import testDataRoutes from './modules/test-data/pages/_test.routes.ts';
import shopRoutes from './modules/shop/pages/_shop.routes.ts';
import ngoBannerRoutes from './modules/ngo-banner/pages/_ngo-banner.routes.ts';

/**
 * 피치CRM Proto 라우터
 * Backend API 없이 Mock 데이터로 동작하는 프로토타이핑 환경
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 쇼핑몰 모듈 (상품관리, 주문관리)
    shopRoutes,

    // NGO 모듈 (배너 크롤링)
    ngoBannerRoutes,

    // test-data 모듈 (가이드 코드)
    testDataRoutes,

    // 기본 리다이렉트
    {
      path: '/',
      redirect: '/shop/product/list'
    },

    // 404 처리
    {
      path: '/:pathMatch(.*)*',
      redirect: '/shop/product/list'
    }
  ]
});

// 인증 가드 제거 - Mock 모드에서는 인증 불필요
// router.beforeEach는 사용하지 않음

export default router;
