import { defineStore } from 'pinia';
import type { LeftMenuState, MenuSection } from '../type/left-menu.interface';

// 필라테스 업종 섹션 (MVP - 3개 2차 메뉴)
const pilatesSection: MenuSection = {
  id: 10,
  sectionTitle: '필라테스',
  icon: 'IconStretching',
  iconBg: '#34C759',
  menus: [
    {
      id: 101,
      name: '수업 관리',
      url: '',
      icon: 'IconCalendar',
      hideInProd: false,
      children: [
        { id: 1011, name: '수업 목록', url: '/industry/pilates/class', hideInProd: false },
        { id: 1012, name: '수업 스케줄', url: '/industry/pilates/schedule', hideInProd: false },
        { id: 1013, name: '강사 관리', url: '/industry/pilates/instructor', hideInProd: false },
        { id: 1014, name: '수업 예약', url: '/industry/pilates/booking', hideInProd: false }
      ]
    },
    {
      id: 102,
      name: '멤버십',
      url: '',
      icon: 'IconId',
      hideInProd: false,
      children: [
        { id: 1021, name: '멤버십 목록', url: '/industry/pilates/membership', hideInProd: false },
        { id: 1022, name: '멤버십 등록', url: '/industry/pilates/membership/insert', hideInProd: false },
        { id: 1023, name: '만료 관리', url: '/industry/pilates/membership/expiry', hideInProd: false }
      ]
    },
    {
      id: 103,
      name: '출석',
      url: '',
      icon: 'IconClipboardCheck',
      hideInProd: false,
      children: [
        { id: 1031, name: '출석 체크', url: '/industry/pilates/attendance', hideInProd: false },
        { id: 1032, name: '출석 이력', url: '/industry/pilates/attendance/history', hideInProd: false },
        { id: 1033, name: '출석 통계', url: '/industry/pilates/attendance/stats', hideInProd: false }
      ]
    }
  ]
};

// 부동산 업종 섹션 (MVP - 4개 2차 메뉴)
const realEstateSection: MenuSection = {
  id: 20,
  sectionTitle: '부동산',
  icon: 'IconBuilding',
  iconBg: '#5AC8FA',
  menus: [
    {
      id: 201,
      name: '매물 관리',
      url: '',
      icon: 'IconHome',
      hideInProd: false,
      children: [
        { id: 2011, name: '매물 목록', url: '/industry/realestate/property', hideInProd: false },
        { id: 2012, name: '매물 등록', url: '/industry/realestate/property/insert', hideInProd: false },
        { id: 2013, name: '매물 수정', url: '/industry/realestate/property/update', hideInProd: false }
      ]
    },
    {
      id: 202,
      name: '매칭',
      url: '',
      icon: 'IconArrowsExchange',
      hideInProd: false,
      children: [
        { id: 2021, name: '고객-매물 매칭', url: '/industry/realestate/matching', hideInProd: false },
        { id: 2022, name: '매칭 이력', url: '/industry/realestate/matching/history', hideInProd: false }
      ]
    },
    {
      id: 203,
      name: '계약',
      url: '',
      icon: 'IconFileContract',
      hideInProd: false,
      children: [
        { id: 2031, name: '계약 목록', url: '/industry/realestate/contract', hideInProd: false },
        { id: 2032, name: '계약 등록', url: '/industry/realestate/contract/insert', hideInProd: false },
        { id: 2033, name: '계약 추적', url: '/industry/realestate/contract/track', hideInProd: false }
      ]
    },
    {
      id: 204,
      name: '시세 정보',
      url: '',
      icon: 'IconChartLine',
      hideInProd: false,
      children: [
        { id: 2041, name: '시세 조회', url: '/industry/realestate/price', hideInProd: false },
        { id: 2042, name: '거래 통계', url: '/industry/realestate/price/stats', hideInProd: false }
      ]
    }
  ]
};

