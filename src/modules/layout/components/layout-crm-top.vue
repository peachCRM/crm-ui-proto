<template>
  <!-- CRM 워크스페이스 상단 3-depth 드롭다운 메뉴 (데스크톱 lg 이상) -->
  <div class="hidden lg:flex items-center justify-between h-full px-6">
    <!-- 좌측: 브랜드 + 스페이스 정보 -->
    <div class="flex items-center gap-3 shrink-0">
      <router-link to="/" class="flex items-center gap-2.5">
        <!-- 피치 로고 -->
        <div
          class="flex items-center justify-center w-[34px] h-[34px] rounded-custom10 text-[15px] leading-none bg-[#287dff]"
        >🍑</div>
        <div class="flex flex-col">
          <h1 class="text-sm font-bold text-[#1e293b] dark:text-white leading-tight">피치CRM</h1>
          <span class="text-[10px] text-[#94a3b8] font-medium leading-tight">Business Platform</span>
        </div>
      </router-link>

      <!-- 스페이스 배지: 커스텀 pill 스타일 -->
      <div class="flex items-center gap-1.5 px-3 py-1 rounded-md bg-customblue-50 border border-[#dbeafe] dark:bg-blue-950/30 dark:border-blue-800">
        <span class="text-[10px] font-bold text-[#3b82f6] dark:text-blue-400">{{ spaceTypeLabel }}</span>
        <span class="text-xs font-semibold text-customblue-700 dark:text-blue-300">{{ currentSpaceName }}</span>
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
            'relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-all duration-200 border-none outline-none cursor-pointer',
            activeMenu === section.id || menuStore.getActiveSectionId(route.path) === section.id
              ? 'text-[#287dff] font-semibold dark:text-blue-400'
              : 'text-[#64748b] dark:text-gray-300 hover:text-[#287dff] dark:hover:text-white'
          ]"
        >
          <!-- 섹션 아이콘 -->
          <UIcon
            :name="sectionIconMap[section.icon] || 'i-tabler-circle'"
            class="w-4 h-4"
          />
          {{ section.sectionTitle }}
          <UIcon
            name="i-lucide-chevron-down"
            :class="[
              'w-3 h-3 opacity-50 transition-transform duration-300',
              activeMenu === section.id ? 'rotate-180' : ''
            ]"
          />
          <!-- 활성/호버 섹션 하단 인디케이터 라인 -->
          <span
            :class="[
              'absolute -bottom-px left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-200 bg-[#287dff]',
              menuStore.getActiveSectionId(route.path) === section.id
                ? 'w-[18px] opacity-100'
                : activeMenu === section.id
                  ? 'w-3 opacity-40'
                  : 'w-0 opacity-0'
            ]"
          />
        </button>

        <!-- 2차: 드롭다운 패널 -->
        <div
          :class="[
            'absolute top-[calc(100%+4px)] left-0 transition-all duration-200 z-50',
            activeMenu === section.id
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-[0.96] pointer-events-none'
          ]"
        >
          <!-- 마우스 갭 방지용 투명 브리지 -->
          <div class="absolute -top-1 left-0 right-0 h-2" />
          <div
            class="min-w-[220px] bg-white dark:bg-gray-900 rounded-xl overflow-visible py-1.5"
            style="box-shadow: 0 4px 16px -2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)"
          >
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
                    'flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-all duration-150',
                    activeSubmenu === menu.id
                      ? 'text-[#287dff] bg-customblue-50 dark:text-blue-400 dark:bg-blue-950/30 font-medium'
                      : hasActiveChild(menu)
                        ? 'text-[#287dff] dark:text-blue-400 font-medium'
                        : 'text-[#475569] dark:text-gray-300 hover:text-[#287dff] dark:hover:text-white hover:bg-customblue-50 dark:hover:bg-gray-800'
                  ]"
                >
                  <!-- L2 메뉴 아이콘 박스 -->
                  <span
                    class="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0 transition-all duration-150"
                    :class="activeSubmenu === menu.id || hasActiveChild(menu)
                      ? 'bg-[#dbeafe] text-[#287dff]'
                      : 'bg-[#f8fafc] text-[#94a3b8]'"
                  >
                    <UIcon :name="menuIconMap[menu.icon] || 'i-tabler-circle'" class="w-[15px] h-[15px]" />
                  </span>
                  <span class="flex-1">{{ menu.name }}</span>
                  <svg
                    width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"
                    :style="{
                      opacity: activeSubmenu === menu.id ? 0.8 : 0.3,
                      transform: activeSubmenu === menu.id ? 'translateX(2px)' : 'translateX(0)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }"
                  ><path d="m9 18 6-6-6-6" /></svg>
                </div>

                <!-- 3차: 서브메뉴 플로팅 패널 -->
                <div
                  :class="[
                    'absolute left-full top-[-6px] pl-1 transition-all duration-150 z-50',
                    activeSubmenu === menu.id
                      ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
                      : 'opacity-0 -translate-x-2 scale-[0.96] pointer-events-none'
                  ]"
                >
                  <div
                    class="min-w-[190px] bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
                    style="box-shadow: 0 4px 16px -2px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)"
                  >
                    <!-- 3차 섹션 헤더 -->
                    <div class="px-4 py-2 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.06em] border-b border-[#f1f5f9] dark:border-gray-700 mb-1">
                      {{ menu.name }}
                    </div>
                    <router-link
                      v-for="child in menu.children"
                      :key="child.id"
                      :to="child.url"
                      custom
                      v-slot="{ navigate, isActive }"
                    >
                      <a
                        :class="[
                          'flex items-center gap-2.5 px-4 py-2 text-sm transition-all duration-150 cursor-pointer',
                          isActive || menuStore.isActiveItem(route.path, child.url)
                            ? 'text-[#287dff] dark:text-blue-400 bg-customblue-50 dark:bg-blue-950/30 font-medium'
                            : 'text-[#475569] dark:text-gray-300 hover:text-[#287dff] dark:hover:text-white hover:bg-customblue-50 dark:hover:bg-gray-800'
                        ]"
                        @click="checkAndNavigate(child.url, child.name, navigate)"
                      >
                        <span
                          :class="[
                            'w-[5px] h-[5px] rounded-full shrink-0 transition-all duration-200',
                            isActive || menuStore.isActiveItem(route.path, child.url)
                              ? 'bg-[#287dff] scale-[1.3]'
                              : 'bg-[#cbd5e1]'
                          ]"
                        />
                        <span class="flex-1">{{ child.name }}</span>
                        <svg
                          v-if="isActive || menuStore.isActiveItem(route.path, child.url)"
                          width="12" height="12" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round"
                          class="opacity-60 shrink-0"
                        ><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </a>
                    </router-link>
                  </div>
                </div>
              </template>

              <!-- children이 없는 단일 링크 메뉴 -->
              <template v-else>
                <router-link
                  :to="menu.url || '/'"
                  custom
                  v-slot="{ navigate, isActive }"
                >
                  <a
                    :class="[
                      'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-150 cursor-pointer',
                      isActive || menuStore.isActiveItem(route.path, menu.url)
                        ? 'text-[#287dff] dark:text-blue-400 bg-customblue-50 dark:bg-blue-950/30 font-medium'
                        : 'text-[#475569] dark:text-gray-300 hover:text-[#287dff] dark:hover:text-white hover:bg-customblue-50 dark:hover:bg-gray-800'
                    ]"
                    @click="checkAndNavigate(menu.url || '/', menu.name, navigate)"
                  >
                    <!-- L2 단일 메뉴 아이콘 박스 -->
                    <span
                      class="w-[30px] h-[30px] rounded-lg flex items-center justify-center shrink-0 transition-all duration-150"
                      :class="isActive || menuStore.isActiveItem(route.path, menu.url)
                        ? 'bg-[#dbeafe] text-[#287dff]'
                        : 'bg-[#f8fafc] text-[#94a3b8]'"
                    >
                      <UIcon :name="menuIconMap[menu.icon] || 'i-tabler-circle'" class="w-[15px] h-[15px]" />
                    </span>
                    <span class="flex-1">{{ menu.name }}</span>
                  </a>
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 우측: 유틸리티 -->
    <div class="flex items-center gap-2.5 shrink-0">
      <router-link
        to="/space"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] text-xs transition-all duration-200',
          'hover:text-[#287dff] hover:border-[#bfdbfe] hover:bg-customblue-50',
          'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800'
        ]"
      >
        <UIcon name="i-lucide-layout-grid" class="w-3.5 h-3.5" />
        <span>스페이스 전환</span>
      </router-link>
      <!-- 사용자 아바타 -->
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer shrink-0 bg-[#f59e0b]"
      >L</div>
    </div>
  </div>

  <!-- 준비중 모달 -->
  <UModal v-model:open="isComingSoonOpen" title="알림">
    <template #body>
      <div class="flex flex-col items-center justify-center py-8">
        <div class="i-heroicons-information-circle text-primary mb-4 h-12 w-12"></div>
        <p class="text-lg font-medium">
          <strong>{{ comingSoonMenuName }}</strong> 기능은 현재 준비중입니다.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <UButton color="primary" @click="isComingSoonOpen = false">확인</UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLeftMenuStore } from '@/modules/left-menu/store/left-menu.store';
