import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import type {
  CallHistory,
  CallRecord,
  CallHistoryPagingDto,
  CallRecordPagingDto
} from '../type/communication.type';

/** Mock 통화 이력 목록 (10건) */
const MOCK_CALL_LIST: CallHistory[] = [
  {
    callSeq: 1,
    customerSeq: 1,
    customerName: '김영희',
    customerPhone: '010-1234-5678',
    callType: '인바운드',
    duration: 185,
    startTime: '2025-02-16 09:15:00',
    endTime: '2025-02-16 09:18:05',
    counselorName: '박상담',
    callResult: '연결',
    memo: '멤버십 문의, 3개월 프리미엄 안내 완료',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 09:18:10'
  },
  {
    callSeq: 2,
    customerSeq: 2,
    customerName: '이철수',
    customerPhone: '010-2345-6789',
    callType: '아웃바운드',
    duration: 45,
    startTime: '2025-02-16 10:30:00',
    endTime: '2025-02-16 10:30:45',
    counselorName: '김부동',
    callResult: '부재',
    memo: '통화 부재, 문자 발송 예정',
    hasRecording: 'N',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 10:31:00'
  },
  {
    callSeq: 3,
    customerSeq: 3,
    customerName: '박지민',
    customerPhone: '010-3456-7890',
    callType: '인바운드',
    duration: 720,
    startTime: '2025-02-16 11:00:00',
    endTime: '2025-02-16 11:12:00',
    counselorName: '이필라',
    callResult: '연결',
    memo: '수업 일정 변경 요청 처리 완료',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 11:12:05'
  },
  {
    callSeq: 4,
    customerSeq: 4,
    customerName: '최수영',
    customerPhone: '010-4567-8901',
    callType: '아웃바운드',
    duration: 120,
    startTime: '2025-02-16 14:00:00',
    endTime: '2025-02-16 14:02:00',
    counselorName: '박상담',
    callResult: '통화중',
    memo: '통화중으로 연결 실패',
    hasRecording: 'N',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 14:02:05'
  },
  {
    callSeq: 5,
    customerSeq: 5,
    customerName: '정민우',
    customerPhone: '010-5678-9012',
    callType: '인바운드',
    duration: 30,
    startTime: '2025-02-16 15:20:00',
    endTime: '2025-02-16 15:20:30',
    counselorName: '이필라',
    callResult: '거절',
    memo: '고객이 통화 거절',
    hasRecording: 'N',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-16 15:20:35'
  },
  {
    callSeq: 6,
    customerSeq: 6,
    customerName: '한소희',
    customerPhone: '010-6789-0123',
    callType: '아웃바운드',
    duration: 420,
    startTime: '2025-02-15 16:00:00',
    endTime: '2025-02-15 16:07:00',
    counselorName: '박상담',
    callResult: '연결',
    memo: '프리미엄 전환 상담 완료',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15 16:07:10'
  },
  {
    callSeq: 7,
    customerSeq: 7,
    customerName: '윤도현',
    customerPhone: '010-7890-1234',
    callType: '인바운드',
    duration: 600,
    startTime: '2025-02-15 09:30:00',
    endTime: '2025-02-15 09:40:00',
    counselorName: '김부동',
    callResult: '연결',
    memo: '부동산 매물 상담, 역삼동 매물 안내',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15 09:40:05'
  },
  {
    callSeq: 8,
    customerSeq: 8,
    customerName: '강지원',
    customerPhone: '010-8901-2345',
    callType: '아웃바운드',
    duration: 90,
    startTime: '2025-02-15 11:00:00',
    endTime: '2025-02-15 11:01:30',
    counselorName: '이필라',
    callResult: '연결',
    memo: '신규 회원 상담 예약 확인',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-15 11:01:35'
  },
  {
    callSeq: 9,
    customerSeq: 9,
    customerName: '송미래',
    customerPhone: '010-9012-3456',
    callType: '인바운드',
    duration: 1800,
    startTime: '2025-02-14 14:00:00',
    endTime: '2025-02-14 14:30:00',
    counselorName: '박상담',
    callResult: '연결',
    memo: '장기 상담 - 멤버십 옵션 상세 안내',
    hasRecording: 'Y',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-14 14:30:10'
  },
  {
    callSeq: 10,
    customerSeq: 10,
    customerName: '임동훈',
    customerPhone: '010-0123-4567',
    callType: '아웃바운드',
    duration: 0,
    startTime: '2025-02-14 10:00:00',
    endTime: '2025-02-14 10:00:00',
    counselorName: '김부동',
    callResult: '부재',
    memo: '연락 두 번 시도, 부재',
    hasRecording: 'N',
    isDelete: 'N',
    insertSeq: 1,
    insertDate: '2025-02-14 10:00:05'
  }
];

