import type { RouteRecordRaw } from 'vue-router';

const introRoutes: RouteRecordRaw = {
  path: '/',
  name: 'intro',
  component: () => import('@/modules/layout/intro-layout.vue'),
  children: [
    {
      path: '',
      name: 'intro-main',
      component: () => import('./intro.vue')
    }
  ]
};

export default introRoutes;
