import type { RouteRecordRaw } from 'vue-router';

const productRoutes: RouteRecordRaw = {
  path: 'product',
  name: 'guide-product',
  redirect: '/guide/domain/product/list',
  children: [
    {
      path: 'list',
      name: 'guide-product-list',
      component: () => import('./list.vue')
    }
  ]
};

export default productRoutes;
