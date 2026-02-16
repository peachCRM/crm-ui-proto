import type { RouteRecordRaw } from 'vue-router';

const communicationRoutes: RouteRecordRaw = {
  path: 'communication',
  children: [
    {
      path: 'history',
      name: 'communication-history',
      component: () => import('./call-list.vue')
    },
    {
      path: 'record',
      name: 'communication-record',
      component: () => import('./record-list.vue')
    },
    {
      path: 'record/:recordSeq',
      name: 'communication-record-detail',
      component: () => import('./record-detail.vue')
    }
  ]
};

export default communicationRoutes;
