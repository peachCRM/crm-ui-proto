<template>
  <!-- 컴팩트 메뉴 (축소된 상태) - 아이콘만 표시되고 호버 시 플로팅 메뉴가 나타나는 상태 -->
  <div class="w-[60px]">
    <!-- 메뉴 아코디언 컴포넌트 -->
    <div class="flex flex-col">
      <template v-for="menuItem in visibleLeftMenus" :key="menuItem.id">
        <!-- 서브메뉴가 있는 메뉴 -->
        <template v-if="menuItem.children && menuItem.children.length > 0">
          <div class="flex flex-col">
            <!-- 메인 메뉴 아이콘 -->
            <div
              class="flex cursor-pointer flex-row items-center justify-between px-5 py-3.5"
              :class="{
                'bg-purple-50': isOpen[menuItem.id || 0] || isParentMenuActive(menuItem)
              }"
              @mouseenter="handleCompactMenuMouseEnter(menuItem.id || 0)"
              @mouseleave="handleCompactMenuMouseLeave(menuItem.id || 0)"
              :ref="(el) => setMenuRef(el, menuItem.id || 0)"
            >
              <div
                class="text-fontsize14 text-customGray595 leading-line22 dark:text-graya6a6a6 flex flex-row gap-2.5 font-semibold"
              >
                <img
                  :src="menuItem.src"
                  :class="{
                    'text-purple-700': isOpen[menuItem.id || 0] || isParentMenuActive(menuItem)
                  }"
                  :alt="menuItem.name"
                />
              </div>
            </div>

            <!-- 플로팅 서브메뉴 -->
            <div class="relative">
              <div
                v-if="isOpen[menuItem.id || 0]"
                class="dark:bg-black141414 fixed z-[9999] flex min-w-[200px] flex-col rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700"
                :style="getMenuPosition(menuItem.id || 0)"
                @mouseenter="handleSubMenuMouseEnter(menuItem.id || 0)"
                @mouseleave="handleSubMenuMouseLeave(menuItem.id || 0)"
              >
                <!-- 서브메뉴 타이틀 -->
                <div class="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                  <div
                    class="text-fontsize14 text-customGray595 dark:text-graya6a6a6 font-semibold"
                  >
                    {{ menuItem.name }}
                  </div>
                </div>

                <!-- 서브메뉴 아이템들 -->
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
                      class="text-fontsize14 text-customGray595 leading-line22 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-black141414 dark:text-graya6a6a6 flex h-10 items-center px-4 transition-colors duration-200 hover:font-medium"
                    >
                      {{ child.name }}
                    </div>
                  </router-link>
                </template>
              </div>
            </div>
          </div>
        </template>

        <!-- 서브메뉴가 없는 단일 메뉴 -->
        <template v-else>
          <div class="flex flex-col">
            <!-- 단일 메뉴 아이콘 -->
            <router-link :to="menuItem.url || ''">
              <div
                :class="{ 'bg-purple-50': isActive(menuItem.url) }"
                class="flex flex-row items-center justify-between px-5 py-3.5 dark:text-[#3C89E8]"
                :title="menuItem.name"
                @mouseenter="handleCompactSingleMenuMouseEnter(menuItem.id || 0)"
                @mouseleave="handleCompactSingleMenuMouseLeave(menuItem.id || 0)"
                :ref="(el) => setMenuRef(el, menuItem.id || 0)"
              >
                <div
                  :class="{ 'text-purple-700': isActive(menuItem.url) }"
                  class="text-fontsize14 text-customGray595 leading-line22 dark:text-graya6a6a6 flex flex-row gap-2.5 font-semibold"
                >
                  <!-- 메뉴 아이콘 이미지 -->
                  <img :src="menuItem.src" :alt="menuItem.name" />
                </div>
              </div>
            </router-link>

            <!-- 서브메뉴가 없는 단일 메뉴의 타이틀 표시 (툴팁) -->
            <div class="relative">
              <div
                v-if="showSingleMenuTitle[menuItem.id || 0]"
                class="dark:bg-black141414 fixed z-[9999] flex min-w-[120px] flex-col rounded-lg border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-700"
                :style="getMenuPosition(menuItem.id || 0)"
                @mouseenter="handleSingleMenuTitleMouseEnter(menuItem.id || 0)"
                @mouseleave="handleSingleMenuTitleMouseLeave(menuItem.id || 0)"
              >
                <div class="px-4 py-2">
                  <div
                    class="text-fontsize14 text-customGray595 dark:text-graya6a6a6 font-semibold"
                  >
                    {{ menuItem.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuItem, ChildMenuItem } from '../type/left-menu.interface';

/**
 * 컴팩트 메뉴 컴포넌트 (Compact Menu Component)
 *
 * 좌측 메뉴가 축소된 상태에서 사용되는 컴포넌트입니다.
 * - 아이콘만 표시되어 공간을 절약합니다.
 * - 마우스 호버 시 플로팅 서브메뉴가 나타납니다.
 * - 호버 기반의 직관적인 메뉴 네비게이션을 제공합니다.
 * - 단일 메뉴의 경우 툴팁으로 메뉴명을 표시합니다.
 */

// Props 정의
defineProps<{
  visibleLeftMenus: MenuItem[];
}>();

const route = useRoute();

// 상태 관리
const isOpen = ref<Record<number, boolean>>({});
const menuRefs = ref<Record<number, HTMLElement>>({});
const subMenuTimers = ref<Record<number, ReturnType<typeof setTimeout>>>({});
const showSingleMenuTitle = ref<Record<number, boolean>>({});
const singleMenuTimers = ref<Record<number, ReturnType<typeof setTimeout>>>({});

/**
 * 현재 경로와 메뉴 URL 비교하여 활성 상태 확인
 * @param url - 메뉴 URL
 * @returns 활성 상태 여부
 */
const isActive = (url: string | undefined): boolean => {
  return route.path === url;
};

/**
 * 현재 선택된 메뉴의 최상단 메뉴인지 확인
 * 서브메뉴 중 하나가 활성화되어 있으면 부모 메뉴도 활성 상태로 표시
 * @param menuItem - 메뉴 아이템
 * @returns 부모 메뉴 활성 상태 여부
 */
const isParentMenuActive = (menuItem: MenuItem): boolean => {
  if (!menuItem.children) return false;
  return menuItem.children.some((child: ChildMenuItem) => isActive(child.url));
};

/**
 * 메뉴 엘리먼트 참조 설정
 * 플로팅 메뉴의 위치 계산을 위해 DOM 엘리먼트 참조를 저장
 * @param el - DOM 엘리먼트
 * @param menuId - 메뉴 ID
 */
const setMenuRef = (el: unknown, menuId: number): void => {
  const element = el as { $el?: HTMLElement } | HTMLElement | null;
  if (element && '$el' in element && element.$el) {
    menuRefs.value[menuId] = element.$el as HTMLElement;
  } else if (element) {
    menuRefs.value[menuId] = element as HTMLElement;
  }
};

/**
 * 플로팅 메뉴 위치 계산
 * 화면 경계를 고려하여 메뉴가 잘리지 않도록 위치를 조정
 * @param menuId - 메뉴 ID
 * @returns 위치 스타일 객체
 */
const getMenuPosition = (menuId: number): { top: string; left: string } => {
  const menuElement = menuRefs.value[menuId];
  if (!menuElement) {
    return { top: '0px', left: '70px' };
  }

  const rect = menuElement.getBoundingClientRect();
  const menuWidth = 60; // 컴팩트 메뉴 너비
  const leftPosition = menuWidth + 10; // 메뉴 오른쪽에 약간의 여백을 두고 표시

  // 화면 높이를 고려한 위치 조정
  const windowHeight = window.innerHeight;
  let topPosition = rect.top;

  // 메뉴가 화면 아래로 벗어나는 경우 위치 조정
  if (topPosition + 200 > windowHeight) {
    topPosition = windowHeight - 220;
  }

  return {
    top: `${Math.max(10, topPosition)}px`,
    left: `${leftPosition}px`
  };
};

/**
 * 컴팩트 메뉴 마우스 진입 이벤트
 * 서브메뉴가 있는 메뉴에 호버 시 플로팅 메뉴를 표시
 * @param menuId - 메뉴 ID
 */
const handleCompactMenuMouseEnter = (menuId: number): void => {
  // 기존 타이머 취소 (빠른 호버 전환 대응)
  if (subMenuTimers.value[menuId]) {
    clearTimeout(subMenuTimers.value[menuId]);
    delete subMenuTimers.value[menuId];
  }

  // 다른 메뉴 닫기 (한 번에 하나의 메뉴만 열리도록)
  Object.keys(isOpen.value).forEach((key) => {
    const id = parseInt(key);
    if (id !== menuId) {
      isOpen.value[id] = false;
    }
  });

  isOpen.value[menuId] = true;
};

/**
 * 컴팩트 메뉴 마우스 이탈 이벤트
 * 서브메뉴로 이동할 시간을 제공하기 위해 지연 후 메뉴 닫기
 * @param menuId - 메뉴 ID
 */
const handleCompactMenuMouseLeave = (menuId: number): void => {
  // 100ms 후에 메뉴 닫기 (서브메뉴로 이동할 시간 제공)
  subMenuTimers.value[menuId] = setTimeout(() => {
    isOpen.value[menuId] = false;
    delete subMenuTimers.value[menuId];
  }, 100);
};

/**
 * 서브 메뉴 마우스 진입 이벤트
 * 플로팅 서브메뉴에 마우스가 진입하면 닫기 타이머를 취소
 * @param menuId - 메뉴 ID
 */
const handleSubMenuMouseEnter = (menuId: number): void => {
  // 타이머 취소 (메뉴 유지)
  if (subMenuTimers.value[menuId]) {
    clearTimeout(subMenuTimers.value[menuId]);
    delete subMenuTimers.value[menuId];
  }
};

/**
 * 서브 메뉴 마우스 이탈 이벤트
 * 플로팅 서브메뉴에서 마우스가 나가면 즉시 메뉴 닫기
 * @param menuId - 메뉴 ID
 */
const handleSubMenuMouseLeave = (menuId: number): void => {
  // 즉시 메뉴 닫기
  isOpen.value[menuId] = false;
};

/**
 * 서브 메뉴 클릭 이벤트
 * 서브메뉴 아이템 클릭 시 플로팅 메뉴 닫기
 * @param menuId - 메뉴 ID
 */
const handleSubMenuClick = (menuId: number): void => {
  isOpen.value[menuId] = false;
};

/**
 * 컴팩트 단일 메뉴 마우스 진입 이벤트
 * 서브메뉴가 없는 단일 메뉴에 호버 시 툴팁 표시
 * @param menuId - 메뉴 ID
 */
const handleCompactSingleMenuMouseEnter = (menuId: number): void => {
  // 기존 타이머 취소
  if (singleMenuTimers.value[menuId]) {
    clearTimeout(singleMenuTimers.value[menuId]);
    delete singleMenuTimers.value[menuId];
  }

  // 다른 단일 메뉴 타이틀 닫기
  Object.keys(showSingleMenuTitle.value).forEach((key) => {
    const id = parseInt(key);
    if (id !== menuId) {
      showSingleMenuTitle.value[id] = false;
    }
  });

  showSingleMenuTitle.value[menuId] = true;
};

/**
 * 컴팩트 단일 메뉴 마우스 이탈 이벤트
 * 단일 메뉴에서 마우스가 나가면 지연 후 툴팁 숨기기
 * @param menuId - 메뉴 ID
 */
const handleCompactSingleMenuMouseLeave = (menuId: number): void => {
  // 100ms 후에 타이틀 숨기기
  singleMenuTimers.value[menuId] = setTimeout(() => {
    showSingleMenuTitle.value[menuId] = false;
    delete singleMenuTimers.value[menuId];
  }, 100);
};

/**
 * 단일 메뉴 타이틀 마우스 진입 이벤트
 * 툴팁에 마우스가 진입하면 숨기기 타이머를 취소
 * @param menuId - 메뉴 ID
 */
const handleSingleMenuTitleMouseEnter = (menuId: number): void => {
  // 타이머 취소 (타이틀 유지)
  if (singleMenuTimers.value[menuId]) {
    clearTimeout(singleMenuTimers.value[menuId]);
    delete singleMenuTimers.value[menuId];
  }
};

/**
 * 단일 메뉴 타이틀 마우스 이탈 이벤트
 * 툴팁에서 마우스가 나가면 즉시 툴팁 숨기기
 * @param menuId - 메뉴 ID
 */
const handleSingleMenuTitleMouseLeave = (menuId: number): void => {
  // 즉시 타이틀 숨기기
  showSingleMenuTitle.value[menuId] = false;
};

// 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
onUnmounted(() => {
  Object.values(subMenuTimers.value).forEach((timer) => {
    clearTimeout(timer);
  });
  Object.values(singleMenuTimers.value).forEach((timer) => {
    clearTimeout(timer);
  });
});

// 외부에서 메뉴 상태 제어를 위한 함수 노출
defineExpose({
  /**
   * 모든 메뉴와 툴팁을 닫는 함수
   * 메뉴 토글 시 상태 초기화를 위해 사용
   */
  closeAllMenus: () => {
    Object.keys(isOpen.value).forEach((key) => {
      isOpen.value[parseInt(key)] = false;
    });
    Object.keys(showSingleMenuTitle.value).forEach((key) => {
      showSingleMenuTitle.value[parseInt(key)] = false;
    });
  }
});
</script>

<style scoped lang="scss">
/* 호버 트랜지션 효과 - 부드러운 색상 변환 */
.transition-colors {
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}
</style>
