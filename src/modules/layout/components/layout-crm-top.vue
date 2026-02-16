<template>
  <!-- CRM 워크스페이스 상단 3-depth 드롭다운 메뉴 (데스크톱 lg 이상) -->
  <div class="hidden lg:flex items-center justify-between h-full px-6">
    <!-- 좌측: 브랜드 + 스페이스 정보 -->
    <div class="flex items-center gap-3">
      <router-link to="/" class="flex items-center gap-3">
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
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">피치CRM</h1>
          <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">Business Platform</span>
        </div>
      </router-link>

      <div class="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
        <UBadge :color="spaceTypeBadgeColor" variant="soft" size="xs">
          {{ spaceTypeLabel }}
        </UBadge>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ currentSpaceName }}
        </span>
      </div>
    </div>

    <!-- 중앙: 3-depth 네비게이션 -->
    <nav class="flex items-center gap-1">
      <div
        v-for="section in menuStore.visibleSections"
        :key="section.id"
        class="relative"
        @mouseenter="handleSectionEnter(section.id)"
        @mouseleave="handleSectionLeave"
      >
        <!-- 1차: 섹션 버튼 -->
        <button
          :class="[
            'relative px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-200',
            activeMenu === section.id || menuStore.getActiveSectionId(route.path) === section.id
              ? 'text-[#287dff] bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
        >
          {{ section.sectionTitle }}
          <UIcon
            name="i-lucide-chevron-down"
            :class="[
              'w-3.5 h-3.5 transition-transform duration-200',
              activeMenu === section.id ? 'rotate-180' : ''
            ]"
          />
        </button>

        <!-- 2차: 드롭다운 패널 -->
        <div
          :class="[
            'absolute top-full left-0 pt-1.5 transition-all duration-200 z-50',
            activeMenu === section.id
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-1 pointer-events-none'
          ]"
        >
          <div
            :class="[
              'min-w-[180px] bg-white dark:bg-gray-900 rounded-lg shadow',
              'border border-gray-200 dark:border-gray-700 overflow-visible'
            ]"
          >
            <div class="py-1">
              <div
                v-for="menu in section.menus"
                :key="menu.id"
                class="relative"
                @mouseenter="handleMenuEnter(menu.id)"
                @mouseleave="handleMenuLeave"
              >
                <!-- children이 있는 2차 메뉴 -->
                <template v-if="menu.children && menu.children.length > 0">
                  <div
                    :class="[
                      'flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-all duration-150',
                      activeSubmenu === menu.id
                        ? 'text-[#287dff] bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30'
                        : hasActiveChild(menu)
                          ? 'text-[#287dff] dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                  >
                    <span>{{ menu.name }}</span>
                    <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5 text-gray-400" />
                  </div>

                  <!-- 3차: 서브메뉴 플로팅 패널 -->
                  <div
                    :class="[
                      'absolute left-full top-0 pl-1.5 transition-all duration-150 z-50',
                      activeSubmenu === menu.id
                        ? 'opacity-100 translate-x-0 pointer-events-auto'
                        : 'opacity-0 -translate-x-1 pointer-events-none'
                    ]"
                  >
                    <div
                      :class="[
                        'min-w-[160px] bg-white dark:bg-gray-900 rounded-lg shadow',
                        'border border-gray-200 dark:border-gray-700'
                      ]"
                    >
                      <div class="py-1">
                        <router-link
                          v-for="child in menu.children"
                          :key="child.id"
                          :to="child.url"
                          :class="[
                            'flex items-center gap-2 px-3 py-2 text-sm transition-all duration-150',
                            menuStore.isActiveItem(route.path, child.url)
                              ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-medium'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          ]"
                          @click="closeAll"
                        >
                          <span
                            v-if="menuStore.isActiveItem(route.path, child.url)"
                            class="w-1 h-1 rounded-full bg-[#287dff] dark:bg-blue-400 shrink-0"
                          />
                          {{ child.name }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- children이 없는 단일 링크 메뉴 -->
                <template v-else>
                  <router-link
                    :to="menu.url || '/'"
                    :class="[
                      'flex items-center gap-2 px-3 py-2 text-sm transition-all duration-150',
                      menuStore.isActiveItem(route.path, menu.url)
                        ? 'text-[#287dff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    ]"
                    @click="closeAll"
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
      </div>
    </nav>

    <!-- 우측: 유틸리티 -->
    <div class="flex items-center gap-3">
      <router-link
        to="/space"
        :class="[
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
          'text-gray-500 hover:text-[#287dff] hover:bg-blue-50',
          'dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800'
        ]"
      >
        <UIcon name="i-lucide-layout-grid" class="w-4 h-4" />
        <span>스페이스 전환</span>
      </router-link>
      <UBadge color="success" variant="soft">Mock 모드</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLeftMenuStore } from '@/modules/left-menu/store/left-menu.store';
import type { MenuItem } from '@/modules/left-menu/type/left-menu.interface';

defineProps<{
  currentSpaceName: string;
  spaceTypeLabel: string;
  spaceTypeBadgeColor: string;
}>();

const route = useRoute();
const menuStore = useLeftMenuStore();

// 드롭다운 상태
const activeMenu = ref<number | null>(null);
const activeSubmenu = ref<number | null>(null);
let sectionTimeout: ReturnType<typeof setTimeout> | null = null;
let menuTimeout: ReturnType<typeof setTimeout> | null = null;

/** 하위 메뉴 중 활성 상태가 있는지 확인 */
const hasActiveChild = (menu: MenuItem): boolean => {
  if (!menu.children) return false;
  return menu.children.some(child => menuStore.isActiveItem(route.path, child.url));
};

/** 1차 섹션 hover 진입 */
const handleSectionEnter = (sectionId: number): void => {
  if (sectionTimeout) { clearTimeout(sectionTimeout); sectionTimeout = null; }
  activeMenu.value = sectionId;
  activeSubmenu.value = null;
};

/** 1차 섹션 hover 이탈 */
const handleSectionLeave = (): void => {
  sectionTimeout = setTimeout(() => {
    activeMenu.value = null;
    activeSubmenu.value = null;
  }, 150);
};

/** 2차 메뉴 hover 진입 */
const handleMenuEnter = (menuId: number): void => {
  if (menuTimeout) { clearTimeout(menuTimeout); menuTimeout = null; }
  if (sectionTimeout) { clearTimeout(sectionTimeout); sectionTimeout = null; }
  activeSubmenu.value = menuId;
};

/** 2차 메뉴 hover 이탈 */
const handleMenuLeave = (): void => {
  menuTimeout = setTimeout(() => {
    activeSubmenu.value = null;
  }, 100);
};

/** 모든 드롭다운 닫기 */
const closeAll = (): void => {
  activeMenu.value = null;
  activeSubmenu.value = null;
};

/** 외부 클릭 시 드롭다운 닫기 */
const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  if (!target.closest('nav')) {
    closeAll();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  if (sectionTimeout) clearTimeout(sectionTimeout);
  if (menuTimeout) clearTimeout(menuTimeout);
});
</script>
