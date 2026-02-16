import { defineStore } from 'pinia';
import type {
  Property,
  PropertyInsertDto,
  PropertyUpdateDto,
  PropertyPagingDto,
  PropertyMatching,
  MatchingPagingDto
} from '../type/realestate.type';

/** Mock 매물 데이터 (서울 각 구역) */
const MOCK_PROPERTIES: Property[] = [
  {
    propertySeq: 1,
    propertyName: '강남역 신축 오피스텔',
    propertyType: '오피스텔',
    transactionType: '매매',
    address: '서울시 강남구 역삼동 123-45',
    zipcode: '06234',
    area: 84,
    price: 52000,
    deposit: 0,
    monthlyRent: 0,
    floor: 12,
    totalFloor: 25,
    buildYear: 2023,
    description: '강남역 도보 5분, 풀옵션',
    status: '등록',
    ownerName: '김영수',
    ownerPhone: '010-1234-5678',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-15',
    updateSeq: 1,
    updateDate: '2025-02-01'
  },
  {
    propertySeq: 2,
    propertyName: '서초동 아파트 전세',
    propertyType: '아파트',
    transactionType: '전세',
    address: '서울시 서초구 서초동 456-78',
    zipcode: '06548',
    area: 102,
    price: 0,
    deposit: 80000,
    monthlyRent: 0,
    floor: 8,
    totalFloor: 20,
    buildYear: 2018,
    description: '남향 채광 우수',
    status: '계약중',
    ownerName: '이철민',
    ownerPhone: '010-2345-6789',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-20',
    updateSeq: 1,
    updateDate: '2025-01-25'
  },
  {
    propertySeq: 3,
    propertyName: '마포 합정동 빌라',
    propertyType: '빌라',
    transactionType: '월세',
    address: '서울시 마포구 합정동 789-12',
    zipcode: '04085',
    area: 65,
    price: 0,
    deposit: 5000,
    monthlyRent: 80,
    floor: 3,
    totalFloor: 5,
    buildYear: 2015,
    description: '역세권, 주차가능',
    status: '등록',
    ownerName: '박지훈',
    ownerPhone: '010-3456-7890',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-01',
    updateSeq: 1,
    updateDate: '2025-02-05'
  },
  {
    propertySeq: 4,
    propertyName: '송파 잠실 상가',
    propertyType: '상가',
    transactionType: '매매',
    address: '서울시 송파구 잠실동 234-56',
    zipcode: '05510',
    area: 120,
    price: 120000,
    deposit: 0,
    monthlyRent: 0,
    floor: 1,
    totalFloor: 10,
    buildYear: 2010,
    description: '1층 노출 우수',
    status: '계약완료',
    ownerName: '최민지',
    ownerPhone: '010-4567-8901',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-10',
    updateSeq: 1,
    updateDate: '2025-02-12'
  },
  {
    propertySeq: 5,
    propertyName: '강동 천호동 아파트',
    propertyType: '아파트',
    transactionType: '매매',
    address: '서울시 강동구 천호동 567-89',
    zipcode: '05363',
    area: 99,
    price: 68000,
    deposit: 0,
    monthlyRent: 0,
    floor: 15,
    totalFloor: 30,
    buildYear: 2020,
    description: '한강뷰, 풀옵션',
    status: '등록',
    ownerName: '정수현',
    ownerPhone: '010-5678-9012',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15',
    updateSeq: 1,
    updateDate: '2025-02-15'
  },
  {
    propertySeq: 6,
    propertyName: '영등포 여의도 오피스텔',
    propertyType: '오피스텔',
    transactionType: '월세',
    address: '서울시 영등포구 여의도동 321-54',
    zipcode: '07335',
    area: 45,
    price: 0,
    deposit: 3000,
    monthlyRent: 120,
    floor: 20,
    totalFloor: 35,
    buildYear: 2022,
    description: '여의도 한강공원 인접',
    status: '보류',
    ownerName: '한소희',
    ownerPhone: '010-6789-0123',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-05',
    updateSeq: 1,
    updateDate: '2025-02-14'
  },
  {
    propertySeq: 7,
    propertyName: '종로 삼청동 토지',
    propertyType: '토지',
    transactionType: '매매',
    address: '서울시 종로구 삼청동 111-22',
    zipcode: '03049',
    area: 330,
    price: 250000,
    deposit: 0,
    monthlyRent: 0,
    floor: 0,
    totalFloor: 0,
    buildYear: 0,
    description: '대지 100평, 건축가능',
    status: '등록',
    ownerName: '윤도현',
    ownerPhone: '010-7890-1234',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-08',
    updateSeq: 1,
    updateDate: '2025-02-10'
  },
  {
    propertySeq: 8,
    propertyName: '관악 신림동 빌라',
    propertyType: '빌라',
    transactionType: '전세',
    address: '서울시 관악구 신림동 654-32',
    zipcode: '08826',
    area: 72,
    price: 0,
    deposit: 35000,
    monthlyRent: 0,
    floor: 2,
    totalFloor: 4,
    buildYear: 2019,
    description: '신림역 7분, 풀옵션',
    status: '등록',
    ownerName: '강지원',
    ownerPhone: '010-8901-2345',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16',
    updateSeq: 1,
    updateDate: '2025-02-16'
  },
  {
    propertySeq: 9,
    propertyName: '강남 테헤란로 아파트',
    propertyType: '아파트',
    transactionType: '매매',
    address: '서울시 강남구 테헤란로 152',
    zipcode: '06236',
    area: 115,
    price: 185000,
    deposit: 0,
    monthlyRent: 0,
    floor: 18,
    totalFloor: 28,
    buildYear: 2021,
    description: '강남역 인접, 프리미엄',
    status: '계약중',
    ownerName: '송민호',
    ownerPhone: '010-9012-3456',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-12',
    updateSeq: 1,
    updateDate: '2025-02-10'
  },
  {
    propertySeq: 10,
    propertyName: '마포 상수동 오피스텔',
    propertyType: '오피스텔',
    transactionType: '월세',
    address: '서울시 마포구 상수동 88-12',
    zipcode: '04050',
    area: 38,
    price: 0,
    deposit: 2000,
    monthlyRent: 95,
    floor: 5,
    totalFloor: 12,
    buildYear: 2020,
    description: '홍대입구역 도보 3분',
    status: '등록',
    ownerName: '임서연',
    ownerPhone: '010-0123-4567',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-14',
    updateSeq: 1,
    updateDate: '2025-02-14'
  }
];

