<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '상담관리' }, { title: '상담 등록' }]"
      title="상담 등록"
    />
  </div>
  <div class="rounded-custom8 dark:bg-black141414 w-full bg-white">
    <list-search />
    <list-table />
  </div>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListSearch from './list-search.vue';
import ListTable from './list-table.vue';
</script>
