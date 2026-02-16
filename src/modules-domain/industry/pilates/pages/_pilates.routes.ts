import type { RouteRecordRaw } from 'vue-router';

const pilatesRoutes: RouteRecordRaw = {
  path: 'pilates',
  children: [
    { path: 'class', name: 'pilates-class', component: () => import('./class-calendar.vue') },
    { path: 'membership', name: 'pilates-membership', component: () => import('./membership-list.vue') },
    { path: 'attendance', name: 'pilates-attendance', component: () => import('./attendance-check.vue') }
  ]
};

export default pilatesRoutes;
