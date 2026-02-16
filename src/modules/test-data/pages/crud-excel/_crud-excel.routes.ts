import type { RouteRecordRaw } from 'vue-router';

const testCrudExcelRoutes: RouteRecordRaw = {
  path: 'crud-excel',
  name: 'guide-crud-excel',
  redirect: '/guide/pattern/crud-excel/list',
  children: [
    {
      path: 'list',
      name: 'guide-crud-excel-list',
      component: () => import('./list.vue')
    }
  ]
};

export default testCrudExcelRoutes;