/** Mock 녹취 목록 (6건) */
const MOCK_RECORD_LIST: CallRecord[] = [
  {
    recordSeq: 1,
    callSeq: 1,
    customerName: '김영희',
    customerPhone: '010-1234-5678',
    counselorName: '박상담',
    callType: '인바운드',
    duration: 185,
    recordingUrl: '/mock/recording-1.mp3',
    sttText:
      '[상담사] 안녕하세요, 피치CRM 상담센터입니다.\n[고객] 안녕하세요. 멤버십 문의드립니다.\n[상담사] 네, 3개월 프리미엄 멤버십은 45만원입니다. 현재 10% 할인 중이십니다.\n[고객] 알겠습니다. 오늘 방문해서 결제할게요.',
    sentiment: '긍정',
    summary:
      '고객이 3개월 프리미엄 멤버십 가격 및 할인 문의. 상담사가 45만원, 10% 할인 안내. 고객이 당일 방문 결제 예정.',
    recordDate: '2025-02-16 09:18:00',
    insertDate: '2025-02-16 09:20:00'
  },
  {
    recordSeq: 2,
    callSeq: 3,
    customerName: '박지민',
    customerPhone: '010-3456-7890',
    counselorName: '이필라',
    callType: '인바운드',
    duration: 720,
    recordingUrl: '/mock/recording-2.mp3',
    sttText:
      '[상담사] 안녕하세요, 수업 일정 변경 요청이시군요.\n[고객] 네, 다음 주 화요일 수업을 수요일로 바꾸고 싶어요.\n[상담사] 확인해보겠습니다. 수요일 오후 2시 가능하시면 그 시간으로 변경해드릴게요.\n[고객] 네, 그렇게 해주세요. 감사합니다.',
    sentiment: '긍정',
    summary:
      '고객이 화요일 수업을 수요일 오후 2시로 변경 요청. 상담사가 확인 후 변경 완료.',
    recordDate: '2025-02-16 11:12:00',
    insertDate: '2025-02-16 11:15:00'
  },
  {
    recordSeq: 3,
    callSeq: 6,
    customerName: '한소희',
    customerPhone: '010-6789-0123',
    counselorName: '박상담',
    callType: '아웃바운드',
    duration: 420,
    recordingUrl: '/mock/recording-3.mp3',
    sttText:
      '[상담사] 한소희 고객님, 프리미엄 전환 상담 드리겠습니다.\n[고객] 네, 프리미엄으로 업그레이드하고 싶어요.\n[상담사] 현재 기본 멤버십에서 프리미엄으로 전환 시 차액 15만원 결제해주시면 됩니다.\n[고객] 알겠어요. 오늘 결제 진행할게요.',
    sentiment: '긍정',
    summary:
      '프리미엄 전환 상담. 차액 15만원 결제 후 전환 가능. 고객 당일 결제 예정.',
    recordDate: '2025-02-15 16:07:00',
    insertDate: '2025-02-15 16:10:00'
  },
  {
    recordSeq: 4,
    callSeq: 7,
    customerName: '윤도현',
    customerPhone: '010-7890-1234',
    counselorName: '김부동',
    callType: '인바운드',
    duration: 600,
    recordingUrl: '/mock/recording-4.mp3',
    sttText:
      '[상담사] 역삼동 매물 문의 주셨군요. 현재 3건 등록되어 있습니다.\n[고객] 가격대가 어떻게 되나요?\n[상담사] 5억~8억대 매물이 있습니다. 방문 상담 예약 도와드릴까요?\n[고객] 네, 내일 오후에 가능할까요?',
    sentiment: '중립',
    summary:
      '역삼동 부동산 매물 5~8억대 안내. 고객이 내일 오후 방문 상담 예약 요청.',
    recordDate: '2025-02-15 09:40:00',
    insertDate: '2025-02-15 09:45:00'
  },
  {
    recordSeq: 5,
    callSeq: 8,
    customerName: '강지원',
    customerPhone: '010-8901-2345',
    counselorName: '이필라',
    callType: '아웃바운드',
    duration: 90,
    recordingUrl: '/mock/recording-5.mp3',
    sttText:
      '[상담사] 강지원 고객님, 신규 상담 예약 확인 전화드립니다.\n[고객] 네, 17일 오전 9시 맞죠?\n[상담사] 맞습니다. 필라테스 체험 수업 포함 상담이십니다.\n[고객] 알겠습니다. 감사합니다.',
    sentiment: '긍정',
    summary: '17일 오전 9시 필라테스 체험 수업 상담 예약 확인 완료.',
    recordDate: '2025-02-15 11:01:30',
    insertDate: '2025-02-15 11:05:00'
  },
  {
    recordSeq: 6,
    callSeq: 9,
    customerName: '송미래',
    customerPhone: '010-9012-3456',
    counselorName: '박상담',
    callType: '인바운드',
    duration: 1800,
    recordingUrl: '/mock/recording-6.mp3',
    sttText:
      '[상담사] 장기 멤버십 옵션에 대해 상세히 안내드리겠습니다.\n[고객] 6개월이랑 12개월 차이가 뭔가요?\n[상담사] 12개월이 15% 추가 할인됩니다. 6개월 80만, 12개월 136만원입니다.\n[고객] 12개월로 결제할게요. 결제는 카드로 할 수 있나요?\n[상담사] 네, 카드/계좌이체 모두 가능합니다.',
    sentiment: '긍정',
    summary:
      '6개월/12개월 멤버십 비교 안내. 12개월 15% 추가 할인. 고객 12개월 선택, 카드 결제 예정.',
    recordDate: '2025-02-14 14:30:00',
    insertDate: '2025-02-14 14:35:00'
  }
];

