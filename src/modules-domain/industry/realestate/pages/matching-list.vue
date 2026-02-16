<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '업종기능' }, { title: '부동산' }, { title: '매칭 시스템' }]"
      title="매칭 시스템"
    />
  </div>
  <div :class="['flex flex-row items-stretch gap-6', 'bg-bodyBg dark:bg-black']">
    <!-- 좌측: 검색 + 테이블 -->
    <div class="bg-bodyBg flex h-full w-full max-w-[380px] flex-col dark:bg-black">
      <u-card class="w-full">
        <matching-search />
        <matching-table />
      </u-card>
    </div>
    <!-- 우측: 상세 패널 -->
    <div class="w-full">
      <matching-detail />
    </div>
  </div>
</template>

<script setup lang="ts">
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import MatchingSearch from './matching-search.vue';
import MatchingTable from './matching-table.vue';
import MatchingDetail from './matching-detail.vue';
</script>
