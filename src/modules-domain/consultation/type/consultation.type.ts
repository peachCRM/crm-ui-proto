/**
 * 상담관리 타입 정의
 */

/** 상담 */
export interface Consultation {
  consultationSeq: number; // 상담번호
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  consultationType: string; // 상담유형 (전화/방문/온라인)
  title: string; // 제목
  content: string; // 내용
  status: string; // 상태 (대기/진행/완료/취소)
  counselorName: string; // 상담사명
  reservationDate: string; // 예약일시
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

/** 상담 메시지 */
export interface ConsultationMessage {
  messageSeq: number; // 메시지번호
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  messageType: string; // 메시지유형 (알림톡/SMS/이메일)
  templateName: string; // 템플릿명
  content: string; // 내용
  sendStatus: string; // 발송상태 (대기/발송/실패/취소)
  sendDate: string; // 발송일시
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
}

/** 상담 페이징 Dto */
export interface ConsultationPagingDto {
  keyword: string; // 검색어
  consultationType: string; // 상담유형
  status: string; // 상태
  startDate: string; // 시작일
  endDate: string; // 종료일
  sortBy: string; // 정렬기준
  sortType: string; // 정렬방식
  sortData: string; // 정렬데이터
  row: number; // 페이지당 행수
  page: number; // 현재페이지
  time: string; // 타임스탬프
}

/** 상담 검색 Dto */
export interface ConsultationSearchDto {
  keyword: string;
  consultationType: string;
  status: string;
  startDate: string;
  endDate: string;
}

/** 상담 등록 Dto */
export interface ConsultationInsertDto {
  customerSeq: number;
  customerName: string;
  consultationType: string;
  title: string;
  content: string;
  counselorName: string;
  reservationDate: string;
}

/** 상담 수정 Dto */
export interface ConsultationUpdateDto {
  consultationSeq: number;
  customerSeq: number;
  customerName: string;
  consultationType: string;
  title: string;
  content: string;
  status: string;
  counselorName: string;
  reservationDate: string;
}

/** 메시지 페이징 Dto */
export interface MessagePagingDto {
  keyword: string;
  messageType: string;
  sortBy: string;
  sortType: string;
  sortData: string;
  row: number;
  page: number;
  time: string;
}
