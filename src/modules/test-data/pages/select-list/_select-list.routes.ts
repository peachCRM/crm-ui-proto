import type { RouteRecordRaw } from 'vue-router';

const selectListRoutes: RouteRecordRaw = {
  path: '/test/select-list/demo',
  name: 'test-select-list-demo',
  component: () => import('./demo.vue'),
  meta: {
    title: '데이터 선택 모달 데모',
    breadcrumb: [
      { name: '테스트', path: '/test' },
      { name: 'Select List', path: '/test/select-list' },
      { name: '데모', path: '/test/select-list/demo' }
    ]
  }
};

export default selectListRoutes;