// 기본 4섹션 정의 (PRD Part 2 기준)
const defaultSections: MenuSection[] = [
  // ── 고객 섹션 (4개 2차 메뉴) ──
  {
    id: 1,
    sectionTitle: '고객',
    icon: 'IconUsers',
    iconBg: '#5B8DEF',
    menus: [
      {
        id: 11,
        name: '고객 관리',
        url: '',
        icon: 'IconUsers',
        hideInProd: false,
        children: [
          { id: 111, name: '고객 목록', url: '/customer/list', hideInProd: false },
          { id: 112, name: '고객 등록', url: '/customer/insert', hideInProd: false },
          { id: 113, name: '고객 검색', url: '/customer/search', hideInProd: false },
          { id: 114, name: '고객 히스토리', url: '/customer/history', hideInProd: false }
        ]
      },
      {
        id: 12,
        name: '상담 관리',
        url: '',
        icon: 'IconMessageCircle',
        hideInProd: false,
        children: [
          { id: 121, name: '상담 등록', url: '/consultation/register', hideInProd: false },
          { id: 122, name: '상담 이력', url: '/consultation/history', hideInProd: false },
          { id: 123, name: '상태 추적', url: '/consultation/status', hideInProd: false },
          { id: 124, name: '예약 관리', url: '/consultation/reservation', hideInProd: false }
        ]
      },
      {
        id: 13,
        name: '고객 연락처',
        url: '',
        icon: 'IconPhone',
        hideInProd: false,
        children: [
          { id: 131, name: '전화 이력', url: '/communication/history', hideInProd: false },
          { id: 132, name: '녹취 청취', url: '/communication/record', hideInProd: false },
          { id: 133, name: '문자 발송', url: '/communication/sms', hideInProd: false },
          { id: 134, name: '이메일 발송', url: '/communication/email', hideInProd: false }
        ]
      },
      {
        id: 14,
        name: '태그·분류',
        url: '',
        icon: 'IconTag',
        hideInProd: false,
        children: [
          { id: 141, name: '태그 관리', url: '/customer/tag', hideInProd: false },
          { id: 142, name: '고객 분류', url: '/customer/category', hideInProd: false },
          { id: 143, name: '세그먼트', url: '/customer/segment', hideInProd: false }
        ]
      }
    ]
  },
  // ── 마케팅 섹션 (5개 2차 메뉴) ──
  {
    id: 2,
    sectionTitle: '마케팅',
    icon: 'IconSpeakerphone',
    iconBg: '#FF9500',
    menus: [
      {
        id: 21,
        name: '알림톡',
        url: '',
        icon: 'IconBrandKakao',
        hideInProd: false,
        children: [
          { id: 211, name: '알림톡 발송', url: '/marketing/kakao/send', hideInProd: false },
          { id: 212, name: '발송 이력', url: '/marketing/kakao/history', hideInProd: false },
          { id: 213, name: '템플릿 관리', url: '/marketing/kakao/template', hideInProd: false },
          { id: 214, name: '수신 거부', url: '/marketing/kakao/unsubscribe', hideInProd: false }
        ]
      },
      {
        id: 22,
        name: 'SMS/LMS',
        url: '',
        icon: 'IconDeviceMobile',
        hideInProd: false,
        children: [
          { id: 221, name: 'SMS 발송', url: '/marketing/sms/send', hideInProd: false },
          { id: 222, name: 'LMS 발송', url: '/marketing/lms/send', hideInProd: false },
          { id: 223, name: '발송 이력', url: '/marketing/sms/history', hideInProd: false }
        ]
      },
      {
        id: 23,
        name: '이메일',
        url: '',
        icon: 'IconMail',
        hideInProd: false,
        children: [
          { id: 231, name: '이메일 발송', url: '/marketing/email/send', hideInProd: false },
          { id: 232, name: '발송 이력', url: '/marketing/email/history', hideInProd: false },
          { id: 233, name: '템플릿 관리', url: '/marketing/email/template', hideInProd: false }
        ]
      },
      {
        id: 24,
        name: '캠페인',
        url: '',
        icon: 'IconTarget',
        hideInProd: false,
        children: [
          { id: 241, name: '캠페인 목록', url: '/marketing/campaign/list', hideInProd: false },
          { id: 242, name: '캠페인 등록', url: '/marketing/campaign/insert', hideInProd: false },
          { id: 243, name: '캠페인 결과', url: '/marketing/campaign/result', hideInProd: false }
        ]
      },
      {
        id: 25,
        name: '자동 발송',
        url: '',
        icon: 'IconRobot',
        hideInProd: false,
        children: [
          { id: 251, name: '예약 발송 설정', url: '/marketing/automation/schedule', hideInProd: false },
          { id: 252, name: '트리거 규칙', url: '/marketing/automation/trigger', hideInProd: false },
          { id: 253, name: '자동화 이력', url: '/marketing/automation/history', hideInProd: false }
        ]
      }
    ]
  },
  // ── 분석 섹션 (5개 2차 메뉴) ──
  {
    id: 3,
    sectionTitle: '분석',
    icon: 'IconChartBar',
    iconBg: '#AF52DE',
    menus: [
      {
        id: 31,
        name: '대시보드',
        url: '',
        icon: 'IconGauge',
        hideInProd: false,
        children: [
          { id: 311, name: 'KPI 대시보드', url: '/analytics/dashboard/kpi', hideInProd: false },
          { id: 312, name: '실시간 현황', url: '/analytics/dashboard/realtime', hideInProd: false },
          { id: 313, name: '목표 관리', url: '/analytics/dashboard/goal', hideInProd: false }
        ]
      },
      {
        id: 32,
        name: 'AI 리포트',
        url: '',
        icon: 'IconSparkles',
        hideInProd: false,
        children: [
          { id: 321, name: '상담 요약', url: '/analytics/ai-report/summary', hideInProd: false },
          { id: 322, name: '감정 분석', url: '/analytics/ai-report/sentiment', hideInProd: false },
          { id: 323, name: '키워드 추출', url: '/analytics/ai-report/keyword', hideInProd: false },
          { id: 324, name: '인사이트', url: '/analytics/ai-report/insight', hideInProd: false }
        ]
      },
      {
        id: 33,
        name: '고객 분석',
        url: '',
        icon: 'IconUsersGroup',
        hideInProd: false,
        children: [
          { id: 331, name: '고객 통계', url: '/analytics/customer/stats', hideInProd: false },
          { id: 332, name: '이탈 예측', url: '/analytics/customer/churn', hideInProd: false },
          { id: 333, name: '고객 세그먼트 분석', url: '/analytics/customer/segment', hideInProd: false }
        ]
      },
      {
        id: 34,
        name: '상담 통계',
        url: '',
        icon: 'IconChartPie',
        hideInProd: false,
        children: [
          { id: 341, name: '상담 통계', url: '/analytics/consultation/stats', hideInProd: false },
          { id: 342, name: '담당자별 성과', url: '/analytics/consultation/user', hideInProd: false },
          { id: 343, name: '팀 성과', url: '/analytics/consultation/team', hideInProd: false }
        ]
      },
      {
        id: 35,
        name: '통화 분석',
        url: '',
        icon: 'IconPhone',
        hideInProd: false,
        children: [
          { id: 351, name: '통화 통계', url: '/analytics/call/stats', hideInProd: false },
          { id: 352, name: '녹취 분석(STT)', url: '/analytics/call/stt', hideInProd: false },
          { id: 353, name: '통화 품질', url: '/analytics/call/quality', hideInProd: false }
        ]
      }
    ]
  },
  // ── 설정 섹션 (5개 2차 메뉴) ──
  {
    id: 4,
    sectionTitle: '설정',
    icon: 'IconSettings',
    iconBg: '#8E8E93',
    menus: [
      {
        id: 41,
        name: '스페이스',
        url: '',
        icon: 'IconBuildingStore',
        hideInProd: false,
        children: [
          { id: 411, name: '스페이스 정보', url: '/setting/space/info', hideInProd: false },
          { id: 412, name: '업종 설정', url: '/setting/space/industry', hideInProd: false },
          { id: 413, name: '플랜 관리', url: '/setting/space/plan', hideInProd: false }
        ]
      },
      {
        id: 42,
        name: '사용자 관리',
        url: '',
        icon: 'IconUserCog',
        hideInProd: false,
        children: [
          { id: 421, name: '사용자 목록', url: '/setting/user/list', hideInProd: false },
          { id: 422, name: '권한 설정', url: '/setting/user/permission', hideInProd: false },
          { id: 423, name: '초대 관리', url: '/setting/user/invite', hideInProd: false }
        ]
      },
      {
        id: 43,
        name: '외부 연동',
        url: '',
        icon: 'IconPlug',
        hideInProd: false,
        children: [
          { id: 431, name: '카카오 비즈', url: '/setting/integration/kakao', hideInProd: false },
          { id: 432, name: '통신사 CTI', url: '/setting/integration/cti', hideInProd: false },
          { id: 433, name: '비플 API', url: '/setting/integration/biple', hideInProd: false },
          { id: 434, name: 'AI 연동', url: '/setting/integration/ai', hideInProd: false }
        ]
      },
      {
        id: 44,
        name: '과금·통계',
        url: '',
        icon: 'IconCurrencyWon',
        hideInProd: false,
        children: [
          { id: 441, name: '사용량 통계', url: '/setting/billing/usage', hideInProd: false },
          { id: 442, name: '과금 현황', url: '/setting/billing/status', hideInProd: false },
          { id: 443, name: '플랜 변경', url: '/setting/billing/plan', hideInProd: false }
        ]
      },
      {
        id: 45,
        name: '보안',
        url: '',
        icon: 'IconShield',
        hideInProd: false,
        children: [
          { id: 451, name: '접근 로그', url: '/setting/security/log', hideInProd: false },
          { id: 452, name: '2FA 설정', url: '/setting/security/2fa', hideInProd: false }
        ]
      }
    ]
  }
];

