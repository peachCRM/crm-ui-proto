// 좌측 메뉴 인터페이스 정의

/** 섹션 (최상위 그룹) - 1차 depth */
export interface MenuSection {
  id: number;
  sectionTitle: string; // 섹션 타이틀 (예: "고객", "마케팅")
  icon: string;         // 섹션 아이콘 이름 (예: 'IconUsers', 'IconSpeakerphone')
  iconBg: string;       // iOS 스타일 아이콘 배경색 (예: '#5B8DEF')
  menus: MenuItem[];    // 2차 메뉴 목록
}

/** 메뉴 아이템 (2차 depth) */
export interface MenuItem {
  id: number;
  name: string;
  url: string;           // 비어있으면 섹션 헤더 역할
  icon: string;          // tabler icon 이름 (컴팩트 모드용)
  hideInProd: boolean;
  children: ChildMenuItem[]; // 3차 하위 메뉴
}

/** 하위 메뉴 아이템 (3차 depth) */
export interface ChildMenuItem {
  id: number;
  name: string;
  url: string;
  hideInProd: boolean;
}

/** 좌측 메뉴 상태 */
export interface LeftMenuState {
  menuSections: MenuSection[];
  activeSectionId: number; // 현재 활성 섹션 ID
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
