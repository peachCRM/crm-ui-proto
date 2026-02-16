<template>
  <!-- 모바일 햄버거 버튼 (lg 미만에서만 표시) -->
  <button
    class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
    @click="isOpen = true"
  >
    <UIcon name="i-lucide-menu" class="w-5 h-5" />
  </button>

  <!-- 모바일 메뉴 슬라이드오버 -->
  <USlideover v-model:open="isOpen" side="right" :ui="{ width: 'w-[300px]' }">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 bg-[#287dff] rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <span class="text-base font-semibold text-gray-900 dark:text-white">{{ currentSpaceName }}</span>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ spaceTypeLabel }}</p>
          </div>
        </div>
        <button
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          @click="isOpen = false"
        >
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </button>
      </div>
    </template>

    <template #body>
      <div class="py-2">
        <!-- 3-depth 아코디언 메뉴 -->
        <div
          v-for="section in menuStore.visibleSections"
          :key="section.id"
          class="mb-3"
        >
          <!-- 1차: 섹션 타이틀 -->
          <div class="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {{ section.sectionTitle }}
          </div>

          <div class="px-2">
            <div v-for="menu in section.menus" :key="menu.id">
              <!-- children이 있는 2차 메뉴 (아코디언) -->
              <template v-if="menu.children && menu.children.length > 0">
                <button
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-150',
                    isMenuExpanded(menu.id) || hasActiveChild(menu)
                      ? 'text-[#287dff] dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="toggleMenu(menu.id)"
                >
                  <span>{{ menu.name }}</span>
                  <UIcon
                    name="i-lucide-chevron-down"
                    :class="[
                      'w-4 h-4 text-gray-400 transition-transform duration-200',
                      isMenuExpanded(menu.id) ? 'rotate-180' : ''
                    ]"
                  />
                </button>

                <!-- 3차: 하위 메뉴 링크 -->
                <div v-show="isMenuExpanded(menu.id)" class="mt-0.5 mb-1">
                  <router-link
                    v-for="child in menu.children"
                    :key="child.id"
                    :to="child.url"
                    :class="[
                      'flex items-center gap-2 pl-7 pr-3 py-2 text-sm rounded-lg transition-colors duration-150',
                      menuStore.isActiveItem(route.path, child.url)
                        ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                    @click="isOpen = false"
                  >
                    <span
                      v-if="menuStore.isActiveItem(route.path, child.url)"
                      class="w-1 h-1 rounded-full bg-[#287dff] dark:bg-blue-400 shrink-0"
                    />
                    {{ child.name }}
                  </router-link>
                </div>
              </template>

              <!-- children이 없는 단일 링크 메뉴 -->
              <template v-else>
                <router-link
                  :to="menu.url || '/'"
                  :class="[
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors duration-150',
                    menuStore.isActiveItem(route.path, menu.url)
                      ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="isOpen = false"
                >
                  <span
                    v-if="menuStore.isActiveItem(route.path, menu.url)"
                    class="w-1 h-1 rounded-full bg-[#287dff] dark:bg-blue-400 shrink-0"
                  />
                  {{ menu.name }}
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <!-- 유틸리티 영역 -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 px-2">
          <router-link
            to="/space"
            :class="[
              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            ]"
            @click="isOpen = false"
          >
            <UIcon name="i-lucide-layout-grid" class="w-4 h-4" />
            스페이스 전환
          </router-link>
          <router-link
            to="/guide/pattern/crud/list"
            :class="[
              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg',
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            ]"
            @click="isOpen = false"
          >
            <UIcon name="i-lucide-book-open" class="w-4 h-4" />
            가이드 보기
          </router-link>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PZoneSwitcher from './p-zone-switcher.vue';
import { useRoute } from 'vue-router';
import { useLeftMenuStore } from '@/modules/left-menu/store/left-menu.store';
import type { MenuItem } from '@/modules/left-menu/type/left-menu.interface';

defineProps<{
  currentSpaceName: string;
  spaceTypeLabel: string;
}>();

const route = useRoute();
const menuStore = useLeftMenuStore();

// 슬라이드오버 열림 상태
const isOpen = ref(false);

// 펼쳐진 2차 메뉴 ID 배열
const expandedMenus = ref<number[]>([]);

/** 메뉴 펼침/접힘 확인 */
const isMenuExpanded = (menuId: number): boolean => {
  return expandedMenus.value.includes(menuId);
};

/** 메뉴 펼침/접힘 토글 */
const toggleMenu = (menuId: number): void => {
  const index = expandedMenus.value.indexOf(menuId);
  if (index === -1) {
    expandedMenus.value.push(menuId);
  } else {
    expandedMenus.value.splice(index, 1);
  }
};

/** 하위 메뉴 중 활성 상태가 있는지 확인 */
const hasActiveChild = (menu: MenuItem): boolean => {
  if (!menu.children) return false;
  return menu.children.some(child => menuStore.isActiveItem(route.path, child.url));
};

/** 현재 URL에 해당하는 메뉴 자동 펼침 */
const autoExpandActiveMenus = (): void => {
  const ids = menuStore.getExpandedMenuIds(route.path);
  ids.forEach(id => {
    if (!expandedMenus.value.includes(id)) {
      expandedMenus.value.push(id);
    }
  });
};

// 라우트 변경 시 자동 펼침
watch(() => route.path, autoExpandActiveMenus, { immediate: true });
</script>
