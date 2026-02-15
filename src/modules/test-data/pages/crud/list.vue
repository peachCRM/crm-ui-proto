<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: 'UI 가이드' }, { title: 'CRUD 기본' }]"
      title="CRUD 기본"
      layer
      :subtitle="''"
    >
      <p>default dd페이지 입니다.</p>
    </p-bread-crumb>
  </div>
  <!-- E : HEAD -->
  <list-search></list-search>
  <list-table></list-table>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListSearch from './list-search.vue';
import ListTable from './list-table.vue';
</script>
