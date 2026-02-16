import type { RouteRecordRaw } from 'vue-router';

const showMoreListRoutes: RouteRecordRaw = {
  path: 'show-more-list',
  name: 'guide-show-more-list',
  redirect: '/guide/pattern/show-more-list/list',
  children: [
    {
      path: 'list',
      name: 'guide-show-more-list-list',
      component: () => import('./list.vue')
    }
  ]
};

export default showMoreListRoutes;
