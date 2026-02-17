<template>
  <!-- Notion 스타일 상세 메뉴 (확장된 상태) -->
  <div class="w-[186px] bg-[#fbfbfa] dark:bg-[#191919] pb-24">
    <!-- 로고 영역 -->
    <div class="px-3 pb-2">
      <div class="text-base font-bold text-[#287dff]">PEACH</div>
    </div>

    <!-- 섹션별 메뉴 렌더링 (Notion 스타일) -->
    <nav aria-label="메인 네비게이션" class="py-1">
      <div v-for="section in visibleSections" :key="section.id" class="mb-0.5">
        <!-- 섹션 토글 (▶ 삼각형 회전) -->
        <button
          :class="[
            'w-full flex items-center gap-1 px-2.5 py-1.5 cursor-pointer',
            'text-[#91918e] dark:text-[#6b6b6b] hover:bg-[#f0f0ef] dark:hover:bg-[#252525] transition-colors duration-100'
          ]"
          @click="toggleSection(section.id)"
        >
          <span
            :class="[
              'text-[9px] w-3.5 text-center inline-block transition-transform duration-150',
              'text-[#91918e] dark:text-[#6b6b6b]'
            ]"
            :style="{ transform: isSectionExpanded(section.id) ? 'rotate(90deg)' : 'rotate(0deg)' }"
          >▶</span>
          <span class="text-xs font-semibold tracking-wide">{{ section.sectionTitle }}</span>
        </button>

        <!-- 섹션 내 메뉴 -->
        <div v-show="isSectionExpanded(section.id)">
          <div v-for="menu in section.menus" :key="menu.id">
            <!-- 자식이 있는 메뉴 (▶ 삼각형 토글) -->
            <template v-if="menu.children && menu.children.length > 0">
              <button
                :class="[
                  'w-full flex items-center gap-1 pl-5 pr-2.5 py-1.5 cursor-pointer rounded-[3px]',
                  'transition-colors duration-100',
                  isMenuExpanded(menu.id) || hasActiveChild(menu)
                    ? 'text-[#287dff] dark:text-blue-400'
                    : 'text-[#37352f] dark:text-[#cfcfcf] hover:bg-[#f0f0ef] dark:hover:bg-[#252525]'
                ]"
                @click="toggleMenu(menu.id)"
              >
                <span
                  :class="[
                    'text-[9px] w-3.5 text-center inline-block transition-transform duration-150',
                    isMenuExpanded(menu.id) || hasActiveChild(menu) ? 'text-[#287dff] dark:text-blue-400' : 'text-[#91918e] dark:text-[#6b6b6b]'
                  ]"
                  :style="{ transform: isMenuExpanded(menu.id) ? 'rotate(90deg)' : 'rotate(0deg)' }"
                >▶</span>
                <span class="text-[13px]">{{ menu.name }}</span>
              </button>

              <!-- 3차 하위 메뉴 -->
              <div v-show="isMenuExpanded(menu.id)">
                <router-link
                  v-for="child in menu.children"
                  :key="child.id"
                  :to="child.url"
                  custom
                  v-slot="{ navigate, isActive }"
                >
                  <button
                    :class="[
                      'w-full text-left pl-11 pr-2.5 py-1.5 text-[13px] rounded-[3px] mx-1 cursor-pointer',
                      'transition-colors duration-100',
                      isActive
                        ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
                        : 'text-[#37352f] dark:text-[#cfcfcf] hover:bg-[#f0f0ef] dark:hover:bg-[#252525]'
                    ]"
                    :aria-current="isActive ? 'page' : undefined"
                    @click="handleChildClick(child, navigate)"
                  >
                    {{ child.name }}
                  </button>
                </router-link>
              </div>
            </template>

            <!-- 자식이 없는 단일 링크 메뉴 -->
            <template v-else>
              <router-link
                :to="menu.url || '/'"
                custom
                v-slot="{ navigate, isActive }"
              >
                <button
                  :class="[
                    'w-full flex items-center gap-1 pl-5 pr-2.5 py-1.5 cursor-pointer rounded-[3px]',
                    'transition-colors duration-100',
                    isActive
                      ? 'text-[#287dff] dark:text-blue-400 bg-[#f0f0ef] dark:bg-[#252525] font-medium'
                      : 'text-[#37352f] dark:text-[#cfcfcf] hover:bg-[#f0f0ef] dark:hover:bg-[#252525]'
                  ]"
                  :aria-current="isActive ? 'page' : undefined"
                  @click="handleSingleClick(menu, navigate)"
                >
                  <span class="w-3.5" />
                  <span class="text-[13px]">{{ menu.name }}</span>
                </button>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 하단 정보 -->
    <div class="mt-6 px-3">
      <div
        :class="[
          'text-xs text-center p-2.5 rounded-[3px]',
          'text-[#91918e] dark:text-[#6b6b6b] bg-[#f0f0ef] dark:bg-[#252525]'
        ]"
      >
        <p class="font-semibold text-[#287dff] mb-0.5">피치CRM</p>
        <p class="text-[11px]">CRM Type 2</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
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

// 경로에 따라 적절한 메뉴 스토어 선택
const isGuideArea = computed(() => route.path.startsWith('/guide'));
const activeMenuStore = computed(() => isGuideArea.value ? guideMenuStore : leftMenuStore);

// 펼쳐진 섹션 상태
const expandedSections = ref<number[]>([]);

// 펼쳐진 메뉴 상태
const expandedMenus = ref<number[]>([]);

/** 섹션이 펼쳐져 있는지 확인 */
const isSectionExpanded = (sectionId: number): boolean => {
  return expandedSections.value.includes(sectionId);
};

/** 섹션 토글 */
const toggleSection = (sectionId: number): void => {
  const index = expandedSections.value.indexOf(sectionId);
  if (index === -1) {
    expandedSections.value.push(sectionId);
  } else {
    expandedSections.value.splice(index, 1);
  }
};

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

/** 하위 메뉴 클릭 - 라우트 구현 여부 확인 후 네비게이션 */
const handleChildClick = (child: ChildMenuItem, navigateFn: () => void): void => {
  if (props.onMenuClick(child.url, child.name)) {
    navigateFn();
  }
};

/** 단일 메뉴 클릭 - 라우트 구현 여부 확인 후 네비게이션 */
const handleSingleClick = (menu: MenuItem, navigateFn: () => void): void => {
  if (props.onMenuClick(menu.url || '/', menu.name)) {
    navigateFn();
  }
};

/** 하위 메뉴 중 활성 상태가 있는지 확인 */
const hasActiveChild = (menu: MenuItem): boolean => {
  if (!menu.children) return false;
  return menu.children.some((child: ChildMenuItem) => child.url === route.path);
};

/** 활성 하위 메뉴가 있는 섹션/메뉴 자동 펼침 */
const autoExpandActiveMenus = () => {
  activeMenuStore.value.visibleSections.forEach(section => {
    let sectionHasActive = false;
    section.menus.forEach(menu => {
      if (menu.children && hasActiveChild(menu)) {
        sectionHasActive = true;
        if (!expandedMenus.value.includes(menu.id)) {
          expandedMenus.value.push(menu.id);
        }
      }
      // 단일 링크 메뉴의 활성 상태 확인
      if (!menu.children?.length && menu.url === route.path) {
        sectionHasActive = true;
      }
    });
    // 활성 메뉴가 있는 섹션 자동 펼침
    if (sectionHasActive && !expandedSections.value.includes(section.id)) {
      expandedSections.value.push(section.id);
    }
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
