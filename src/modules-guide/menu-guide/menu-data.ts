/** 메뉴 쇼케이스 공유 데이터 */

export interface MenuItem {
  id: number;
  name: string;
  icon?: string;
  children?: { id: number; name: string }[];
}

export interface MenuSection {
  id: number;
  title: string;
  icon: string;
  menus: MenuItem[];
}

export const menuData: MenuSection[] = [
  { id: 1, title: '고객', icon: '👤', menus: [
    { id: 11, name: '고객 관리', icon: '📋', children: [
      { id: 111, name: '고객 목록' }, { id: 112, name: '고객 검색' }, { id: 113, name: '고객 히스토리' },
    ]},
  ]},
  { id: 2, title: '상담', icon: '💬', menus: [
    { id: 21, name: '상담 관리', icon: '📝', children: [
      { id: 211, name: '상담 등록' }, { id: 212, name: '알림톡/SMS' }, { id: 213, name: '상담 이력' },
    ]},
  ]},
  { id: 3, title: '업종기능', icon: '🏢', menus: [
    { id: 31, name: '필라테스', icon: '🧘', children: [
      { id: 311, name: '수업 관리' }, { id: 312, name: '멤버십 관리' }, { id: 313, name: '출석 체크' },
    ]},
    { id: 32, name: '부동산', icon: '🏠', children: [
      { id: 321, name: '매물 관리' }, { id: 322, name: '매칭 시스템' },
    ]},
  ]},
  { id: 4, title: '통신', icon: '📞', menus: [
    { id: 41, name: '전화', icon: '☎️', children: [
      { id: 411, name: '통화 이력' }, { id: 412, name: '녹취 청취' },
    ]},
  ]},
  { id: 5, title: '통계/분석', icon: '📊', menus: [
    { id: 51, name: 'KPI 모니터링', icon: '📈', children: [] },
    { id: 52, name: 'AI 리포트', icon: '🤖', children: [] },
  ]},
];

/** 전체 메뉴 플랫 목록 */
export const allMenus = menuData.flatMap(s => s.menus);

/** 검색용 플랫 아이템 */
export const allFlatItems = menuData.flatMap(s =>
  s.menus.flatMap(m =>
    m.children?.length
      ? m.children.map(c => ({ label: `${s.title} > ${m.name} > ${c.name}`, name: c.name }))
      : [{ label: `${s.title} > ${m.name}`, name: m.name }]
  )
);

/** 배열 토글 헬퍼 */
export function toggleArr(state: any, key: string, id: number) {
  if (state[key].includes(id)) {
    state[key] = state[key].filter((x: number) => x !== id);
  } else {
    state[key] = [...state[key], id];
  }
}

/** 패턴 메타 타입 */
export interface PatternMeta {
  n: string;
  pick?: boolean;
}
