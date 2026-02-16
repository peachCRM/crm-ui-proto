<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '고객관리' }, { title: '고객 목록' }]"
      title="고객 목록"
    />
  </div>
  <div :class="['flex flex-row items-stretch gap-6', 'bg-bodyBg dark:bg-black']">
    <!-- 좌측: 검색 + 테이블 -->
    <div class="bg-bodyBg flex h-full w-full max-w-[380px] flex-col dark:bg-black">
      <u-card class="w-full">
        <list-search />
        <list-table />
      </u-card>
    </div>
    <!-- 우측: 상세 패널 -->
    <div class="w-full">
      <detail-panel />
    </div>
  </div>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import ListSearch from './list-search.vue';
import ListTable from './list-table.vue';
import DetailPanel from './detail-panel.vue';
</script>
