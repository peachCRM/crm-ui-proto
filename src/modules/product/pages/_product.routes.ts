import type { RouteRecordRaw } from 'vue-router';

const productRoutes: RouteRecordRaw = {
  path: 'product',
  name: 'shop-product',
  redirect: '/shop/product/list',
  children: [
    {
      path: 'list',
      name: 'shop-product-list',
      component: () => import('./list.vue')
    }
  ]
};

export default productRoutes;
