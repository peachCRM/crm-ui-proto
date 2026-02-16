<template>
  <!-- 상세 메뉴 (확장된 상태) -->
  <div class="w-[186px] pb-24">
    <!-- 로고 영역 -->
    <div class="px-4 pb-4">
      <div class="text-lg font-bold text-[color:var(--ui-primary)]">PEACH</div>
    </div>

    <!-- 섹션별 메뉴 렌더링 -->
    <nav aria-label="메인 네비게이션">
      <div v-for="section in visibleSections" :key="section.id" class="mb-2">
        <!-- 섹션 타이틀 -->
        <div class="px-4 pb-1 pt-4 text-xs font-medium text-neutral-400 tracking-wider">
          {{ section.sectionTitle }}
        </div>

        <!-- 메뉴 아이템 -->
        <ul class="space-y-0.5">
          <li v-for="menu in section.menus" :key="menu.id">
            <!-- 자식이 있는 메뉴 (아코디언) -->
            <template v-if="menu.children && menu.children.length > 0">
              <button
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors duration-150"
                :class="{
                  'text-[color:var(--ui-primary)] font-medium': isMenuExpanded(menu.id) || hasActiveChild(menu)
                }"
                @click="toggleMenu(menu.id)"
              >
                <component :is="iconMap[menu.icon]" class="w-[18px] h-[18px] flex-shrink-0" />
                <span class="flex-1 text-left">{{ menu.name }}</span>
                <IconChevronDown
                  class="w-4 h-4 text-neutral-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isMenuExpanded(menu.id) }"
                />
              </button>

              <!-- 하위 메뉴 -->
              <ul v-show="isMenuExpanded(menu.id)" class="mt-0.5 space-y-0.5">
                <li v-for="child in menu.children" :key="child.id">
                  <router-link
                    :to="child.url"
                    custom
                    v-slot="{ navigate, isActive }"
                  >
                    <button
                      class="w-full text-left pl-10 pr-4 py-1.5 text-sm transition-colors duration-150"
                      :class="isActive
                        ? 'text-[color:var(--ui-primary)] font-medium bg-blue-50 dark:bg-blue-950/30'
                        : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-800'"
                      :aria-current="isActive ? 'page' : undefined"
                      @click="navigate"
                    >
                      {{ child.name }}
                    </button>
                  </router-link>
                </li>
              </ul>
            </template>

            <!-- 자식이 없는 단일 링크 메뉴 -->
            <template v-else>
              <router-link
                :to="menu.url || '/'"
                custom
                v-slot="{ navigate, isActive }"
              >
                <button
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-150"
                  :class="isActive
                    ? 'text-[color:var(--ui-primary)] font-medium bg-blue-50 dark:bg-blue-950/30'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'"
                  :aria-current="isActive ? 'page' : undefined"
                  @click="navigate"
                >
                  <component :is="iconMap[menu.icon]" class="w-[18px] h-[18px] flex-shrink-0" />
                  <span>{{ menu.name }}</span>
                </button>
              </router-link>
            </template>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 하단 정보 -->
    <div class="mt-6 px-4">
      <div class="text-xs text-neutral-400 text-center p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <p class="font-semibold text-[color:var(--ui-primary)] mb-0.5">피치CRM</p>
        <p class="text-[11px]">CRM Type 2</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Component } from 'vue';
import { useRoute } from 'vue-router';
import {
  IconChevronDown,
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
import { useLeftMenuStore } from '../store/left-menu.store';
import { useGuideMenuStore } from '../store/guide-menu.store';

defineProps<{
  visibleSections: MenuSection[];
}>();

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

const route = useRoute();
const leftMenuStore = useLeftMenuStore();
const guideMenuStore = useGuideMenuStore();

// 경로에 따라 적절한 메뉴 스토어 선택
const isGuideArea = computed(() => route.path.startsWith('/guide'));
const activeMenuStore = computed(() => isGuideArea.value ? guideMenuStore : leftMenuStore);

// 펼쳐진 메뉴 상태
const expandedMenus = ref<number[]>([]);

/** 메뉴가 펼쳐져 있는지 확인 */
const isMenuExpanded = (menuId: number): boolean => {
  return expandedMenus.value.includes(menuId);
};

/** 메뉴 토글 */
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
  return menu.children.some((child: ChildMenuItem) => child.url === route.path);
};

/** 활성 하위 메뉴가 있는 부모 자동 펼침 */
const autoExpandActiveMenus = () => {
  activeMenuStore.value.visibleSections.forEach(section => {
    section.menus.forEach(menu => {
      if (menu.children && hasActiveChild(menu)) {
        if (!expandedMenus.value.includes(menu.id)) {
          expandedMenus.value.push(menu.id);
        }
      }
    });
  });
};

// 라우트 변경 시 해당 메뉴 자동 펼침
watch(() => route.path, autoExpandActiveMenus, { immediate: true });

// 외부 접근 함수
defineExpose({
  closeAllMenus: () => {
    expandedMenus.value = [];
  }
});
</script>
