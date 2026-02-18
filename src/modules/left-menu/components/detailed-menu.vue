<template>
  <!-- 듀얼 패널 상세 메뉴: 48px 아이콘 스트립 + 138px 메뉴 패널 -->
  <div class="w-[186px] flex h-full bg-[#fbfbfa] dark:bg-[#191919]">

    <!-- 좌측 아이콘 스트립 (48px) -->
    <div class="w-12 shrink-0 bg-gray-100 dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-700 flex flex-col pt-1">
      <div
        v-for="(section, idx) in visibleSections"
        :key="section.id"
        :class="[
          'flex flex-col items-center py-2.5 cursor-pointer transition-colors duration-100 relative border-r-2',
          activeSectionIndex === idx
            ? 'bg-white dark:bg-[#252525] border-[#287dff]'
            : 'border-transparent hover:bg-[#f0f0ef] dark:hover:bg-[#2a2a2a]'
        ]"
        @click="activeSectionIndex = idx"
      >
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
          :class="activeSectionIndex === idx ? 'ring-2 ring-[#287dff]/30' : 'bg-white dark:bg-[#2a2a2a]'"
          :style="activeSectionIndex === idx ? { backgroundColor: section.iconBg } : undefined"
        >
          <component
            :is="iconMap[section.icon]"
            class="w-3.5 h-3.5"
            :class="activeSectionIndex === idx ? 'text-white' : 'text-gray-400 dark:text-gray-500'"
          />
        </div>
        <span
          class="text-[9px] mt-0.5 leading-tight text-center px-0.5"
          :class="activeSectionIndex === idx ? 'text-[#287dff] font-medium' : 'text-gray-400 dark:text-gray-500'"
        >{{ section.sectionTitle }}</span>
      </div>
    </div>

    <!-- 우측 메뉴 패널 (138px) -->
    <div class="flex-1 overflow-y-auto pb-10">
      <!-- 현재 섹션 타이틀 -->
      <div class="px-3 pt-3 pb-1.5">
        <span class="text-[11px] font-bold text-[#287dff]">{{ activeSection?.sectionTitle }}</span>
      </div>

      <!-- 2차/3차 메뉴 렌더링 -->
      <nav v-if="activeSection" aria-label="메뉴 네비게이션">
        <div v-for="menu in activeSection.menus" :key="menu.id">
          <!-- 자식이 있는 2차 메뉴 -->
          <template v-if="menu.children && menu.children.length > 0">
            <!-- 2차 메뉴 헤더 (구분선 스타일) -->
            <div
              :class="[
                'flex items-center justify-between px-3 py-1.5 cursor-pointer',
                'transition-colors duration-100',
                hasActiveChild(menu)
                  ? 'text-[#287dff] dark:text-blue-400'
                  : 'text-[#91918e] dark:text-[#6b6b6b] hover:text-[#37352f] dark:hover:text-[#cfcfcf]'
              ]"
              @click="toggleMenu(menu.id)"
            >
              <span class="text-[11px] font-semibold">{{ menu.name }}</span>
              <span
                class="text-[8px] inline-block transition-transform duration-150"
                :style="{ transform: isMenuExpanded(menu.id) ? 'rotate(90deg)' : 'rotate(0deg)' }"
              >▶</span>
            </div>

            <!-- 3차 메뉴 링크 목록 -->
            <div v-show="isMenuExpanded(menu.id)" class="mb-1">
              <router-link
                v-for="child in menu.children"
                :key="child.id"
                :to="child.url"
                custom
                v-slot="{ navigate, isActive }"
              >
                <button
                  :class="[
                    'w-full text-left pl-3 pr-2 py-1.5 text-[12px] cursor-pointer',
                    'transition-colors duration-100',
                    isActive
                      ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
                      : 'text-[#37352f] dark:text-[#cfcfcf] hover:bg-[#f0f0ef] dark:hover:bg-[#252525]'
                  ]"
                  :aria-current="isActive ? 'page' : undefined"
                  @click="handleChildClick(child, navigate)"
                >
                  <span class="flex items-center gap-1.5">
                    <span
                      v-if="isActive"
                      class="w-1 h-1 rounded-full bg-[#287dff] dark:bg-blue-400 shrink-0"
                    />
                    <span v-else class="w-1 h-1 shrink-0" />
                    {{ child.name }}
                  </span>
                </button>
              </router-link>
            </div>
          </template>

          <!-- 자식이 없는 단일 링크 2차 메뉴 -->
          <template v-else>
            <router-link
              :to="menu.url || '/'"
              custom
              v-slot="{ navigate, isActive }"
            >
              <button
                :class="[
                  'w-full flex items-center gap-1.5 px-3 py-1.5 cursor-pointer text-[12px]',
                  'transition-colors duration-100',
                  isActive
                    ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
                    : 'text-[#37352f] dark:text-[#cfcfcf] hover:bg-[#f0f0ef] dark:hover:bg-[#252525]'
                ]"
                :aria-current="isActive ? 'page' : undefined"
                @click="handleSingleClick(menu, navigate)"
              >
                <span
                  v-if="isActive"
                  class="w-1 h-1 rounded-full bg-[#287dff] dark:bg-blue-400 shrink-0"
                />
                <span v-else class="w-1 h-1 shrink-0" />
                {{ menu.name }}
              </button>
            </router-link>
          </template>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { useRoute } from 'vue-router';
