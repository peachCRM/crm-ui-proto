import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import type {
  Consultation,
  ConsultationInsertDto,
  ConsultationUpdateDto,
  ConsultationPagingDto,
  ConsultationMessage,
  MessagePagingDto
} from '../type/consultation.type';

/** Mock 상담 목록 (전체 데이터 - 필터/페이징용) */
const MOCK_CONSULTATION_LIST: Consultation[] = [
  {
    consultationSeq: 1,
    customerSeq: 1,
    customerName: '김영희',
    consultationType: '전화',
    title: '필라테스 멤버십 문의',
    content: '3개월 프리미엄 멤버십 가격 및 일정 문의',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-02-10 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-10 09:00',
    updateSeq: 1,
    updateDate: '2025-02-10 15:30'
  },
  {
    consultationSeq: 2,
    customerSeq: 2,
    customerName: '이철수',
    consultationType: '방문',
    title: '부동산 매물 상담',
    content: '강남구 아파트 매매 상담 예약',
    status: '진행',
    counselorName: '김부동',
    reservationDate: '2025-02-12 10:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-11 11:00',
    updateSeq: 1,
    updateDate: '2025-02-12 09:00'
  },
  {
    consultationSeq: 3,
    customerSeq: 3,
    customerName: '박지민',
    consultationType: '온라인',
    title: '수업 일정 변경 요청',
    content: '다음 주 화요일 수업을 수요일로 변경 요청',
    status: '대기',
    counselorName: '이필라',
    reservationDate: '2025-02-14 16:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-12 14:20',
    updateSeq: 1,
    updateDate: '2025-02-12 14:20'
  },
  {
    consultationSeq: 4,
    customerSeq: 4,
    customerName: '최수영',
    consultationType: '전화',
    title: '멤버십 갱신 상담',
    content: '3개월 멤버십 만료 예정, 연장 옵션 문의',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-02-08 11:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-07 10:00',
    updateSeq: 1,
    updateDate: '2025-02-08 12:00'
  },
  {
    consultationSeq: 5,
    customerSeq: 5,
    customerName: '정민우',
    consultationType: '방문',
    title: '신규 상담 예약',
    content: '필라테스 체험 수업 및 상담 예약',
    status: '취소',
    counselorName: '이필라',
    reservationDate: '2025-02-15 15:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-13 09:00',
    updateSeq: 1,
    updateDate: '2025-02-14 10:00'
  },
  {
    consultationSeq: 6,
    customerSeq: 6,
    customerName: '한소희',
    consultationType: '온라인',
    title: '프리미엄 전환 상담 완료',
    content: '프리미엄 회원 전환 상담 완료, 결제 진행',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-02-14 10:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-13 16:00',
    updateSeq: 1,
    updateDate: '2025-02-14 11:00'
  },
  {
    consultationSeq: 7,
    customerSeq: 7,
    customerName: '윤도현',
    consultationType: '전화',
    title: '부동산 매물 조회',
    content: '강남구 역삼동 매물 가격대 문의',
    status: '진행',
    counselorName: '김부동',
    reservationDate: '2025-02-16 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15 11:30',
    updateSeq: 1,
    updateDate: '2025-02-15 11:30'
  },
  {
    consultationSeq: 8,
    customerSeq: 8,
    customerName: '강지원',
    consultationType: '방문',
    title: '신규 회원 상담',
    content: '필라테스 신규 회원 가입 상담',
    status: '대기',
    counselorName: '이필라',
    reservationDate: '2025-02-17 09:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 14:00',
    updateSeq: 1,
    updateDate: '2025-02-16 14:00'
  },
  {
    consultationSeq: 9,
    customerSeq: 1,
    customerName: '김영희',
    consultationType: '온라인',
    title: '추가 수업 문의',
    content: '주 2회 추가 수업 가능 여부',
    status: '완료',
    counselorName: '이필라',
    reservationDate: '2025-02-05 11:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-04 16:00',
    updateSeq: 1,
    updateDate: '2025-02-05 12:00'
  },
  {
    consultationSeq: 10,
    customerSeq: 2,
    customerName: '이철수',
    consultationType: '전화',
    title: '매물 상세 문의',
    content: '강남구 역삼동 매물 상세 정보 요청',
    status: '완료',
    counselorName: '김부동',
    reservationDate: '2025-02-03 15:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-02 10:00',
    updateSeq: 1,
    updateDate: '2025-02-03 16:00'
  },
  {
    consultationSeq: 11,
    customerSeq: 3,
    customerName: '박지민',
    consultationType: '방문',
    title: '첫 수업 후기',
    content: '첫 필라테스 수업 후 피드백 및 다음 수업 예약',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-01-28 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-27 09:00',
    updateSeq: 1,
    updateDate: '2025-01-28 15:00'
  },
  {
    consultationSeq: 12,
    customerSeq: 4,
    customerName: '최수영',
    consultationType: '전화',
    title: '멤버십 혜택 문의',
    content: '프리미엄 멤버십 혜택 상세 안내',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-01-25 10:30',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-24 14:00',
    updateSeq: 1,
    updateDate: '2025-01-25 11:00'
  },
  {
    consultationSeq: 13,
    customerSeq: 6,
    customerName: '한소희',
    consultationType: '온라인',
    title: '결제 방법 문의',
    content: '카드 할부 및 자동이체 문의',
    status: '완료',
    counselorName: '이필라',
    reservationDate: '2025-01-22 16:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-21 11:00',
    updateSeq: 1,
    updateDate: '2025-01-22 16:30'
  },
  {
    consultationSeq: 14,
    customerSeq: 7,
    customerName: '윤도현',
    consultationType: '방문',
    title: '부동산 계약 상담',
    content: '매매 계약 절차 및 필요 서류 안내',
    status: '진행',
    counselorName: '김부동',
    reservationDate: '2025-02-18 11:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15 15:00',
    updateSeq: 1,
    updateDate: '2025-02-15 15:00'
  },
  {
    consultationSeq: 15,
    customerSeq: 8,
    customerName: '강지원',
    consultationType: '전화',
    title: '체험 수업 예약',
    content: '무료 체험 수업 예약 요청',
    status: '대기',
    counselorName: '이필라',
    reservationDate: '2025-02-19 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 16:00',
    updateSeq: 1,
    updateDate: '2025-02-16 16:00'
  },
  {
    consultationSeq: 16,
    customerSeq: 1,
    customerName: '김영희',
    consultationType: '전화',
    title: '수업 변경 요청',
    content: '2월 15일 수업을 16일로 변경 요청',
    status: '완료',
    counselorName: '박상담',
    reservationDate: '2025-02-01 09:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-31 18:00',
    updateSeq: 1,
    updateDate: '2025-02-01 10:00'
  },
  {
    consultationSeq: 17,
    customerSeq: 2,
    customerName: '이철수',
    consultationType: '온라인',
    title: '매물 알림 설정',
    content: '원하는 조건 매물 알림 설정 요청',
    status: '완료',
    counselorName: '김부동',
    reservationDate: '2025-01-30 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-29 11:00',
    updateSeq: 1,
    updateDate: '2025-01-30 15:00'
  },
  {
    consultationSeq: 18,
    customerSeq: 3,
    customerName: '박지민',
    consultationType: '방문',
    title: '개인 레슨 문의',
    content: '1:1 개인 레슨 비용 및 일정 문의',
    status: '대기',
    counselorName: '이필라',
    reservationDate: '2025-02-20 10:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 12:00',
    updateSeq: 1,
    updateDate: '2025-02-16 12:00'
  },
  {
    consultationSeq: 19,
    customerSeq: 5,
    customerName: '정민우',
    consultationType: '전화',
    title: '상담 재예약',
    content: '취소된 상담 재예약 요청',
    status: '진행',
    counselorName: '박상담',
    reservationDate: '2025-02-17 14:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-14 15:00',
    updateSeq: 1,
    updateDate: '2025-02-15 09:00'
  },
  {
    consultationSeq: 20,
    customerSeq: 4,
    customerName: '최수영',
    consultationType: '온라인',
    title: '온라인 수업 문의',
    content: '화상 필라테스 수업 가능 여부',
    status: '완료',
    counselorName: '이필라',
    reservationDate: '2025-01-20 16:00',
    isUse: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-01-19 10:00',
    updateSeq: 1,
    updateDate: '2025-01-20 17:00'
  }
];

