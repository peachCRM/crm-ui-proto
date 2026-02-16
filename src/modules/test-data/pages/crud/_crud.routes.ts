import type { RouteRecordRaw } from 'vue-router';
import testTwoDepthRoutes from '@/modules/test-data/pages/two-depth/_two-depth.routes.ts';

const testCrudRoutes: RouteRecordRaw = {
  path: 'crud',
  name: 'guide-crud',
  redirect: '/guide/pattern/crud/list',
  children: [
    {
      path: 'list',
      name: 'guide-crud-list',
      component: () => import('./list.vue')
    },
    {
      path: 'detail/:testSeq',
      name: 'guide-crud-detail',
      component: () => import('./detail-page.vue')
    },
    testTwoDepthRoutes
  ]
};

export default testCrudRoutes;
