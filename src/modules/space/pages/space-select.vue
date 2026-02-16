<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 헤더 -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 mb-4">
        <UIcon name="i-lucide-layout-grid" class="text-[#287dff] w-4 h-4" />
        <span class="text-sm text-blue-700 font-medium">워크스페이스</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">워크스페이스를 선택하세요</h1>
      <p class="text-slate-500">업종에 맞는 CRM 워크스페이스를 선택하거나 새로 생성하세요</p>
    </div>

    <!-- 스페이스 카드 그리드 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 스페이스 카드 -->
      <div
        v-for="space in listData"
        :key="space.spaceSeq"
        :class="[
          'relative p-6 rounded-2xl border bg-white',
          'transition-all duration-200 hover:shadow-md',
          'border-gray-200 hover:border-[#287dff]/40'
        ]"
      >
        <!-- 유형 배지 -->
        <div class="flex items-center justify-between mb-4">
          <UBadge :color="spaceStore.spaceTypeBadgeColor(space.spaceType)" variant="soft" size="sm">
            {{ spaceStore.spaceTypeLabel(space.spaceType) }}
          </UBadge>
          <u-button
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            size="xs"
            @click.stop="confirmDelete(space)"
          />
        </div>

        <!-- 스페이스 정보 -->
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-3">
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold',
                space.spaceType === 'pilates' ? 'bg-emerald-500' :
                space.spaceType === 'realestate' ? 'bg-amber-500' : 'bg-[#287dff]'
              ]"
            >
              {{ space.spaceName.charAt(0) }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ space.spaceName }}</h3>
              <p class="text-sm text-gray-500">{{ space.description }}</p>
            </div>
          </div>
        </div>

        <!-- 메타 정보 -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center gap-1 text-sm text-gray-400">
            <UIcon name="i-lucide-users" class="w-4 h-4" />
            <span>{{ space.memberCount }}명</span>
          </div>
          <u-button
            color="primary"
            size="sm"
            trailing-icon="i-lucide-arrow-right"
            @click="enterSpace(space)"
          >
            입장하기
          </u-button>
        </div>
      </div>

      <!-- 새 워크스페이스 생성 카드 -->
      <div
        :class="[
          'flex flex-col items-center justify-center p-6 rounded-2xl',
          'border-2 border-dashed border-gray-300 cursor-pointer',
          'transition-all duration-200 hover:border-[#287dff]/50 hover:bg-blue-50/30',
          'min-h-[240px]'
        ]"
        @click="openCreateModal"
      >
        <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <UIcon name="i-lucide-plus" class="text-2xl text-gray-400" />
        </div>
        <span class="text-sm font-medium text-gray-500">새 워크스페이스 생성</span>
      </div>
    </div>
  </div>

  <!-- 생성 모달 -->
  <space-create-modal
    v-model:open="isCreateOpen"
    @create-ok="onCreateOk"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSpaceStore } from '../store/space.store';
import SpaceCreateModal from './space-create.modal.vue';
import type { Space } from '../type/space.type';

const router = useRouter();
const spaceStore = useSpaceStore();

const listData = computed(() => spaceStore.listData);
const isCreateOpen = ref(false);

const enterSpace = (space: Space) => {
  spaceStore.setCurrentSpace(space);
  router.push('/customer/list');
};

const confirmDelete = async (space: Space) => {
  if (!confirm(`"${space.spaceName}" 워크스페이스를 삭제하시겠습니까?`)) return;
  await spaceStore.softDelete(space.spaceSeq);
};

const openCreateModal = () => {
  isCreateOpen.value = true;
};

const onCreateOk = () => {
  isCreateOpen.value = false;
};

onMounted(() => {
  spaceStore.list();
});
</script>
