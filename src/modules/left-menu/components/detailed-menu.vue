<template>
  <!-- 상세 메뉴 (확장된 상태) - 전체 메뉴 텍스트와 서브메뉴가 표시되는 상태 -->
  <div class="w-[186px]">
    <!-- 메뉴 아코디언 컴포넌트 -->
    <div class="flex flex-col">
      <template v-for="menuItem in visibleLeftMenus" :key="menuItem.id">
        <!-- 서브메뉴가 있는 메뉴 -->
        <template v-if="menuItem.children && menuItem.children.length > 0">
          <div class="flex flex-col">
            <!-- 메인 메뉴 헤더 -->
            <div
              class="flex cursor-pointer flex-row items-center justify-between px-4 py-3.5"
              @click="handleMenuClick(menuItem.id || 0)"
            >
              <div
                class="text-fontsize14 text-customGray595 leading-line22 dark:text-graya6a6a6 flex flex-row gap-2.5 font-semibold"
              >
                <img :src="menuItem.src" class="" :alt="menuItem.name" />
                {{ menuItem.name }}
              </div>
              <div class="">
                <!-- 화살표 아이콘 (라이트/다크 모드별) -->
                <img
                  src="../assets/side_arrow.svg"
                  :class="{ 'rotate-180': isOpen[menuItem.id || 0] }"
                  class="block dark:hidden"
                  alt="메뉴 더보기"
                />
                <img
                  src="../assets/side_arrow_dark.svg"
                  :class="{ 'rotate-180': isOpen[menuItem.id || 0] }"
                  class="hidden dark:block"
                  alt="메뉴 더보기"
                />
              </div>
            </div>

            <!-- 서브메뉴 (슬라이드 애니메이션) -->
            <transition name="slide-fade">
              <div
                v-if="isOpen[menuItem.id || 0]"
                class="bg-sideMenuBg dark:bg-black141414 flex flex-col py-1"
              >
                <template v-for="child in menuItem.children" :key="child.id">
                  <router-link
                    class="cursor-pointer"
                    :to="child.url"
                    @click="handleSubMenuClick(menuItem.id || 0)"
                  >
                    <div
                      :class="{
                        'text-purple-700 bg-purple-50 font-medium': isActive(child.url)
                      }"
                      class="text-fontsize14 text-customGray595 leading-line22 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-black141414 dark:text-graya6a6a6 flex h-10 items-center ps-[42px] pr-4 hover:font-medium"
                    >
                      {{ child.name }}
                    </div>
                  </router-link>
                </template>
              </div>
            </transition>
          </div>
        </template>

        <!-- 서브메뉴가 없는 단일 메뉴 -->
        <template v-else>
          <div class="flex flex-col">
            <router-link :to="menuItem.url || ''" class="cursor-pointer">
              <div
                :class="{ 'bg-purple-50': isActive(menuItem.url) }"
                class="flex flex-row items-center justify-between px-4 py-3.5 dark:text-[#3C89E8]"
              >
                <div
                  :class="{ 'text-purple-700': isActive(menuItem.url) }"
                  class="text-fontsize14 text-customGray595 leading-line22 dark:text-graya6a6a6 flex flex-row gap-2.5 font-semibold"
                >
                  <!-- 메뉴 아이콘 이미지 -->
                  <img :src="menuItem.src" :alt="menuItem.name" />
                  {{ menuItem.name }}
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </template>
    </div>

    <!-- 하단 배너 섹션 -->
    <div class="my-3 flex flex-col items-center gap-3 px-4">
      <div class="text-xs text-gray-500 text-center">
        <p class="font-semibold text-purple-600">피치CRM Proto</p>
        <p>프로토타이핑 환경</p>
        <p class="mt-2 text-green-600">Mock 모드 활성</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem, ChildMenuItem } from '../type/left-menu.interface';

/**
 * 상세 메뉴 컴포넌트 (Detailed Menu Component)
 *
 * 좌측 메뉴가 확장된 상태에서 사용되는 컴포넌트입니다.
 * - 메뉴 텍스트와 아이콘이 모두 표시됩니다.
 * - 아코디언 방식으로 서브메뉴를 제어합니다.
 * - 클릭 기반의 메뉴 네비게이션을 제공합니다.
 */

// Props 정의
const props = defineProps<{
  visibleLeftMenus: MenuItem[];
}>();

// Emits 정의
const emit = defineEmits<{
  'menu-state-change': [menuId: number, isOpen: boolean];
}>();

const route = useRoute();

// 메뉴 열림 상태 관리
const isOpen = ref<Record<number, boolean>>({});

/**
 * 현재 경로와 메뉴 URL 비교하여 활성 상태 확인
 * @param url - 메뉴 URL
 * @returns 활성 상태 여부
 */
const isActive = (url: string | undefined): boolean => {
  return route.path === url;
};

/**
 * 메인 메뉴 클릭 이벤트 핸들러
 * 아코디언 방식으로 서브메뉴를 열고 닫기
 * @param menuId - 클릭된 메뉴 ID
 */
const handleMenuClick = (menuId: number): void => {
  isOpen.value[menuId] = !isOpen.value[menuId];
  emit('menu-state-change', menuId, isOpen.value[menuId]);
};

/**
 * 서브메뉴 클릭 이벤트 핸들러
 * 서브메뉴 클릭 시 해당 부모 메뉴만 열린 상태로 유지하고 다른 메뉴는 닫기
 * @param parentMenuId - 부모 메뉴 ID
 */
const handleSubMenuClick = (parentMenuId: number): void => {
  // 다른 모든 메뉴 닫기
  Object.keys(isOpen.value).forEach((key) => {
    const id = parseInt(key);
    if (id !== parentMenuId) {
      isOpen.value[id] = false;
    }
  });

  // 클릭한 메뉴의 최상단 메뉴만 열기
  isOpen.value[parentMenuId] = true;
  emit('menu-state-change', parentMenuId, true);
};

/**
 * 현재 경로에 따른 메뉴 열림 상태 업데이트
 * 현재 페이지에 해당하는 메뉴를 자동으로 열어서 사용자가 현재 위치를 쉽게 파악할 수 있도록 함
 */
const updateMenuOpenState = (menus: MenuItem[]): void => {
  menus?.forEach((menu: MenuItem) => {
    if (menu.children && menu.children.some((child: ChildMenuItem) => isActive(child.url))) {
      if (menu.id) {
        isOpen.value[menu.id] = true;
        emit('menu-state-change', menu.id, true);
      }
    }
  });
};

// 라우트 변경 감지하여 메뉴 상태 업데이트
watch(
  () => route.path,
  () => {
    updateMenuOpenState(props.visibleLeftMenus);
  },
  { immediate: true }
);

// 외부에서 메뉴 상태 제어를 위한 함수 노출
defineExpose({
  /**
   * 모든 메뉴를 닫는 함수
   * 메뉴 토글 시 상태 초기화를 위해 사용
   */
  closeAllMenus: () => {
    Object.keys(isOpen.value).forEach((key) => {
      isOpen.value[parseInt(key)] = false;
    });
  }
});
</script>

<style scoped lang="scss">
/* 슬라이드 페이드 애니메이션 - 서브메뉴 전개/축소 효과 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 1000px; /* 충분히 큰 값으로 설정하여 모든 서브메뉴가 표시되도록 함 */
  opacity: 1;
}
</style>
