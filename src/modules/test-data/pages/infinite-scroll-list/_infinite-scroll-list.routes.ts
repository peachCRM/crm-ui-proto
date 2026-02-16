import type { RouteRecordRaw } from 'vue-router';

const infiniteScrollListRoutes: RouteRecordRaw = {
  path: 'infinite-scroll-list',
  name: 'guide-infinite-scroll-list',
  redirect: '/guide/pattern/infinite-scroll-list/list',
  children: [
    {
      path: 'list',
      name: 'guide-infinite-scroll-list-list',
      component: () => import('./list.vue')
    }
  ]
};

export default infiniteScrollListRoutes;
