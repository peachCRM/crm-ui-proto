<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '업종기능' }, { title: '부동산' }, { title: '매물 관리' }]"
      title="매물 관리"
    />
  </div>
  <property-search />
  <property-table />
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import PropertySearch from './property-search.vue';
import PropertyTable from './property-table.vue';
</script>
