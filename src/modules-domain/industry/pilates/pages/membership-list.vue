<template>
  <div class="mb-6">
    <p-bread-crumb
      :breadcrumbs="[{ title: '업종기능' }, { title: '필라테스' }, { title: '멤버십 관리' }]"
      title="멤버십 관리"
    />
  </div>
  <div class="flex flex-col gap-6">
    <u-card class="w-full">
      <membership-search />
      <membership-table @open-detail="openDetailModal" />
    </u-card>
  </div>

  <membership-update-modal
    v-model:open="isOpenUpdate"
    :membership-seq="selectedMembershipSeq"
    @update-ok="onUpdateOk"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import PBreadCrumb from '@/modules/_common/components/layouts/p-bread-crumb.vue';
import MembershipSearch from './membership-search.vue';
import MembershipTable from './membership-table.vue';
import MembershipUpdateModal from './membership-update.modal.vue';

const route = useRoute();
const router = useRouter();
const isOpenUpdate = ref(false);
const selectedMembershipSeq = ref(0);

function openDetailModal(membershipSeq: number) {
  selectedMembershipSeq.value = membershipSeq;
  isOpenUpdate.value = true;
}

function onUpdateOk() {
  router.push({
    query: { ...route.query, time: dayjs().format('YYYYMMDDHHmmssSSS') }
  });
}
</script>
