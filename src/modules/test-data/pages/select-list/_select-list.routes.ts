import type { RouteRecordRaw } from 'vue-router';

const selectListRoutes: RouteRecordRaw = {
  path: 'select-list/demo',
  name: 'guide-select-list-demo',
  component: () => import('./demo.vue'),
  meta: {
    title: '데이터 선택 모달 데모',
    breadcrumb: [
      { name: '가이드', path: '/guide' },
      { name: 'Select List', path: '/guide/pattern/select-list' },
      { name: '데모', path: '/guide/pattern/select-list/demo' }
    ]
  }
};

export default selectListRoutes;