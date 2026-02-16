import type { RouteRecordRaw } from 'vue-router';

const analyticsRoutes: RouteRecordRaw = {
  path: 'analytics',
  children: [
    {
      path: 'kpi',
      name: 'analytics-kpi',
      component: () => import('./kpi-dashboard.vue')
    },
    {
      path: 'ai-report',
      name: 'analytics-ai-report',
      component: () => import('./ai-report-list.vue')
    },
    {
      path: 'ai-report/:reportSeq',
      name: 'analytics-ai-report-detail',
      component: () => import('./ai-report-detail.vue')
    }
  ]
};

export default analyticsRoutes;