/** Mock 매칭 데이터 */
const MOCK_MATCHINGS: PropertyMatching[] = [
  {
    matchingSeq: 1,
    propertySeq: 1,
    propertyName: '강남역 신축 오피스텔',
    customerSeq: 2,
    customerName: '이철수',
    customerPhone: '010-2345-6789',
    matchScore: 92,
    matchReason: '강남권역 선호, 예산 적합',
    status: '상담예정',
    contactDate: '2025-02-20',
    memo: '주말 상담 예정',
    insertDate: '2025-02-15'
  },
  {
    matchingSeq: 2,
    propertySeq: 2,
    propertyName: '서초동 아파트 전세',
    customerSeq: 1,
    customerName: '김영희',
    customerPhone: '010-1234-5678',
    matchScore: 88,
    matchReason: '전세 선호, 면적 요구 충족',
    status: '추천',
    contactDate: '',
    memo: '',
    insertDate: '2025-02-14'
  },
  {
    matchingSeq: 3,
    propertySeq: 3,
    propertyName: '마포 합정동 빌라',
    customerSeq: 4,
    customerName: '최수영',
    customerPhone: '010-4567-8901',
    matchScore: 85,
    matchReason: '역세권 선호, 월세 예산 부합',
    status: '상담완료',
    contactDate: '2025-02-18',
    memo: '추가 검토 중',
    insertDate: '2025-02-12'
  },
  {
    matchingSeq: 4,
    propertySeq: 5,
    propertyName: '강동 천호동 아파트',
    customerSeq: 6,
    customerName: '한소희',
    customerPhone: '010-6789-0123',
    matchScore: 95,
    matchReason: '한강뷰 선호, 프리미엄 매물',
    status: '계약',
    contactDate: '2025-02-16',
    memo: '계약 진행 중',
    insertDate: '2025-02-10'
  },
  {
    matchingSeq: 5,
    propertySeq: 6,
    propertyName: '영등포 여의도 오피스텔',
    customerSeq: 7,
    customerName: '윤도현',
    customerPhone: '010-7890-1234',
    matchScore: 78,
    matchReason: '여의도 근무, 출퇴근 편리',
    status: '추천',
    contactDate: '',
    memo: '',
    insertDate: '2025-02-13'
  },
  {
    matchingSeq: 6,
    propertySeq: 8,
    propertyName: '관악 신림동 빌라',
    customerSeq: 8,
    customerName: '강지원',
    customerPhone: '010-8901-2345',
    matchScore: 82,
    matchReason: '신림권역, 전세 예산 적합',
    status: '상담예정',
    contactDate: '2025-02-22',
    memo: '연락 대기',
    insertDate: '2025-02-11'
  },
  {
    matchingSeq: 7,
    propertySeq: 9,
    propertyName: '강남 테헤란로 아파트',
    customerSeq: 1,
    customerName: '김영희',
    customerPhone: '010-1234-5678',
    matchScore: 90,
    matchReason: '강남 프리미엄 매물, 투자 목적',
    status: '추천',
    contactDate: '',
    memo: '',
    insertDate: '2025-02-16'
  },
  {
    matchingSeq: 8,
    propertySeq: 10,
    propertyName: '마포 상수동 오피스텔',
    customerSeq: 3,
    customerName: '박지민',
    customerPhone: '010-3456-7890',
    matchScore: 86,
    matchReason: '홍대 인근, 젊은 층 선호',
    status: '상담완료',
    contactDate: '2025-02-17',
    memo: '다른 매물 비교 중',
    insertDate: '2025-02-09'
  }
];

