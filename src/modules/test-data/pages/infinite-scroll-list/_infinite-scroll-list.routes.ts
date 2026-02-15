import type { RouteRecordRaw } from 'vue-router';

const infiniteScrollListRoutes: RouteRecordRaw = {
  path: 'infinite-scroll-list',
  name: 'test-infinite-scroll-list',
  redirect: '/test/infinite-scroll-list/list',
  children: [
    {
      path: 'list',
      name: 'test-infinite-scroll-list-list',
      component: () => import('./list.vue')
    }
  ]
};

export default infiniteScrollListRoutes;
