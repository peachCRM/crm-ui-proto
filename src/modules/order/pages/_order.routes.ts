import type { RouteRecordRaw } from 'vue-router';

const orderRoutes: RouteRecordRaw = {
  path: 'order',
  name: 'guide-order',
  redirect: '/guide/domain/order/list',
  children: [
    {
      path: 'list',
      name: 'guide-order-list',
      component: () => import('./list.vue')
    }
  ]
};

export default orderRoutes;
