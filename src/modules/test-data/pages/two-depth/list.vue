<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: 'UI 가이드' }, { title: '2Depth' }]"
      title="2Depth"
    >
    </p-bread-crumb>
  </div>
  <div :class="['flex flex-row items-stretch gap-6', 'bg-bodyBg dark:bg-black']">
    <div class="bg-bodyBg flex h-full w-full max-w-[350px] flex-col dark:bg-black">
      <!-- 좌측내용 -->
      <u-card class="w-full">
        <list-search />
        <list-table />
      </u-card>
    </div>
    <!--우측내용-->
    <div class="w-full">
      <list-detail />
    </div>
  </div>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListSearch from './list-search.vue';
import ListTable from './list-table.vue';
import ListDetail from './list-detail.vue';
</script>

<style scoped></style>