import type { MenuItem } from '@/modules/left-menu/type/left-menu.interface';

defineProps<{
  currentSpaceName: string;
  spaceTypeLabel: string;
  spaceTypeBadgeColor: string;
}>();

const route = useRoute();
const router = useRouter();
const menuStore = useLeftMenuStore();

// Tabler 컴포넌트명 → i-tabler-* 포맷 매핑 (섹션 아이콘)
const sectionIconMap: Record<string, string> = {
  IconUsers: 'i-tabler-users',
  IconSpeakerphone: 'i-tabler-speakerphone',
  IconChartBar: 'i-tabler-chart-bar',
  IconSettings: 'i-tabler-settings',
  IconStretching: 'i-tabler-stretching-2',
  IconBuilding: 'i-tabler-building',
  IconBookOpen: 'i-tabler-book',
  IconShoppingCart: 'i-tabler-shopping-cart',
  IconMenu: 'i-tabler-menu-2',
  IconList: 'i-tabler-list'
};

// Tabler 컴포넌트명 → i-tabler-* 포맷 매핑 (2차 메뉴 아이콘)
const menuIconMap: Record<string, string> = {
  IconUsers: 'i-tabler-users',
  IconMessageCircle: 'i-tabler-message-circle',
  IconPhone: 'i-tabler-phone',
  IconTag: 'i-tabler-tag',
  IconBrandKakao: 'i-tabler-brand-kakao',
  IconDeviceMobile: 'i-tabler-device-mobile',
  IconMail: 'i-tabler-mail',
  IconTarget: 'i-tabler-target',
  IconRobot: 'i-tabler-robot',
  IconGauge: 'i-tabler-gauge',
  IconSparkles: 'i-tabler-sparkles',
  IconUsersGroup: 'i-tabler-users-group',
  IconChartPie: 'i-tabler-chart-pie',
  IconBuildingStore: 'i-tabler-building-store',
  IconUserCog: 'i-tabler-user-cog',
  IconPlug: 'i-tabler-plug',
  IconCurrencyWon: 'i-tabler-currency-won',
  IconShield: 'i-tabler-shield',
  IconCalendar: 'i-tabler-calendar',
  IconId: 'i-tabler-id',
  IconClipboardCheck: 'i-tabler-clipboard-check',
  IconHome: 'i-tabler-home',
  IconArrowsExchange: 'i-tabler-arrows-exchange',
  IconFileContract: 'i-tabler-file-invoice',
  IconChartLine: 'i-tabler-chart-line'
};

// 준비중 모달 상태
const isComingSoonOpen = ref(false);
const comingSoonMenuName = ref('');

// 드롭다운 상태
const activeMenu = ref<number | null>(null);
const activeSubmenu = ref<number | null>(null);
let sectionTimeout: ReturnType<typeof setTimeout> | null = null;
let menuTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * 라우트 구현 여부 확인 후 네비게이션 처리
 * 미구현 시 준비중 모달 표시
 */
const checkAndNavigate = (url: string, menuName: string, navigateFn: () => void): void => {
  if (!url) return;
  const resolved = router.resolve(url);
  const lastMatched = resolved.matched[resolved.matched.length - 1];
  if (!lastMatched || lastMatched.path.includes(':pathMatch') || !lastMatched.components?.default) {
    comingSoonMenuName.value = menuName;
    isComingSoonOpen.value = true;
    closeAll();
    return;
  }
  navigateFn();
  closeAll();
};

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
