// 좌측 메뉴 인터페이스 정의

/** 섹션 (최상위 그룹) - 캡처처럼 "회원", "콘텐츠" 등의 섹션 타이틀 */
export interface MenuSection {
  id: number;
  sectionTitle: string; // 섹션 타이틀 (예: "고객", "상담", "업종기능")
  menus: MenuItem[];    // 해당 섹션의 메뉴 목록
}

/** 메뉴 아이템 (2depth - 아코디언 또는 단일 링크) */
export interface MenuItem {
  id: number;
  name: string;
  url: string;           // 비어있으면 아코디언 (자식 있음)
  icon: string;          // tabler icon 이름
  hideInProd: boolean;
  children?: ChildMenuItem[]; // 3depth 하위 메뉴
}

/** 하위 메뉴 아이템 (3depth - 링크) */
export interface ChildMenuItem {
  id: number;
  name: string;
  url: string;
  hideInProd: boolean;
}

/** 좌측 메뉴 상태 */
export interface LeftMenuState {
  menuSections: MenuSection[];
}

/** 상단 메뉴 활성 상태 */
export interface TopMenuState {
  activeMenu: number | null; // 현재 열린 드롭다운 섹션 ID
  activeSubmenu: number | null; // 현재 열린 3차 서브메뉴의 2차 메뉴 ID
}

/** 모바일 메뉴 상태 */
export interface MobileMenuState {
  isOpen: boolean; // 슬라이드오버 열림 상태
  expandedMenus: number[]; // 펼쳐진 2차 메뉴 ID 배열
}
