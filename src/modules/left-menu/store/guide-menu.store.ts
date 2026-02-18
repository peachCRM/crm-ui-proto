import { defineStore } from 'pinia';
import type { LeftMenuState, MenuSection } from '../type/left-menu.interface';

/**
 * 가이드 영역 전용 메뉴 스토어
 * 섹션(Section) → 메뉴(Menu) → 하위메뉴(Child) 3단계 구조
 * left-menu.store.ts와 동일한 인터페이스 사용
 */
export const useGuideMenuStore = defineStore('guideMenu', {
  state: (): LeftMenuState => ({
    activeSectionId: 100,
    menuSections: [
      // ── UI 예시 섹션 ──
      {
        id: 100,
        sectionTitle: 'UI 예시',
        icon: 'IconBookOpen',
        iconBg: '#5B8DEF',
        menus: [
          {
            id: 101,
            name: 'UI 가이드',
            url: '',
            icon: 'IconBookOpen',
            hideInProd: false,
            children: [
              { id: 1011, name: '가이드', url: '/guide/pattern/guide', hideInProd: false },
              { id: 1012, name: 'CRUD 기본', url: '/guide/pattern/crud/list', hideInProd: false },
              { id: 1013, name: 'CRUD 2depth', url: '/guide/pattern/two-depth/list', hideInProd: false },
              { id: 1014, name: 'CRUD 엑셀', url: '/guide/pattern/crud-excel/list', hideInProd: false },
              { id: 1015, name: 'DEMO select-list', url: '/guide/pattern/select-list/demo', hideInProd: false },
              { id: 1016, name: '더보기 리스트', url: '/guide/pattern/show-more-list/list', hideInProd: false },
              { id: 1017, name: '무한 스크롤 리스트', url: '/guide/pattern/infinite-scroll-list/list', hideInProd: false }
            ]
          },
          {
            id: 102,
            name: '메뉴 가이드',
            url: '',
            icon: 'IconMenu',
            hideInProd: false,
            children: [
              { id: 1021, name: '메뉴 예시', url: '/guide/pattern/menu-guide', hideInProd: false }
            ]
          }
        ]
      },
      // ── 도메인 예시 섹션 ──
      {
        id: 200,
        sectionTitle: '도메인 예시',
        icon: 'IconShoppingCart',
        iconBg: '#FF9500',
        menus: [
          {
            id: 201,
            name: '쇼핑몰',
            url: '',
            icon: 'IconShoppingCart',
            hideInProd: false,
            children: [
              { id: 2011, name: '상품 관리', url: '/guide/domain/product/list', hideInProd: false },
              { id: 2012, name: '주문 관리', url: '/guide/domain/order/list', hideInProd: false }
            ]
          },
          {
            id: 202,
            name: '배너',
            url: '',
            icon: 'IconHeart',
            hideInProd: false,
            children: [
              { id: 2021, name: 'NGO 배너', url: '/guide/domain/ngo-banner/list', hideInProd: false }
            ]
          }
        ]
      }
    ]
  }),
  getters: {
    /** 표시할 메뉴 섹션 목록 */
    visibleSections(): MenuSection[] {
      return this.menuSections;
    }
  },
  actions: {
    /** 현재 경로에 해당하는 활성 섹션 ID 반환 */
    getActiveSectionId(path: string): number | null {
      for (const section of this.menuSections) {
        for (const menu of section.menus) {
          if (menu.url && path.startsWith(menu.url)) return section.id;
          if (menu.children?.some(child => path.startsWith(child.url))) return section.id;
        }
      }
      return null;
    },
    /** 개별 메뉴/하위메뉴 URL 활성 여부 확인 */
    isActiveItem(path: string, url: string): boolean {
      if (!url) return false;
      return path === url || path.startsWith(url + '/');
    },
    /** 활성 자식이 있는 메뉴 ID 목록 반환 (자동 펼침용) */
    getExpandedMenuIds(path: string): number[] {
      const ids: number[] = [];
      for (const section of this.menuSections) {
        for (const menu of section.menus) {
          if (menu.children?.some(child => path.startsWith(child.url))) {
            ids.push(menu.id);
          }
        }
      }
      return ids;
    }
  }
});
