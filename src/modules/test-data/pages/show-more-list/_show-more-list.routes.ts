import type { RouteRecordRaw } from 'vue-router';

const showMoreListRoutes: RouteRecordRaw = {
  path: 'show-more-list',
  name: 'test-show-more-list',
  redirect: '/test/show-more-list/list',
  children: [
    {
      path: 'list',
      name: 'test-show-more-list-list',
      component: () => import('./list.vue')
    }
  ]
};

export default showMoreListRoutes;
