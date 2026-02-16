import { defineStore } from 'pinia';
import type { Customer, CustomerInsertDto, CustomerUpdateDto } from '../type/customer.type';

/**
 * 고객관리 스토어 - Mock 데이터 기반
 */
export const useCustomerStore = defineStore('customer', {
  state: () => ({
    /** 고객 목록 */
    listData: [
      { customerSeq: 1, customerName: '김영희', phone: '010-1234-5678', email: 'kim@email.com', gender: 'F', birthDate: '1990-03-15', address: '서울시 강남구 역삼동 123-45', zipcode: '06234', memo: 'VIP 고객, 필라테스 프리미엄 멤버십', customerGrade: 'A', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-15', updateSeq: 1, updateDate: '2025-02-01' },
      { customerSeq: 2, customerName: '이철수', phone: '010-2345-6789', email: 'lee@email.com', gender: 'M', birthDate: '1985-07-22', address: '서울시 서초구 서초동 456-78', zipcode: '06548', memo: '부동산 관심 고객', customerGrade: 'B', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-20', updateSeq: 1, updateDate: '2025-01-25' },
      { customerSeq: 3, customerName: '박지민', phone: '010-3456-7890', email: 'park@email.com', gender: 'F', birthDate: '1992-11-08', address: '서울시 송파구 잠실동 789-12', zipcode: '05510', memo: '필라테스 초급반 수강 중', customerGrade: 'C', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-01', updateSeq: 1, updateDate: '2025-02-05' },
      { customerSeq: 4, customerName: '최수영', phone: '010-4567-8901', email: 'choi@email.com', gender: 'F', birthDate: '1988-05-30', address: '서울시 마포구 합정동 234-56', zipcode: '04085', memo: '3개월 멤버십 만료 예정', customerGrade: 'B', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-10', updateSeq: 1, updateDate: '2025-02-12' },
      { customerSeq: 5, customerName: '정민우', phone: '010-5678-9012', email: 'jung@email.com', gender: 'M', birthDate: '1995-09-18', address: '서울시 영등포구 여의도동 567-89', zipcode: '07335', memo: '상담 예정', customerGrade: 'D', customerStatus: 'I', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-15', updateSeq: 1, updateDate: '2025-02-15' },
      { customerSeq: 6, customerName: '한소희', phone: '010-6789-0123', email: 'han@email.com', gender: 'F', birthDate: '1993-01-25', address: '서울시 강동구 천호동 321-54', zipcode: '05363', memo: '프리미엄 회원 전환 상담 완료', customerGrade: 'A', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-01-05', updateSeq: 1, updateDate: '2025-02-14' },
      { customerSeq: 7, customerName: '윤도현', phone: '010-7890-1234', email: 'yoon@email.com', gender: 'M', birthDate: '1980-12-03', address: '서울시 종로구 삼청동 111-22', zipcode: '03049', memo: '부동산 매물 조회 이력', customerGrade: 'C', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-08', updateSeq: 1, updateDate: '2025-02-10' },
      { customerSeq: 8, customerName: '강지원', phone: '010-8901-2345', email: 'kang@email.com', gender: 'F', birthDate: '1997-06-14', address: '서울시 관악구 신림동 654-32', zipcode: '08826', memo: '신규 가입 환영 쿠폰 발송', customerGrade: 'D', customerStatus: 'A', isUse: 'Y', isDelete: 'N', insertSeq: 1, insertDate: '2025-02-16', updateSeq: 1, updateDate: '2025-02-16' }
    ] as Customer[],
    /** 총 건수 */
    listTotalRow: 8,
    /** 상세 데이터 */
    detailData: {} as Customer
  }),

  actions: {
    /** 검색 파라미터 초기화 */
    listParamsInit() {
      return {
        keyword: '',
        customerGrade: '',
        customerStatus: '',
        startDate: '',
        endDate: '',
        sortBy: 'insertDate',
        sortType: 'desc',
        sortData: 'insertDate,desc',
        row: 10,
        page: 1,
        time: '',
        selected: ''
      };
    },

    /** 페이징 목록 조회 */
    async paging(params: Record<string, any>) {
      let filtered = [...this.listData].filter(c => c.isDelete === 'N');

      // 키워드 검색
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filtered = filtered.filter(c =>
          c.customerName.toLowerCase().includes(keyword) ||
          c.phone.includes(keyword) ||
          c.email.toLowerCase().includes(keyword)
        );
      }

      // 등급 필터
      if (params.customerGrade) {
        filtered = filtered.filter(c => c.customerGrade === params.customerGrade);
      }

      // 상태 필터
      if (params.customerStatus) {
        filtered = filtered.filter(c => c.customerStatus === params.customerStatus);
      }

      // 정렬
      const sortBy = params.sortBy || 'insertDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortType === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });

      this.listTotalRow = filtered.length;

      // 페이징
      const row = Number(params.row) || 10;
      const page = Number(params.page) || 1;
      const start = (page - 1) * row;
      this.listData = filtered.slice(start, start + row);
    },

    /** 상세 조회 */
    async detail(customerSeq: number) {
      const found = this.listData.find(c => c.customerSeq === customerSeq);
      if (found) {
        this.detailData = { ...found };
      }
      return this.detailData;
    },

    /** 상세 데이터 초기화 */
    detailDataInit() {
      this.detailData = {} as Customer;
    },

    /** 등록 */
    async insert(data: CustomerInsertDto) {
      const newSeq = Math.max(...this.listData.map(c => c.customerSeq), 0) + 1;
      const newCustomer: Customer = {
        customerSeq: newSeq,
        ...data,
        customerStatus: 'A',
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: new Date().toISOString().split('T')[0],
        updateSeq: 1,
        updateDate: new Date().toISOString().split('T')[0]
      };
      this.listData.unshift(newCustomer);
      this.listTotalRow = this.listData.length;
      return newCustomer;
    },

    /** 수정 */
    async update(data: CustomerUpdateDto) {
      const index = this.listData.findIndex(c => c.customerSeq === data.customerSeq);
      if (index !== -1) {
        this.listData[index] = {
          ...this.listData[index],
          ...data,
          updateDate: new Date().toISOString().split('T')[0]
        };
        this.detailData = { ...this.listData[index] };
      }
      return true;
    },

    /** 사용여부 변경 */
    async updateUse(customerSeq: number) {
      const index = this.listData.findIndex(c => c.customerSeq === customerSeq);
      if (index !== -1) {
        this.listData[index].isUse = this.listData[index].isUse === 'Y' ? 'N' : 'Y';
      }
      return true;
    },

    /** 논리 삭제 */
    async softDelete(customerSeq: number) {
      const index = this.listData.findIndex(c => c.customerSeq === customerSeq);
      if (index !== -1) {
        this.listData[index].isDelete = 'Y';
      }
      return true;
    }
  }
});
