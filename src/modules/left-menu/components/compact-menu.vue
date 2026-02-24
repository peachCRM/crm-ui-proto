<template>
  <!-- 컴팩트 메뉴 (축소된 상태) - 섹션 아이콘만 표시, hover 시 섹션 메뉴 플로팅 -->
  <div class="w-16">
    <div class="flex flex-col items-center pt-3 gap-0.5">
      <div
        v-for="section in visibleSections"
        :key="section.id"
        class="relative"
      >
        <div
          :class="[
            'relative w-12 h-12 rounded-xl flex flex-col cursor-pointer items-center justify-center gap-[3px] transition-all duration-200',
            isOpen[section.id] || hasSectionActiveChild(section)
              ? 'bg-[#eff6ff] dark:bg-[#252525]'
              : 'hover:bg-[#f8fafc] dark:hover:bg-[#2a2a2a]'
          ]"
          @mouseenter="handleMouseEnter(section.id)"
          @mouseleave="handleMouseLeave(section.id)"
          :ref="(el) => setMenuRef(el, section.id)"
          :title="section.sectionTitle"
        >
          <!-- 활성 왼쪽 인디케이터 바 -->
          <span
            v-if="hasSectionActiveChild(section)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-[#3b82f6]"
          />
          <component
            :is="iconMap[section.icon]"
            class="w-5 h-5"
            :class="isOpen[section.id] || hasSectionActiveChild(section) ? 'text-[#3b82f6]' : 'text-[#94a3b8] dark:text-gray-500'"
          />
          <span
            class="text-[9.5px] leading-tight text-center px-0.5"
            :class="isOpen[section.id] || hasSectionActiveChild(section) ? 'text-[#3b82f6] font-bold' : 'text-[#94a3b8] dark:text-gray-500'"
          >{{ section.sectionTitle }}</span>
        </div>

        <!-- 섹션 플로팅 메뉴 -->
        <div
          v-if="isOpen[section.id]"
          class="fixed z-9999 min-w-[200px] rounded-xl bg-white py-1 dark:bg-neutral-900"
          style="box-shadow: 0 20px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)"
          :style="getMenuPosition(section.id)"
          @mouseenter="handleSubMenuEnter(section.id)"
          @mouseleave="handleSubMenuLeave(section.id)"
        >
          <!-- 섹션 타이틀 -->
          <div class="border-b border-[#f1f5f9] px-4 py-2.5 dark:border-neutral-700">
            <span class="text-[13px] font-bold text-[#1e293b] dark:text-neutral-300">{{ section.sectionTitle }}</span>
          </div>

          <!-- 2차 메뉴별 그룹 -->
          <div v-for="menu in section.menus" :key="menu.id">
            <!-- 2차 메뉴 헤더 -->
            <div class="px-4 pt-2 pb-0.5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.06em]">
              {{ menu.name }}
            </div>
            <!-- 3차 메뉴 링크 -->
            <router-link
              v-for="child in menu.children"
              :key="child.id"
              :to="child.url"
              custom
              v-slot="{ isActive: childIsActive }"
            >
              <div
                :class="childIsActive || isActiveUrl(child.url)
                  ? 'text-[#3b82f6] bg-customblue-50 font-medium dark:bg-blue-950/30'
                  : 'text-[#475569] hover:bg-customblue-50 hover:text-[#3b82f6] dark:text-neutral-400 dark:hover:bg-neutral-800'"
                class="flex items-center gap-2.5 h-8 px-4 text-[13px] transition-all duration-150 cursor-pointer"
                @click="handleChildClick(child, section.id)"
              >
                <span
                  :class="[
                    'rounded-full shrink-0 transition-all duration-200',
                    childIsActive || isActiveUrl(child.url) ? 'w-[5px] h-[5px]' : 'w-[5px] h-[5px] bg-[#cbd5e1]'
                  ]"
                  :style="childIsActive || isActiveUrl(child.url)
                    ? { background: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.15)', transform: 'scale(1.3)' }
                    : undefined"
                />
                {{ child.name }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IconUsers,
  IconSpeakerphone,
  IconChartBar,
  IconSettings,
  IconStretching2 as IconStretching,
  IconBuilding,
  IconBook,
  IconShoppingCart
} from '@tabler/icons-vue';
import type { MenuSection, ChildMenuItem } from '../type/left-menu.interface';

