import type { RouteRecordRaw } from 'vue-router';

const ngoBannerRoutes: RouteRecordRaw = {
  path: '/ngo',
  name: 'ngo',
  component: () => import('@/modules/layout/itax-layout.vue'),
  redirect: '/ngo/banner/list',
  children: [
    {
      path: 'banner/list',
      name: 'ngo-banner-list',
      component: () => import('./list.vue')
    }
  ]
};

export default ngoBannerRoutes;
