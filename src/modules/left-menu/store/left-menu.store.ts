import { defineStore } from 'pinia';
import type { LeftMenuState, MenuSection } from '../type/left-menu.interface';

/**
 * 좌측 메뉴 스토어 - CRM Type 2 PRD 기반
 * 섹션(Section) → 메뉴(Menu) → 하위메뉴(Child) 3단계 구조
 */
export const useLeftMenuStore = defineStore('leftMenu', {
  state: (): LeftMenuState => ({
    menuSections: [
      // ── 고객 섹션 ──
      {
        id: 1,
        sectionTitle: '고객',
        menus: [
          {
            id: 11,
            name: '고객 관리',
            url: '',
            icon: 'IconUsers',
            hideInProd: false,
            children: [
              { id: 111, name: '고객 목록', url: '/customer/list', hideInProd: false },
              { id: 112, name: '고객 검색', url: '/customer/search', hideInProd: false },
              { id: 113, name: '고객 히스토리', url: '/customer/history', hideInProd: false }
            ]
          }
        ]
      },
      // ── 상담 섹션 ──
      {
        id: 2,
        sectionTitle: '상담',
        menus: [
          {
            id: 21,
            name: '상담 관리',
            url: '',
            icon: 'IconMessageCircle',
            hideInProd: false,
            children: [
              { id: 211, name: '상담 등록', url: '/consultation/register', hideInProd: false },
              { id: 212, name: '알림톡/SMS', url: '/consultation/message', hideInProd: false },
              { id: 213, name: '상담 이력', url: '/consultation/history', hideInProd: false }
            ]
          }
        ]
      },
      // ── 업종기능 섹션 ──
      {
        id: 3,
        sectionTitle: '업종기능',
        menus: [
          {
            id: 31,
            name: '필라테스',
            url: '',
            icon: 'IconStretching',
            hideInProd: false,
            children: [
              { id: 311, name: '수업 관리', url: '/industry/pilates/class', hideInProd: false },
              { id: 312, name: '멤버십 관리', url: '/industry/pilates/membership', hideInProd: false },
              { id: 313, name: '출석 체크', url: '/industry/pilates/attendance', hideInProd: false }
            ]
          },
          {
            id: 32,
            name: '부동산',
            url: '',
            icon: 'IconBuilding',
            hideInProd: false,
            children: [
              { id: 321, name: '매물 관리', url: '/industry/realestate/property', hideInProd: false },
              { id: 322, name: '매칭 시스템', url: '/industry/realestate/matching', hideInProd: false }
            ]
          }
        ]
      },
      // ── 통신 섹션 ──
      {
        id: 4,
        sectionTitle: '통신',
        menus: [
          {
            id: 41,
            name: '전화',
            url: '',
            icon: 'IconPhone',
            hideInProd: false,
            children: [
              { id: 411, name: '통화 이력', url: '/communication/history', hideInProd: false },
              { id: 412, name: '녹취 청취', url: '/communication/record', hideInProd: false }
            ]
          }
        ]
      },
      // ── 분석 섹션 ──
      {
        id: 5,
        sectionTitle: '통계/분석',
        menus: [
          {
            id: 51,
            name: 'KPI 모니터링',
            url: '/analytics/kpi',
            icon: 'IconChartBar',
            hideInProd: false
          },
          {
            id: 52,
            name: 'AI 리포트',
            url: '/analytics/ai-report',
            icon: 'IconSparkles',
            hideInProd: false
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