/**
 * 좌측 메뉴 스토어 - 4섹션 구조
 * 고객 / 마케팅 / 분석 / 설정 + 업종 섹션 동적 삽입
 */
export const useLeftMenuStore = defineStore('leftMenu', {
  state: (): LeftMenuState => ({
    menuSections: [...defaultSections],
    activeSectionId: 1
  }),
  getters: {
    /** 표시할 메뉴 섹션 목록 */
    visibleSections(): MenuSection[] {
      return this.menuSections;
    }
  },
  actions: {
    /**
     * 업종 타입에 따라 메뉴에 업종 섹션 삽입
     * 고객 섹션(id:1) 뒤에 해당 업종 섹션을 삽입
     */
    setMenuBySpaceType(spaceType: 'pilates' | 'realestate' | 'default'): void {
      // 기존 업종 섹션 제거 (id 10, 20)
      const filtered = defaultSections.filter(s => s.id !== 10 && s.id !== 20);

      if (spaceType === 'pilates') {
        // 고객 섹션(인덱스 0) 뒤에 필라테스 삽입
        this.menuSections = [filtered[0], pilatesSection, ...filtered.slice(1)];
      } else if (spaceType === 'realestate') {
        // 고객 섹션(인덱스 0) 뒤에 부동산 삽입
        this.menuSections = [filtered[0], realEstateSection, ...filtered.slice(1)];
      } else {
        this.menuSections = [...filtered];
      }
    },

    /** 현재 경로에 해당하는 활성 섹션 ID 반환 */
    getActiveSectionId(path: string): number | null {
      for (const section of this.menuSections) {
        for (const menu of section.menus) {
          if (menu.url && path.startsWith(menu.url)) return section.id;
          if (menu.children.some(child => path.startsWith(child.url))) return section.id;
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
          if (menu.children.some(child => path.startsWith(child.url))) {
            ids.push(menu.id);
          }
        }
      }
      return ids;
    }
  }
});
