import type { RouteRecordRaw } from 'vue-router';

const consultationRoutes: RouteRecordRaw = {
  path: 'consultation',
  children: [
    {
      path: 'register',
      name: 'consultation-register',
      component: () => import('./list.vue')
    },
    {
      path: 'message',
      name: 'consultation-message',
      component: () => import('./message-list.vue')
    },
    {
      path: 'history',
      name: 'consultation-history',
      component: () => import('./history.vue')
    }
  ]
};

export default consultationRoutes;
