import type { RouteRecordRaw } from 'vue-router';

const realestateRoutes: RouteRecordRaw = {
  path: 'realestate',
  children: [
    {
      path: 'property',
      name: 'realestate-property',
      component: () => import('./property-list.vue')
    },
    {
      path: 'matching',
      name: 'realestate-matching',
      component: () => import('./matching-list.vue')
    }
  ]
};

export default realestateRoutes;
