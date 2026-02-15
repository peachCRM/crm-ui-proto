import type { RouteRecordRaw } from 'vue-router';

const orderRoutes: RouteRecordRaw = {
  path: 'order',
  name: 'shop-order',
  redirect: '/shop/order/list',
  children: [
    {
      path: 'list',
      name: 'shop-order-list',
      component: () => import('./list.vue')
    }
  ]
};

export default orderRoutes;
