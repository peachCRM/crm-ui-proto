import { defineStore } from 'pinia';
import type { LeftMenuState, MenuItem } from '../type/left-menu.interface';

import sideHometaxScraping from '../assets/side_hometax_scraping.svg?url';

/**
 * UI Proto 좌측 메뉴 스토어
 * 쇼핑몰 + test-data 관련 메뉴 포함
 */
export const useLeftMenuStore = defineStore('leftMenu', {
  state: (): LeftMenuState => ({
    leftMenus: [
      {
        id: 1,
        name: '쇼핑몰',
        icon: 'shopping-cart',
        src: sideHometaxScraping,
        url: '',
        hideInProd: false,
        parentNumber: 0,
        children: [
          {
            id: 1,
            parentNumber: 1,
            name: '상품관리',
            url: '/shop/product/list',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 2,
            parentNumber: 1,
            name: '주문관리',
            url: '/shop/order/list',
            icon: 'circle',
            hideInProd: false
          }
        ]
      },
      {
        id: 2,
        name: 'NGO',
        icon: 'heart',
        src: sideHometaxScraping,
        url: '',
        hideInProd: false,
        parentNumber: 0,
        children: [
          {
            id: 1,
            parentNumber: 2,
            name: '배너',
            url: '/ngo/banner/list',
            icon: 'circle',
            hideInProd: false
          }
        ]
      },
      {
        id: 3,
        name: 'UI 가이드',
        icon: 'user',
        src: sideHometaxScraping,
        url: '',
        hideInProd: false,
        parentNumber: 0,
        children: [
          {
            id: 1,
            parentNumber: 2,
            name: '가이드',
            url: '/test/guide',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 2,
            parentNumber: 2,
            name: 'CRUD 기본',
            url: '/test/crud/list',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 3,
            parentNumber: 2,
            name: 'CRUD 2depth',
            url: '/test/two-depth/list',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 4,
            parentNumber: 2,
            name: 'CRUD 엑셀',
            url: '/test/crud-excel/list',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 5,
            parentNumber: 2,
            name: 'DEMO select-list',
            url: '/test/select-list/demo',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 6,
            parentNumber: 2,
            name: '더보기 리스트',
            url: '/test/show-more-list/list',
            icon: 'circle',
            hideInProd: false
          },
          {
            id: 7,
            parentNumber: 2,
            name: '무한 스크롤 리스트',
            url: '/test/infinite-scroll-list/list',
            icon: 'circle',
            hideInProd: false
          }
        ]
      }
    ]
  }),
  getters: {
    visibleLeftMenus(): MenuItem[] {
      // UI Proto에서는 모든 메뉴 표시
      return this.leftMenus;
    }
  }
});
