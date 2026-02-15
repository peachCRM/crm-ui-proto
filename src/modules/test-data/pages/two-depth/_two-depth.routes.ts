import type { RouteRecordRaw } from 'vue-router';

const testTwoDepthRoutes: RouteRecordRaw = {
  path: 'two-depth',
  name: 'test-two-depth',
  redirect: '/test/two-depth/list',
  children: [
    {
      path: 'list',
      name: 'test-two-depth-list',
      component: () => import('./list.vue')
    }
  ]
};

export default testTwoDepthRoutes;
