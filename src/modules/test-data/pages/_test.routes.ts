import type { RouteRecordRaw } from 'vue-router';
import testCrudRoutes from '@/modules/test-data/pages/crud/_crud.routes.ts';
import testTwoDepthRoutes from '@/modules/test-data/pages/two-depth/_two-depth.routes.ts';
import selectListRoutes from '@/modules/test-data/pages/select-list/_select-list.routes.ts';
import showMoreListRoutes from '@/modules/test-data/pages/show-more-list/_show-more-list.routes.ts';
import infiniteScrollListRoutes from '@/modules/test-data/pages/infinite-scroll-list/_infinite-scroll-list.routes.ts';
import testCrudExcelRoutes from '@/modules/test-data/pages/crud-excel/_crud-excel.routes.ts';

const testDataRoutes: RouteRecordRaw = {
  path: '/test',
  name: 'test',
  component: () => import('@/modules/layout/itax-layout.vue'),
  redirect: '/test/crud/list',
  children: [
    {
      path: 'guide',
      name: 'test-guide',
      component: () => import('./guide.vue')
    },
    testCrudRoutes,
    testTwoDepthRoutes,
    selectListRoutes,
    showMoreListRoutes,
    infiniteScrollListRoutes,
    testCrudExcelRoutes,
  ]
};

export default testDataRoutes;
