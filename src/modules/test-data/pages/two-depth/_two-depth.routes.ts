import type { RouteRecordRaw } from 'vue-router';

const testTwoDepthRoutes: RouteRecordRaw = {
  path: 'two-depth',
  name: 'guide-two-depth',
  redirect: '/guide/pattern/two-depth/list',
  children: [
    {
      path: 'list',
      name: 'guide-two-depth-list',
      component: () => import('./list.vue')
    }
  ]
};

export default testTwoDepthRoutes;
