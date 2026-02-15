<template>
  <!-- S : SIDE 좌측 메뉴 컨테이너 -->
  <div class="shadow-custom0010 dark:bg-black141414 fixed top-[0] bottom-0 left-0 z-20 bg-white">
    <PerfectScrollbar class="">
      <div class="relative h-screen pt-20">
        <!-- 상세 메뉴 (확장된 상태) - 전체 메뉴 정보가 표시되는 상태 -->
        <DetailedMenu
          v-if="!isMenuHidden"
          :visible-left-menus="visibleLeftMenus"
          ref="detailedMenuRef"
        />
        <!-- 컴팩트 메뉴 (축소된 상태) - 아이콘만 표시되는 상태 -->
        <CompactMenu
          v-if="isMenuHidden"
          :visible-left-menus="visibleLeftMenus"
          ref="compactMenuRef"
        />

        <!-- 메뉴 토글 버튼 (접기/펼치기) -->
        <div
          :class="[
            'border-customGrayE4 dark:border-gray424242 dark:bg-black141414 fixed top-1/2 z-999 flex h-[74px] w-[20px] -translate-y-1/2 transform cursor-pointer flex-row items-center justify-center rounded-r border-r bg-white p-1',
            isMenuHidden ? 'left-[60px]' : 'left-[186px]'
          ]"
          style="box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1)"
          @click="toggleMenuVisibility"
        >
          <img
            src="../assets/slide_arrow.svg"
            :class="{ 'rotate-180': isMenuHidden }"
            class="transition-transform duration-200"
            alt="메뉴 접기"
          />
        </div>
      </div>
    </PerfectScrollbar>
  </div>
  <!-- E : SIDE -->
</template>

<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';

import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLeftMenuStore } from '../store/left-menu.store';

// 분리된 컴포넌트 import
import DetailedMenu from './detailed-menu.vue';
import CompactMenu from './compact-menu.vue';

const leftMenuStore = useLeftMenuStore();
const { visibleLeftMenus } = storeToRefs(leftMenuStore);

// Emits 정의
const emit = defineEmits<{
  'menu-toggle': [isHidden: boolean];
}>();

// 컴포넌트 참조
const detailedMenuRef = ref<InstanceType<typeof DetailedMenu>>();
const compactMenuRef = ref<InstanceType<typeof CompactMenu>>();

// 메뉴 상태 관리
const isMenuHidden = ref<boolean>(false);

// 로컬 스토리지 키
const MENU_HIDDEN_STORAGE_KEY = 'leftMenuHidden';

/**
 * 로컬 스토리지에서 메뉴 상태 로드
 * 사용자의 이전 메뉴 상태 설정을 복원
 */
const loadMenuStateFromStorage = (): void => {
  const stored = localStorage.getItem(MENU_HIDDEN_STORAGE_KEY);
  if (stored !== null) {
    isMenuHidden.value = JSON.parse(stored);
  } else {
    isMenuHidden.value = false; // 기본값: 오픈된 형태
  }
};

/**
 * 로컬 스토리지에 메뉴 상태 저장
 * 사용자의 메뉴 상태 설정을 유지
 */
const saveMenuStateToStorage = (): void => {
  localStorage.setItem(MENU_HIDDEN_STORAGE_KEY, JSON.stringify(isMenuHidden.value));
};

/**
 * 메뉴 토글 (접기/펼치기)
 * 메뉴 상태를 변경하고 관련 이벤트를 처리
 */
const toggleMenuVisibility = (): void => {
  isMenuHidden.value = !isMenuHidden.value;
  saveMenuStateToStorage();
  emit('menu-toggle', isMenuHidden.value);

  // 컴팩트 메뉴로 변경시 열린 서브메뉴 닫기
  if (isMenuHidden.value) {
    detailedMenuRef.value?.closeAllMenus();
  } else {
    compactMenuRef.value?.closeAllMenus();
  }
};

/**
 * 컴포넌트 초기화
 * 페이지 로드 시 메뉴 상태를 복원하고 초기 설정을 진행
 */
const initializeMenu = (): void => {
  loadMenuStateFromStorage();
  emit('menu-toggle', isMenuHidden.value);
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  initializeMenu();
});
</script>

<style scoped lang="scss">
/* 메뉴 토글 버튼 스타일 */
.z-999 {
  z-index: 999;
}

/* 토글 버튼 호버 효과 */
.cursor-pointer:hover {
  opacity: 0.8;
}

/* 메뉴 컨테이너 그림자 효과 */
.shadow-custom0010 {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
