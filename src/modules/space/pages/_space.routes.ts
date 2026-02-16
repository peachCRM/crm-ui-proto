import type { RouteRecordRaw } from 'vue-router';

const spaceRoutes: RouteRecordRaw = {
  path: '/space',
  component: () => import('@/modules/layout/intro-layout.vue'),
  children: [
    {
      path: '',
      name: 'space-select',
      component: () => import('./space-select.vue')
    }
  ]
};

export default spaceRoutes;
