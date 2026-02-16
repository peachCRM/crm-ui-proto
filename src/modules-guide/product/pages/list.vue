<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '쇼핑몰' }, { title: '상품관리' }]"
      title="상품관리"
    >
    </p-bread-crumb>
  </div>
  <list-search></list-search>
  <list-table></list-table>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListSearch from './list-search.vue';
import ListTable from './list-table.vue';
</script>
