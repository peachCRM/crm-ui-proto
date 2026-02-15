import type { RouteRecordRaw } from 'vue-router';

const testCrudExcelRoutes: RouteRecordRaw = {
  path: 'crud-excel',
  name: 'test-crud-excel',
  redirect: '/test/crud-excel/list',
  children: [
    {
      path: 'list',
      name: 'test-crud-excel-list',
      component: () => import('./list.vue')
    }
  ]
};

export default testCrudExcelRoutes;