/** Mock 메시지 목록 */
const MOCK_MESSAGE_LIST: ConsultationMessage[] = [
  {
    messageSeq: 1,
    customerSeq: 1,
    customerName: '김영희',
    messageType: '알림톡',
    templateName: '상담 예약 확인',
    content: '김영희 고객님, 2월 10일 14시 상담 예약이 확인되었습니다.',
    sendStatus: '발송',
    sendDate: '2025-02-10 09:05',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-10 09:00'
  },
  {
    messageSeq: 2,
    customerSeq: 2,
    customerName: '이철수',
    messageType: 'SMS',
    templateName: '부동산 상담 안내',
    content: '이철수 고객님, 부동산 상담 일정이 2월 12일 10시로 확정되었습니다.',
    sendStatus: '발송',
    sendDate: '2025-02-11 11:30',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-11 11:25'
  },
  {
    messageSeq: 3,
    customerSeq: 3,
    customerName: '박지민',
    messageType: '알림톡',
    templateName: '수업 변경 요청',
    content: '수업 일정 변경 요청이 접수되었습니다. 확인 후 연락드리겠습니다.',
    sendStatus: '대기',
    sendDate: '',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-12 14:20'
  },
  {
    messageSeq: 4,
    customerSeq: 4,
    customerName: '최수영',
    messageType: '이메일',
    templateName: '멤버십 갱신 안내',
    content: '최수영 고객님, 멤버십 갱신 혜택을 안내해 드립니다.',
    sendStatus: '실패',
    sendDate: '',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-08 10:00'
  },
  {
    messageSeq: 5,
    customerSeq: 5,
    customerName: '정민우',
    messageType: 'SMS',
    templateName: '상담 취소 안내',
    content: '상담 예약이 취소되었습니다. 재예약은 010-5678-9012로 연락 주세요.',
    sendStatus: '취소',
    sendDate: '',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-14 10:00'
  }
];

