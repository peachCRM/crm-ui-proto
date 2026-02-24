<template>
  <!-- 듀얼 패널 상세 메뉴: 64px 아이콘 레일 + 200px 메뉴 패널 = 264px -->
  <div class="w-[264px] flex h-full">

    <!-- ── 좌측 아이콘 레일 (64px) ── -->
    <div class="w-16 shrink-0 bg-white dark:bg-black141414 border-r border-[#f1f5f9] dark:border-gray-700 flex flex-col items-center pt-3 gap-0.5">
      <div
        v-for="(section, idx) in visibleSections"
        :key="section.id"
        :class="[
          'relative w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-[3px] cursor-pointer transition-all duration-200',
          activeSectionIndex === idx
            ? 'bg-[#eff6ff] dark:bg-[#252525]'
            : 'hover:bg-[#f8fafc] dark:hover:bg-[#2a2a2a]'
        ]"
        @click="activeSectionIndex = idx"
      >
        <!-- 활성 왼쪽 인디케이터 바 -->
        <span
          v-if="activeSectionIndex === idx"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-[#3b82f6]"
        />
        <!-- 아이콘 (20px) -->
        <component
          :is="iconMap[section.icon]"
          class="w-5 h-5"
          :class="activeSectionIndex === idx ? 'text-[#3b82f6]' : 'text-[#94a3b8] dark:text-gray-500'"
        />
        <!-- 레이블 -->
        <span
          class="text-[9.5px] leading-tight text-center px-0.5"
          :class="activeSectionIndex === idx ? 'text-[#3b82f6] font-bold' : 'text-[#94a3b8] dark:text-gray-500'"
        >{{ section.sectionTitle }}</span>
      </div>
    </div>

    <!-- ── 우측 메뉴 패널 (200px) ── -->
    <div class="w-[200px] bg-[#fafbfc] dark:bg-[#191919] border-r border-[#f1f5f9] dark:border-gray-700 flex flex-col overflow-hidden">

      <!-- 섹션 헤더 -->
      <div class="px-[18px] pt-4 pb-3 flex items-center justify-between shrink-0 border-b border-[#f1f5f9] dark:border-gray-700">
        <span class="text-[13px] font-bold text-[#1e293b] dark:text-white">{{ activeSection?.sectionTitle }}</span>
      </div>

      <!-- 2차/3차 메뉴 렌더링 -->
      <div class="flex-1 overflow-y-auto py-2" key="section-panel">
        <nav v-if="activeSection" aria-label="메뉴 네비게이션">
          <div v-for="menu in activeSection.menus" :key="menu.id">

            <!-- 자식이 있는 2차 메뉴 -->
            <template v-if="menu.children && menu.children.length > 0">
              <div
                :class="[
                  'relative flex items-center gap-[9px] px-[18px] py-[9px] cursor-pointer transition-all duration-150',
                  hasActiveChild(menu)
                    ? 'text-[#1e293b] dark:text-white font-semibold'
                    : 'text-[#64748b] dark:text-[#6b6b6b] hover:text-[#1e293b] dark:hover:text-[#cfcfcf] hover:bg-bodyBg dark:hover:bg-[#252525]'
                ]"
                @click="toggleMenu(menu.id)"
              >
                <!-- L2 활성 왼쪽 인디케이터 바 -->
                <span
                  v-if="hasActiveChild(menu)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r bg-[#3b82f6]"
                />
                <!-- L2 아이콘 박스 (26px, rounded-7) -->
                <span
                  class="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0 transition-all duration-200"
                  :class="hasActiveChild(menu) ? 'bg-[#eff6ff] text-[#3b82f6]' : 'bg-bodyBg text-[#94a3b8]'"
                >
                  <component :is="iconMap[menu.icon] || iconMap['IconMenu']" class="w-3.5 h-3.5" />
                </span>
                <span class="flex-1 text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{{ menu.name }}</span>
                <!-- 펼침 화살표 -->
                <svg
                  width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"
                  class="shrink-0 transition-transform duration-200"
                  :class="hasActiveChild(menu) ? 'text-[#3b82f6]' : 'text-[#c1c8d4]'"
                  :style="{ transform: isMenuExpanded(menu.id) ? 'rotate(90deg)' : 'rotate(0deg)' }"
                ><path d="m9 18 6-6-6-6" /></svg>
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
                      'w-full text-left pr-[18px] py-[7px] text-[12.5px] cursor-pointer transition-all duration-100',
                      isActive
                        ? 'text-[#3b82f6] dark:text-blue-400 bg-[#eff6ff] dark:bg-[#252525] font-semibold'
                        : 'text-[#64748b] dark:text-[#cfcfcf] hover:bg-bodyBg dark:hover:bg-[#252525] hover:text-[#3b82f6]'
                    ]"
                    style="padding-left: 54px"
                    :aria-current="isActive ? 'page' : undefined"
                    @click="handleChildClick(child, navigate)"
                  >
                    <span class="flex items-center gap-[9px]">
                      <span
                        class="rounded-full shrink-0 w-[5px] h-[5px] transition-all duration-200"
                        :style="isActive
                          ? { background: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.15)', transform: 'scale(1.3)' }
                          : { background: '#cbd5e1' }"
                      />
                      {{ child.name }}
                    </span>
                  </button>
                </router-link>
              </div>
            </template>

            <!-- 자식이 없는 단일 2차 메뉴 -->
            <template v-else>
              <router-link
                :to="menu.url || '/'"
                custom
                v-slot="{ navigate, isActive }"
              >
                <button
                  :class="[
                    'relative w-full flex items-center gap-[9px] px-[18px] py-[9px] cursor-pointer text-[13px] transition-all duration-100',
                    isActive
                      ? 'text-[#1e293b] dark:text-white font-semibold'
                      : 'text-[#64748b] dark:text-[#cfcfcf] hover:text-[#1e293b] dark:hover:text-white hover:bg-bodyBg dark:hover:bg-[#252525]'
                  ]"
                  :aria-current="isActive ? 'page' : undefined"
                  @click="handleSingleClick(menu, navigate)"
                >
                  <span
                    v-if="isActive"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r bg-[#3b82f6]"
                  />
                  <!-- 아이콘 박스 -->
                  <span
                    class="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0 transition-all duration-200"
                    :class="isActive ? 'bg-[#eff6ff] text-[#3b82f6]' : 'bg-bodyBg text-[#94a3b8]'"
                  >
                    <component :is="iconMap[menu.icon] || iconMap['IconMenu']" class="w-3.5 h-3.5" />
                  </span>
                  {{ menu.name }}
                </button>
              </router-link>
            </template>
          </div>
        </nav>
      </div>
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
  IconList,
  IconMessageCircle,
  IconPhone,
  IconTag,
  IconMessage as IconBrandKakao,
  IconDeviceMobile,
  IconMail,
  IconTarget,
  IconRobot,
  IconGauge,
  IconSparkles,
  IconUsersGroup,
  IconChartPie,
  IconBuildingStore,
  IconUserCog,
  IconPlug,
  IconCurrencyWon,
  IconShield,
  IconCalendar,
  IconId,
  IconClipboardCheck,
  IconHome,
  IconArrowsExchange,
  IconFileText as IconFileContract,
  IconChartLine,
  IconHistory,
  IconHeadset,
  IconMicrophone2 as IconMicrophone,
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

// 섹션 + L2 메뉴 아이콘 매핑
const iconMap: Record<string, Component> = {
  // 섹션 아이콘
  IconUsers,
  IconSpeakerphone,
  IconChartBar,
  IconSettings,
  IconStretching,
  IconBuilding,
  IconBookOpen: IconBook,
  IconShoppingCart,
  IconMenu,
  IconList,
  // L2 메뉴 아이콘
  IconMessageCircle,
  IconPhone,
  IconTag,
  IconBrandKakao,
  IconDeviceMobile,
  IconMail,
  IconTarget,
  IconRobot,
  IconGauge,
  IconSparkles,
  IconUsersGroup,
  IconChartPie,
  IconBuildingStore,
  IconUserCog,
  IconPlug,
  IconCurrencyWon,
  IconShield,
  IconCalendar,
  IconId,
  IconClipboardCheck,
  IconHome,
  IconArrowsExchange,
  IconFileContract,
  IconChartLine,
  IconHistory,
  IconHeadset,
  IconMicrophone,
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
