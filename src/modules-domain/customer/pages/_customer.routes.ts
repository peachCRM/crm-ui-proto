import type { RouteRecordRaw } from 'vue-router';

const customerRoutes: RouteRecordRaw = {
  path: 'customer',
  children: [
    {
      path: 'list',
      name: 'customer-list',
      component: () => import('./list.vue')
    }
  ]
};

export default customerRoutes;