/**
 * 상담관리 스토어 - Mock 데이터 기반
 */
export const useConsultationStore = defineStore('consultation', {
  state: () => ({
    /** Mock 전체 상담 목록 (필터/페이징용) */
    mockListData: [...MOCK_CONSULTATION_LIST] as Consultation[],
    /** 화면 표시용 상담 목록 */
    listData: [] as Consultation[],
    /** 총 건수 */
    listTotalRow: 0,
    /** 상세 데이터 */
    detailData: {} as Consultation,
    /** 메시지 목록 */
    messageListData: [] as ConsultationMessage[],
    /** 메시지 총 건수 */
    messageTotalRow: 0,
    /** 상담 이력 (무한스크롤용) */
    historyData: [] as Consultation[],
    /** 이력 다음 페이지 커서 */
    historyCursor: 0,
    /** 이력 더 로드 가능 여부 */
    historyHasMore: true
  }),

  actions: {
    /** 검색 파라미터 초기화 */
    listParamsInit() {
      return {
        keyword: '',
        consultationType: '',
        status: '',
        startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        sortBy: 'insertDate',
        sortType: 'desc',
        sortData: 'insertDate,desc',
        row: 10,
        page: 1,
        time: ''
      };
    },

    /** 페이징 목록 조회 */
    async paging(params: ConsultationPagingDto): Promise<void> {
      let filtered = this.mockListData.filter((c) => c.isDelete === 'N');

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.customerName.toLowerCase().includes(keyword) ||
            c.title.toLowerCase().includes(keyword) ||
            c.content.toLowerCase().includes(keyword) ||
            c.counselorName.toLowerCase().includes(keyword)
        );
      }

      if (params.consultationType) {
        filtered = filtered.filter((c) => c.consultationType === params.consultationType);
      }

      if (params.status) {
        filtered = filtered.filter((c) => c.status === params.status);
      }

      if (params.startDate) {
        filtered = filtered.filter((c) => c.reservationDate >= params.startDate);
      }
      if (params.endDate) {
        filtered = filtered.filter((c) => c.reservationDate <= params.endDate + ' 23:59:59');
      }

      const sortBy = params.sortBy || 'insertDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: Consultation, b: Consultation) => {
        const aVal = (a as Record<string, string | number>)[sortBy];
        const bVal = (b as Record<string, string | number>)[sortBy];
        if (sortType === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });

      this.listTotalRow = filtered.length;

      const row = Number(params.row) || 10;
      const page = Number(params.page) || 1;
      const start = (page - 1) * row;
      this.listData = filtered.slice(start, start + row);
    },

    /** 상세 조회 */
    async detail(consultationSeq: number): Promise<void> {
      const found = this.mockListData.find((c) => c.consultationSeq === consultationSeq);
      if (found) {
        this.detailData = { ...found };
      }
    },

    /** 상세 데이터 초기화 */
    detailDataInit(): void {
      this.detailData = {} as Consultation;
    },

    /** 등록 */
    async insert(params: ConsultationInsertDto): Promise<{ isSuccess: boolean; consultationSeq: number }> {
      const newSeq = Math.max(...this.mockListData.map((c) => c.consultationSeq), 0) + 1;
      const newItem: Consultation = {
        consultationSeq: newSeq,
        ...params,
        status: '대기',
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 1,
        insertDate: dayjs().format('YYYY-MM-DD HH:mm'),
        updateSeq: 1,
        updateDate: dayjs().format('YYYY-MM-DD HH:mm')
      };
      this.mockListData.unshift(newItem);
      return { isSuccess: true, consultationSeq: newSeq };
    },

    /** 수정 */
    async update(params: ConsultationUpdateDto): Promise<{ isSuccess: boolean }> {
      const index = this.mockListData.findIndex((c) => c.consultationSeq === params.consultationSeq);
      if (index !== -1) {
        this.mockListData[index] = {
          ...this.mockListData[index],
          ...params,
          updateDate: dayjs().format('YYYY-MM-DD HH:mm')
        };
        this.detailData = { ...this.mockListData[index] };
      }
      return { isSuccess: true };
    },

    /** 논리 삭제 */
    async softDelete(consultationSeq: number | number[]): Promise<{ isSuccess: boolean }> {
      const seqList = Array.isArray(consultationSeq) ? consultationSeq : [consultationSeq];
      seqList.forEach((seq) => {
        const index = this.mockListData.findIndex((c) => c.consultationSeq === seq);
        if (index !== -1) {
          this.mockListData[index].isDelete = 'Y';
        }
      });
      return { isSuccess: true };
    },

    /** 메시지 목록 조회 */
    async messageList(params: MessagePagingDto): Promise<void> {
      let filtered = MOCK_MESSAGE_LIST.filter((m) => m.isDelete === 'N');

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.customerName.toLowerCase().includes(keyword) ||
            m.content.toLowerCase().includes(keyword) ||
            m.templateName.toLowerCase().includes(keyword)
        );
      }

      if (params.messageType) {
        filtered = filtered.filter((m) => m.messageType === params.messageType);
      }

      this.messageTotalRow = filtered.length;

      const row = Number(params.row) || 10;
      const page = Number(params.page) || 1;
      const start = (page - 1) * row;
      this.messageListData = filtered.slice(start, start + row);
    },

    /** 메시지 발송 */
    async messageSend(params: {
      customerSeq: number;
      customerName: string;
      messageType: string;
      templateName: string;
      content: string;
    }): Promise<{ isSuccess: boolean }> {
      const newSeq = Math.max(...MOCK_MESSAGE_LIST.map((m) => m.messageSeq), 0) + 1;
      const newMsg: ConsultationMessage = {
        messageSeq: newSeq,
        customerSeq: params.customerSeq,
        customerName: params.customerName,
        messageType: params.messageType,
        templateName: params.templateName,
        content: params.content,
        sendStatus: '발송',
        sendDate: dayjs().format('YYYY-MM-DD HH:mm'),
        isDelete: 'N',
        insertSeq: 1,
        insertDate: dayjs().format('YYYY-MM-DD HH:mm')
      };
      MOCK_MESSAGE_LIST.unshift(newMsg);
      return { isSuccess: true };
    },

    /** 상담 이력 추가 로드 (무한스크롤) */
    async loadMoreHistory(limit: number): Promise<Consultation[]> {
      const filtered = this.mockListData.filter((c) => c.isDelete === 'N');
      const sorted = [...filtered].sort((a, b) =>
        a.insertDate > b.insertDate ? -1 : 1
      );

      const start = this.historyCursor;
      const chunk = sorted.slice(start, start + limit);
      this.historyCursor += chunk.length;
      this.historyHasMore = this.historyCursor < sorted.length;

      this.historyData = [...this.historyData, ...chunk];
      return chunk;
    },

    /** 상담 이력 초기화 */
    historyDataInit(): void {
      this.historyData = [];
      this.historyCursor = 0;
      this.historyHasMore = true;
    }
  }
});
