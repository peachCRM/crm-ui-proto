<template>
  <!-- 모바일 햄버거 버튼 (lg 미만에서만 표시) -->
  <button
    class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
    @click="isOpen = true"
  >
    <UIcon name="i-lucide-menu" class="w-5 h-5" />
  </button>

  <!-- 모바일 메뉴 슬라이드오버 (PICK: 좌측 탭+패널 분리) -->
  <USlideover v-model:open="isOpen" side="left" :ui="{ width: 'w-[300px]' }">
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
      <div class="flex h-full -mx-4 -my-4">
        <!-- 좌측 아이콘 탭 (섹션 전환) -->
        <div class="w-14 bg-gray-50 dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-700 shrink-0 pt-1">
          <div
            v-for="(section, idx) in menuStore.visibleSections"
            :key="section.id"
            :class="[
              'flex flex-col items-center py-3 cursor-pointer transition-colors duration-100'
            ]"
            :style="{
              background: activeTab === idx ? 'white' : 'transparent',
              borderRight: activeTab === idx ? '2px solid #287dff' : '2px solid transparent'
            }"
            @click="activeTab = idx"
          >
            <component
              :is="getSectionIcon(section)"
              class="w-5 h-5"
              :class="activeTab === idx ? 'text-[#287dff]' : 'text-gray-400 dark:text-gray-500'"
            />
            <span
              class="text-[9px] mt-0.5 leading-tight"
              :class="activeTab === idx ? 'text-[#287dff] font-medium' : 'text-gray-400 dark:text-gray-500'"
            >{{ section.sectionTitle }}</span>
          </div>

          <!-- 하단 유틸리티 아이콘 -->
          <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <router-link
              to="/space"
              class="flex flex-col items-center py-3 cursor-pointer"
              @click="isOpen = false"
            >
              <UIcon name="i-lucide-layout-grid" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span class="text-[9px] mt-0.5 text-gray-400 dark:text-gray-500">전환</span>
            </router-link>
            <router-link
              to="/guide/pattern/crud/list"
              class="flex flex-col items-center py-3 cursor-pointer"
              @click="isOpen = false"
            >
              <UIcon name="i-lucide-book-open" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <span class="text-[9px] mt-0.5 text-gray-400 dark:text-gray-500">가이드</span>
            </router-link>
          </div>
        </div>

        <!-- 우측 콘텐츠 패널 (2차/3차 아코디언) -->
        <div class="flex-1 overflow-y-auto py-2">
          <!-- 현재 선택된 섹션의 타이틀 -->
          <div class="px-3 py-1.5 text-[13px] font-bold text-[#287dff]">
            {{ activeSection?.sectionTitle }}
          </div>

          <!-- 2차/3차 메뉴 아코디언 -->
          <div v-if="activeSection" class="px-1">
            <div v-for="menu in activeSection.menus" :key="menu.id">
              <!-- children이 있는 2차 메뉴 -->
              <template v-if="menu.children && menu.children.length > 0">
                <button
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md cursor-pointer',
                    'transition-colors duration-100',
                    isMenuExpanded(menu.id) || hasActiveChild(menu)
                      ? 'text-[#287dff] dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  @click="toggleMenu(menu.id)"
                >
                  <span>{{ menu.name }}</span>
                  <span
                    :class="[
                      'text-[9px] text-gray-300 dark:text-gray-600 transition-transform duration-150 inline-block'
                    ]"
                    :style="{ transform: isMenuExpanded(menu.id) ? 'rotate(90deg)' : 'rotate(0deg)' }"
                  >▶</span>
                </button>

                <!-- 3차: 하위 메뉴 링크 -->
                <div v-show="isMenuExpanded(menu.id)" class="mb-1">
                  <router-link
                    v-for="child in menu.children"
                    :key="child.id"
                    :to="child.url"
                    :class="[
                      'flex items-center gap-2 pl-6 pr-3 py-2 text-sm rounded-md',
                      'transition-colors duration-100',
                      menuStore.isActiveItem(route.path, child.url)
                        ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                    'flex items-center gap-2 px-3 py-2.5 text-sm rounded-md',
                    'transition-colors duration-100',
                    menuStore.isActiveItem(route.path, menu.url)
                      ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
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
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { useRoute } from 'vue-router';
import { useLeftMenuStore } from '@/modules/left-menu/store/left-menu.store';
import type { MenuItem, MenuSection } from '@/modules/left-menu/type/left-menu.interface';
import {
  IconUsers,
  IconMessageCircle,
  IconStretching2 as IconStretching,
  IconBuilding,
  IconPhone,
  IconChartBar,
  IconSparkles,
  IconTable,
  IconList,
  IconShoppingCart,
  IconHeart
} from '@tabler/icons-vue';

defineProps<{
  currentSpaceName: string;
  spaceTypeLabel: string;
}>();

const route = useRoute();
const menuStore = useLeftMenuStore();

// 아이콘 매핑 (스토어의 문자열 → 실제 컴포넌트)
const iconMap: Record<string, Component> = {
  IconUsers,
  IconMessageCircle,
  IconStretching,
  IconBuilding,
  IconPhone,
  IconChartBar,
  IconSparkles,
  IconTable,
  IconList,
  IconShoppingCart,
  IconHeart
};

// 슬라이드오버 열림 상태
const isOpen = ref(false);

// 좌측 탭 활성 인덱스
const activeTab = ref(0);

// 펼쳐진 2차 메뉴 ID 배열
const expandedMenus = ref<number[]>([]);

/** 현재 활성 섹션 */
const activeSection = computed(() => {
  const sections = menuStore.visibleSections;
  return sections[activeTab.value] || sections[0];
});

/** 섹션의 대표 아이콘 가져오기 (첫 번째 메뉴의 아이콘 사용) */
const getSectionIcon = (section: MenuSection): Component => {
  const firstIcon = section.menus[0]?.icon;
  return iconMap[firstIcon] || IconList;
};

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

/** 현재 URL에 해당하는 메뉴 자동 펼침 + 활성 탭 설정 */
const autoExpandActiveMenus = (): void => {
  const ids = menuStore.getExpandedMenuIds(route.path);
  ids.forEach(id => {
    if (!expandedMenus.value.includes(id)) {
      expandedMenus.value.push(id);
    }
  });

  // 활성 섹션의 탭 자동 선택
  const activeSectionId = menuStore.getActiveSectionId(route.path);
  if (activeSectionId !== null) {
    const idx = menuStore.visibleSections.findIndex(s => s.id === activeSectionId);
    if (idx !== -1) {
      activeTab.value = idx;
    }
  }
};

// 라우트 변경 시 자동 펼침
watch(() => route.path, autoExpandActiveMenus, { immediate: true });
</script>
