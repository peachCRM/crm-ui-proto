import type { RouteRecordRaw } from 'vue-router';
import productRoutes from '@/modules/product/pages/_product.routes.ts';
import orderRoutes from '@/modules/order/pages/_order.routes.ts';

/**
 * 쇼핑몰 라우트 (상품관리, 주문관리)
 * itax-layout 레이아웃 적용
 */
const shopRoutes: RouteRecordRaw = {
  path: '/shop',
  name: 'shop',
  component: () => import('@/modules/layout/itax-layout.vue'),
  redirect: '/shop/product/list',
  children: [
    productRoutes,
    orderRoutes
  ]
};

export default shopRoutes;
