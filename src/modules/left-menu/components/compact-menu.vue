<template>
  <!-- 컴팩트 메뉴 (축소된 상태) - 아이콘만 표시, 호버 시 3-depth 플로팅 메뉴 -->
  <div class="w-[60px]">
    <div class="flex flex-col pt-2">
      <template v-for="section in visibleSections" :key="section.id">
        <template v-for="menu in section.menus" :key="menu.id">
          <!-- 자식이 있는 메뉴 -->
          <div v-if="menu.children && menu.children.length > 0" class="relative">
            <div
              class="flex cursor-pointer items-center justify-center px-2 py-3"
              :class="{ 'bg-blue-50 dark:bg-blue-950/30': isOpen[menu.id] || hasActiveChild(menu) }"
              @mouseenter="handleMouseEnter(menu.id)"
              @mouseleave="handleMouseLeave(menu.id)"
              :ref="(el) => setMenuRef(el, menu.id)"
              :title="menu.name"
            >
              <component
                :is="iconMap[menu.icon]"
                class="w-5 h-5"
                :class="isOpen[menu.id] || hasActiveChild(menu) ? 'text-[color:var(--ui-primary)]' : 'text-neutral-500'"
              />
            </div>

            <!-- 2차 플로팅 서브메뉴 -->
            <div
              v-if="isOpen[menu.id]"
              class="fixed z-[9999] min-w-[180px] rounded-lg border border-neutral-200 bg-white py-1 shadow dark:border-neutral-700 dark:bg-neutral-900"
              :style="getMenuPosition(menu.id)"
              @mouseenter="handleSubMenuEnter(menu.id)"
              @mouseleave="handleSubMenuLeave(menu.id)"
            >
              <!-- 타이틀 -->
              <div class="border-b border-neutral-200 px-3 py-2 dark:border-neutral-700">
                <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ menu.name }}</span>
              </div>
              <!-- 3차 링크 (children의 children이 없으므로 직접 링크) -->
              <router-link
                v-for="child in menu.children"
                :key="child.id"
                :to="child.url"
                custom
                v-slot="{ isActive: childIsActive }"
              >
                <div
                  :class="childIsActive || isActiveUrl(child.url)
                    ? 'text-[color:var(--ui-primary)] bg-blue-50 font-medium dark:bg-blue-950/30'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'"
                  class="flex items-center gap-2 h-9 px-3 text-sm transition-colors duration-150 cursor-pointer"
                  @click="handleChildClick(child, menu.id)"
                >
                  <span
                    v-if="childIsActive || isActiveUrl(child.url)"
                    class="w-1 h-1 rounded-full bg-[color:var(--ui-primary)] shrink-0"
                  />
                  {{ child.name }}
                </div>
              </router-link>
            </div>
          </div>

          <!-- 자식이 없는 단일 메뉴 -->
          <router-link v-else :to="menu.url || '/'" custom v-slot="{ isActive: menuIsActive }">
            <div
              class="flex cursor-pointer items-center justify-center px-2 py-3"
              :class="menuIsActive || isActiveUrl(menu.url) ? 'bg-blue-50 dark:bg-blue-950/30' : ''"
              :title="menu.name"
              @click="handleSingleClick(menu)"
            >
              <component
                :is="iconMap[menu.icon]"
                class="w-5 h-5"
                :class="menuIsActive || isActiveUrl(menu.url) ? 'text-[color:var(--ui-primary)]' : 'text-neutral-500'"
              />
            </div>
          </router-link>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
import type { MenuSection, MenuItem, ChildMenuItem } from '../type/left-menu.interface';

const props = defineProps<{
  visibleSections: MenuSection[];
  onMenuClick: (url: string, menuName: string) => boolean;
}>();

const route = useRoute();
const router = useRouter();

// 아이콘 매핑
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

// 상태
const isOpen = ref<Record<number, boolean>>({});
const menuRefs = ref<Record<number, HTMLElement>>({});
const timers = ref<Record<number, ReturnType<typeof setTimeout>>>({});

/** URL 활성 상태 확인 (startsWith로 서브경로 포함) */
const isActiveUrl = (url: string): boolean => {
  if (!url) return false;
  return route.path === url || route.path.startsWith(url + '/');
};

/** 하위 메뉴 중 활성 상태 확인 */
const hasActiveChild = (menu: MenuItem): boolean => {
  if (!menu.children) return false;
  return menu.children.some((child: ChildMenuItem) => isActiveUrl(child.url));
};

/** DOM 참조 저장 */
const setMenuRef = (el: unknown, menuId: number): void => {
  const element = el as { $el?: HTMLElement } | HTMLElement | null;
  if (element && '$el' in element && element.$el) {
    menuRefs.value[menuId] = element.$el as HTMLElement;
  } else if (element) {
    menuRefs.value[menuId] = element as HTMLElement;
  }
};

/** 플로팅 메뉴 위치 계산 */
const getMenuPosition = (menuId: number): { top: string; left: string } => {
  const el = menuRefs.value[menuId];
  if (!el) return { top: '0px', left: '70px' };

  const rect = el.getBoundingClientRect();
  let top = rect.top;
  const windowHeight = window.innerHeight;
  if (top + 200 > windowHeight) top = windowHeight - 220;

  return { top: `${Math.max(10, top)}px`, left: '70px' };
};

/** 하위 메뉴 클릭 - 라우트 구현 여부 확인 후 네비게이션 */
const handleChildClick = (child: ChildMenuItem, menuId: number): void => {
  if (props.onMenuClick(child.url, child.name)) {
    router.push(child.url);
  }
  closeMenu(menuId);
};

/** 단일 메뉴 클릭 - 라우트 구현 여부 확인 후 네비게이션 */
const handleSingleClick = (menu: MenuItem): void => {
  if (props.onMenuClick(menu.url || '/', menu.name)) {
    router.push(menu.url || '/');
  }
};

/** 메뉴 닫기 */
const closeMenu = (menuId: number): void => {
  isOpen.value[menuId] = false;
};

/** 호버 이벤트 */
const handleMouseEnter = (menuId: number): void => {
  if (timers.value[menuId]) { clearTimeout(timers.value[menuId]); delete timers.value[menuId]; }
  Object.keys(isOpen.value).forEach(key => { if (parseInt(key) !== menuId) isOpen.value[parseInt(key)] = false; });
  isOpen.value[menuId] = true;
};
const handleMouseLeave = (menuId: number): void => {
  timers.value[menuId] = setTimeout(() => { isOpen.value[menuId] = false; delete timers.value[menuId]; }, 100);
};
const handleSubMenuEnter = (menuId: number): void => {
  if (timers.value[menuId]) { clearTimeout(timers.value[menuId]); delete timers.value[menuId]; }
};
const handleSubMenuLeave = (menuId: number): void => {
  isOpen.value[menuId] = false;
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