const props = defineProps<{
  visibleSections: MenuSection[];
  onMenuClick: (url: string, menuName: string) => boolean;
}>();

const route = useRoute();
const router = useRouter();

// 아이콘 매핑 (섹션 아이콘)
const iconMap: Record<string, Component> = {
  IconUsers,
  IconSpeakerphone,
  IconChartBar,
  IconSettings,
  IconStretching,
  IconBuilding,
  IconBookOpen: IconBook,
  IconShoppingCart
};

// 상태
const isOpen = ref<Record<number, boolean>>({});
const menuRefs = ref<Record<number, HTMLElement>>({});
const timers = ref<Record<number, ReturnType<typeof setTimeout>>>({});

/** URL 활성 상태 확인 */
const isActiveUrl = (url: string): boolean => {
  if (!url) return false;
  return route.path === url || route.path.startsWith(url + '/');
};

/** 섹션에 활성 자식이 있는지 확인 */
const hasSectionActiveChild = (section: MenuSection): boolean => {
  for (const menu of section.menus) {
    if (menu.children.some(child => isActiveUrl(child.url))) return true;
  }
  return false;
};

/** DOM 참조 저장 */
const setMenuRef = (el: unknown, sectionId: number): void => {
  const element = el as { $el?: HTMLElement } | HTMLElement | null;
  if (element && '$el' in element && element.$el) {
    menuRefs.value[sectionId] = element.$el as HTMLElement;
  } else if (element) {
    menuRefs.value[sectionId] = element as HTMLElement;
  }
};

/** 플로팅 메뉴 위치 계산 */
const getMenuPosition = (sectionId: number): { top: string; left: string } => {
  const el = menuRefs.value[sectionId];
  if (!el) return { top: '0px', left: '70px' };
  const rect = el.getBoundingClientRect();
  let top = rect.top;
  const windowHeight = window.innerHeight;
  if (top + 300 > windowHeight) top = windowHeight - 320;
  return { top: `${Math.max(10, top)}px`, left: '70px' };
};

/** 3차 메뉴 클릭 */
const handleChildClick = (child: ChildMenuItem, sectionId: number): void => {
  if (props.onMenuClick(child.url, child.name)) {
    router.push(child.url);
  }
  closeMenu(sectionId);
};

/** 메뉴 닫기 */
const closeMenu = (sectionId: number): void => {
  isOpen.value[sectionId] = false;
};

/** 호버 이벤트 */
const handleMouseEnter = (sectionId: number): void => {
  if (timers.value[sectionId]) { clearTimeout(timers.value[sectionId]); delete timers.value[sectionId]; }
  Object.keys(isOpen.value).forEach(key => { if (parseInt(key) !== sectionId) isOpen.value[parseInt(key)] = false; });
  isOpen.value[sectionId] = true;
};
const handleMouseLeave = (sectionId: number): void => {
  timers.value[sectionId] = setTimeout(() => { isOpen.value[sectionId] = false; delete timers.value[sectionId]; }, 100);
};
const handleSubMenuEnter = (sectionId: number): void => {
  if (timers.value[sectionId]) { clearTimeout(timers.value[sectionId]); delete timers.value[sectionId]; }
};
const handleSubMenuLeave = (sectionId: number): void => {
  isOpen.value[sectionId] = false;
};

onUnmounted(() => {
  Object.values(timers.value).forEach(timer => clearTimeout(timer));
});

defineExpose({
  closeAllMenus: () => {
    Object.keys(isOpen.value).forEach(key => { isOpen.value[parseInt(key)] = false; });
  }
});
</script>
