<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '통신' }, { title: '통화 이력' }]"
      title="통화 이력"
    />
  </div>
  <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
    <call-search />
    <call-table />
  </div>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import CallSearch from './call-search.vue';
import CallTable from './call-table.vue';
</script>