/**
 * 부동산 스토어 - Mock 데이터 기반
 */
export const useRealestateStore = defineStore('realestate', {
  state: () => ({
    /** 매물 전체 데이터 (Mock 소스) */
    propertyListFull: [...MOCK_PROPERTIES] as Property[],
    /** 매물 목록 (페이징 결과) */
    propertyListData: [] as Property[],
    /** 매물 총 건수 */
    propertyTotalRow: 0,
    /** 매물 상세 */
    propertyDetailData: {} as Property,

    /** 매칭 전체 데이터 (Mock 소스) */
    matchingListFull: [...MOCK_MATCHINGS] as PropertyMatching[],
    /** 매칭 목록 (페이징 결과) */
    matchingListData: [] as PropertyMatching[],
    /** 매칭 총 건수 */
    matchingTotalRow: 0,
    /** 매칭 상세 */
    matchingDetailData: {} as PropertyMatching
  }),

  actions: {
    /** 매물 페이징 목록 조회 */
    async propertyPaging(params: PropertyPagingDto): Promise<void> {
      let filtered = this.propertyListFull.filter((p) => p.isDelete === 'N');

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.address.toLowerCase().includes(kw) ||
            p.ownerName.toLowerCase().includes(kw) ||
            p.propertyName.toLowerCase().includes(kw)
        );
      }
      if (params.propertyType) {
        filtered = filtered.filter((p) => p.propertyType === params.propertyType);
      }
      if (params.transactionType) {
        filtered = filtered.filter((p) => p.transactionType === params.transactionType);
      }
      if (params.status) {
        filtered = filtered.filter((p) => p.status === params.status);
      }

      const sortBy = params.sortBy || 'insertDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: Property, b: Property) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (sortType === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });

      this.propertyTotalRow = filtered.length;
      const row = Number(params.row) || 10;
      const page = Number(params.page) || 1;
      const start = (page - 1) * row;
      this.propertyListData = filtered.slice(start, start + row);
    },

    /** 매물 상세 조회 */
    async propertyDetail(propertySeq: number): Promise<Property> {
      const found = this.propertyListFull.find((p) => p.propertySeq === propertySeq);
      if (found) {
        this.propertyDetailData = { ...found };
      }
      return this.propertyDetailData;
    },

    /** 매물 상세 초기화 */
    propertyDetailDataInit(): void {
      this.propertyDetailData = {} as Property;
    },

    /** 매물 등록 */
    async propertyInsert(params: PropertyInsertDto): Promise<Property> {
      const newSeq = Math.max(...this.propertyListFull.map((p) => p.propertySeq), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem: Property = {
        propertySeq: newSeq,
        ...params,
        status: '등록',
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: now,
        updateSeq: 1,
        updateDate: now
      };
      this.propertyListFull.unshift(newItem);
      return newItem;
    },

    /** 매물 수정 */
    async propertyUpdate(params: PropertyUpdateDto): Promise<void> {
      const idx = this.propertyListFull.findIndex((p) => p.propertySeq === params.propertySeq);
      if (idx !== -1) {
        const { propertySeq, status, ...rest } = params;
        this.propertyListFull[idx] = {
          ...this.propertyListFull[idx],
          ...rest,
          status,
          updateSeq: 1,
          updateDate: new Date().toISOString().split('T')[0]
        };
        this.propertyDetailData = { ...this.propertyListFull[idx] };
      }
    },

    /** 매물 논리 삭제 */
    async propertySoftDelete(propertySeq: number): Promise<void> {
      const idx = this.propertyListFull.findIndex((p) => p.propertySeq === propertySeq);
      if (idx !== -1) {
        this.propertyListFull[idx].isDelete = 'Y';
      }
    },

    /** 매칭 페이징 목록 조회 */
    async matchingPaging(params: MatchingPagingDto): Promise<void> {
      let filtered = [...this.matchingListFull];

      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.customerName.toLowerCase().includes(kw) ||
            m.propertyName.toLowerCase().includes(kw)
        );
      }
      if (params.status) {
        filtered = filtered.filter((m) => m.status === params.status);
      }

      const sortBy = params.sortBy || 'insertDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: PropertyMatching, b: PropertyMatching) => {
        const aVal = (a as Record<string, unknown>)[sortBy];
        const bVal = (b as Record<string, unknown>)[sortBy];
        if (sortType === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });

      this.matchingTotalRow = filtered.length;
      const row = Number(params.row) || 10;
      const page = Number(params.page) || 1;
      const start = (page - 1) * row;
      this.matchingListData = filtered.slice(start, start + row);
    },

    /** 매칭 상세 조회 */
    async matchingDetail(matchingSeq: number): Promise<PropertyMatching> {
      const found = this.matchingListFull.find((m) => m.matchingSeq === matchingSeq);
      if (found) {
        this.matchingDetailData = { ...found };
      }
      return this.matchingDetailData;
    },

    /** 매칭 상세 초기화 */
    matchingDetailDataInit(): void {
      this.matchingDetailData = {} as PropertyMatching;
    },

    /** 매칭 등록 */
    async matchingInsert(params: Omit<PropertyMatching, 'matchingSeq' | 'insertDate'>): Promise<PropertyMatching> {
      const newSeq = Math.max(...this.matchingListFull.map((m) => m.matchingSeq), 0) + 1;
      const now = new Date().toISOString().split('T')[0];
      const newItem: PropertyMatching = {
        ...params,
        matchingSeq: newSeq,
        insertDate: now
      };
      this.matchingListFull.push(newItem);
      return newItem;
    },

    /** 매칭 수정 */
    async matchingUpdate(params: Partial<PropertyMatching> & { matchingSeq: number }): Promise<void> {
      const idx = this.matchingListFull.findIndex((m) => m.matchingSeq === params.matchingSeq);
      if (idx !== -1) {
        this.matchingListFull[idx] = { ...this.matchingListFull[idx], ...params };
        this.matchingDetailData = { ...this.matchingListFull[idx] };
      }
    }
  }
});