import {
  IconUsers,
  IconSpeakerphone,
  IconChartBar,
  IconSettings,
  IconStretching2 as IconStretching,
  IconBuilding,
  IconBook,
  IconShoppingCart,
  IconMenu,
  IconList
} from '@tabler/icons-vue';
import type { MenuSection, MenuItem, ChildMenuItem } from '../type/left-menu.interface';
import { useLeftMenuStore } from '../store/left-menu.store';
import { useGuideMenuStore } from '../store/guide-menu.store';

const props = defineProps<{
  visibleSections: MenuSection[];
  onMenuClick: (url: string, menuName: string) => boolean;
}>();

const route = useRoute();
const leftMenuStore = useLeftMenuStore();
const guideMenuStore = useGuideMenuStore();

// 경로에 따라 적절한 스토어 선택
const isGuideArea = computed(() => route.path.startsWith('/guide'));
const activeMenuStore = computed(() => isGuideArea.value ? guideMenuStore : leftMenuStore);

// 섹션 아이콘 매핑
const iconMap: Record<string, Component> = {
  IconUsers,
  IconSpeakerphone,
  IconChartBar,
  IconSettings,
  IconStretching,
  IconBuilding,
  IconBookOpen: IconBook,
  IconShoppingCart,
  IconMenu,
  IconList
};

// 활성 섹션 인덱스 (듀얼 패널 핵심 상태)
const activeSectionIndex = ref(0);

// 펼쳐진 2차 메뉴 상태
const expandedMenus = ref<number[]>([]);

/** 현재 활성 섹션 */
const activeSection = computed(() => props.visibleSections[activeSectionIndex.value]);

/** 2차 메뉴 펼침 여부 */
const isMenuExpanded = (menuId: number): boolean => {
  return expandedMenus.value.includes(menuId);
};

/** 2차 메뉴 토글 */
const toggleMenu = (menuId: number): void => {
  const index = expandedMenus.value.indexOf(menuId);
  if (index === -1) {
    expandedMenus.value.push(menuId);
  } else {
    expandedMenus.value.splice(index, 1);
  }
};

/** 하위 메뉴 중 활성 상태 확인 */
const hasActiveChild = (menu: MenuItem): boolean => {
  if (!menu.children) return false;
  return menu.children.some((child: ChildMenuItem) => activeMenuStore.value.isActiveItem(route.path, child.url));
};

/** 3차 메뉴 클릭 */
const handleChildClick = (child: ChildMenuItem, navigateFn: () => void): void => {
  if (props.onMenuClick(child.url, child.name)) {
    navigateFn();
  }
};

/** 단일 2차 메뉴 클릭 */
const handleSingleClick = (menu: MenuItem, navigateFn: () => void): void => {
  if (props.onMenuClick(menu.url || '/', menu.name)) {
    navigateFn();
  }
};

/** 현재 URL에 해당하는 섹션/메뉴 자동 활성화 */
const autoExpandActiveMenus = (): void => {
  const sections = props.visibleSections;

  // 활성 섹션 자동 선택
  const activeSectionId = activeMenuStore.value.getActiveSectionId(route.path);
  if (activeSectionId !== null) {
    const idx = sections.findIndex(s => s.id === activeSectionId);
    if (idx !== -1) {
      activeSectionIndex.value = idx;
    }
  }

  // 활성 2차 메뉴 자동 펼침
  const ids = activeMenuStore.value.getExpandedMenuIds(route.path);
  ids.forEach(id => {
    if (!expandedMenus.value.includes(id)) {
      expandedMenus.value.push(id);
    }
  });
};

// 라우트 변경 시 자동 활성화
watch(() => route.path, autoExpandActiveMenus, { immediate: true });

// visibleSections 변경 시 첫 섹션으로 리셋
watch(() => props.visibleSections, () => {
  activeSectionIndex.value = 0;
  expandedMenus.value = [];
  autoExpandActiveMenus();
});

defineExpose({
  closeAllMenus: () => {
    expandedMenus.value = [];
  }
});
</script>