/**
 * 통신 모듈 스토어 (Mock 데이터 기반)
 */
export const useCommunicationStore = defineStore('communication', {
  state: () => ({
    callListData: [] as CallHistory[],
    callTotalRow: 0,
    callDetailData: {} as CallHistory,
    recordListData: [] as CallRecord[],
    recordTotalRow: 0,
    recordDetailData: {} as CallRecord
  }),

  getters: {},

  actions: {
    /**
     * 통화 이력 페이징 조회 (Mock)
     */
    callPaging(params: CallHistoryPagingDto): void {
      let filtered = [...MOCK_CALL_LIST].filter((item) => item.isDelete === 'N');

      // 키워드 검색 (고객명, 전화번호)
      if (params.keyword && params.keyword.trim()) {
        const kw = params.keyword.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.customerName.toLowerCase().includes(kw) ||
            item.customerPhone.replace(/-/g, '').includes(kw.replace(/-/g, ''))
        );
      }

      // 통화유형 필터
      if (params.callType) {
        filtered = filtered.filter((item) => item.callType === params.callType);
      }

      // 통화결과 필터
      if (params.callResult) {
        filtered = filtered.filter((item) => item.callResult === params.callResult);
      }

      // 날짜 범위 필터
      if (params.startDate) {
        filtered = filtered.filter(
          (item) => dayjs(item.startTime).format('YYYY-MM-DD') >= params.startDate
        );
      }
      if (params.endDate) {
        filtered = filtered.filter(
          (item) => dayjs(item.startTime).format('YYYY-MM-DD') <= params.endDate
        );
      }

      this.callTotalRow = filtered.length;

      const row = params.row || 10;
      const page = params.page || 1;
      const start = (page - 1) * row;
      const end = start + row;
      this.callListData = filtered.slice(start, end);
    },

    /**
     * 통화 이력 상세 조회 (Mock - callSeq로 목록에서 찾기)
     */
    callDetail(callSeq: number): void {
      const found = MOCK_CALL_LIST.find((item) => item.callSeq === callSeq);
      if (!found) {
        throw new Error('통화 이력을 찾을 수 없습니다.');
      }
      this.callDetailData = found;
    },

    /**
     * 통화 이력 상세 초기화
     */
    callDetailInit(): void {
      this.callDetailData = {} as CallHistory;
    },

    /**
     * 통화 이력 등록 (Mock - 실제 저장 없음)
     */
    callInsert(_params: Partial<CallHistory>): { isSuccess: boolean; callSeq: number } {
      const newSeq = Math.max(...MOCK_CALL_LIST.map((c) => c.callSeq), 0) + 1;
      return { isSuccess: true, callSeq: newSeq };
    },

    /**
     * 통화 이력 논리 삭제 (Mock)
     */
    callSoftDelete(callSeq: number | number[]): { isSuccess: boolean } {
      const seqs = Array.isArray(callSeq) ? callSeq : [callSeq];
      seqs.forEach((seq) => {
        const item = MOCK_CALL_LIST.find((c) => c.callSeq === seq);
        if (item) item.isDelete = 'Y';
      });
      return { isSuccess: true };
    },

    /**
     * 녹취 목록 페이징 조회 (Mock)
     */
    recordPaging(params: CallRecordPagingDto): void {
      let filtered = [...MOCK_RECORD_LIST];

      if (params.keyword && params.keyword.trim()) {
        const kw = params.keyword.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.customerName.toLowerCase().includes(kw) ||
            item.counselorName.toLowerCase().includes(kw) ||
            item.customerPhone.replace(/-/g, '').includes(kw.replace(/-/g, ''))
        );
      }

      if (params.startDate) {
        filtered = filtered.filter(
          (item) => dayjs(item.recordDate).format('YYYY-MM-DD') >= params.startDate
        );
      }
      if (params.endDate) {
        filtered = filtered.filter(
          (item) => dayjs(item.recordDate).format('YYYY-MM-DD') <= params.endDate
        );
      }

      this.recordTotalRow = filtered.length;

      const row = params.row || 10;
      const page = params.page || 1;
      const start = (page - 1) * row;
      const end = start + row;
      this.recordListData = filtered.slice(start, end);
    },

    /**
     * 녹취 상세 조회 (Mock)
     */
    recordDetail(recordSeq: number): void {
      const found = MOCK_RECORD_LIST.find((item) => item.recordSeq === recordSeq);
      if (!found) {
        throw new Error('녹취 기록을 찾을 수 없습니다.');
      }
      this.recordDetailData = found;
    },

    /**
     * 녹취 상세 초기화
     */
    recordDetailInit(): void {
      this.recordDetailData = {} as CallRecord;
    },

    /**
     * callSeq로 recordSeq 조회 (녹취 링크용)
     */
    getRecordSeqByCallSeq(callSeq: number): number {
      const found = MOCK_RECORD_LIST.find((item) => item.callSeq === callSeq);
      return found ? found.recordSeq : 0;
    }
  }
});
