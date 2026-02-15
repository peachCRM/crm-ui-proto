<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: 'NGO' }, { title: '배너' }]"
      title="NGO 배너 크롤링"
      layer
      :subtitle="''"
    >
      <p>1시간마다 크롤링된 NGO 단체 네이버/카카오톡 배너 데이터를 조회합니다.</p>
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
