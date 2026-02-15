import type { RouteRecordRaw } from 'vue-router';
import testTwoDepthRoutes from '@/modules/test-data/pages/two-depth/_two-depth.routes.ts';

const testCrudRoutes: RouteRecordRaw = {
  path: 'crud',
  name: 'test-crud',
  redirect: '/test/crud/list',
  children: [
    {
      path: 'list',
      name: 'test-crud-list',
      component: () => import('./list.vue')
    },
    {
      path: 'detail/:testSeq',
      name: 'test-crud-detail',
      component: () => import('./detail-page.vue')
    },
    testTwoDepthRoutes
  ]
};

export default testCrudRoutes;
