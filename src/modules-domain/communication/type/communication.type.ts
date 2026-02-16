/**
 * 통신 모듈 타입 정의
 */

/** 통화 이력 */
export interface CallHistory {
  callSeq: number; // 통화번호
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  customerPhone: string; // 고객전화번호
  callType: string; // 통화유형 (인바운드/아웃바운드)
  duration: number; // 통화시간(초)
  startTime: string; // 통화시작시간
  endTime: string; // 통화종료시간
  counselorName: string; // 상담사명
  callResult: string; // 통화결과 (연결/부재/통화중/거절)
  memo: string; // 메모
  hasRecording: string; // 녹취유무 (Y/N)
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
}

/** 녹취 기록 */
export interface CallRecord {
  recordSeq: number; // 녹취번호
  callSeq: number; // 통화번호
  customerName: string; // 고객명
  customerPhone: string; // 고객전화번호
  counselorName: string; // 상담사명
  callType: string; // 통화유형 (인바운드/아웃바운드)
  duration: number; // 통화시간(초)
  recordingUrl: string; // 녹취파일URL
  sttText: string; // STT 변환 텍스트
  sentiment: string; // 감정분석 (긍정/부정/중립)
  summary: string; // AI 요약
  recordDate: string; // 녹취일시
  insertDate: string; // 등록일
}

/** 통화 이력 페이징 Dto */
export interface CallHistoryPagingDto {
  keyword: string; // 검색어 (고객명, 전화번호)
  callType: string; // 통화유형 (인바운드/아웃바운드)
  callResult: string; // 통화결과 (연결/부재/통화중/거절)
  startDate: string; // 시작일
  endDate: string; // 종료일
  sortBy: string; // 정렬기준
  sortType: string; // 정렬방식
  sortData: string; // 정렬데이터
  row: number; // 페이지당 행수
  page: number; // 현재페이지
  time: string; // 타임스탬프
}

/** 녹취 페이징 Dto */
export interface CallRecordPagingDto {
  keyword: string; // 검색어
  startDate: string; // 시작일
  endDate: string; // 종료일
  sortBy: string; // 정렬기준
  sortType: string; // 정렬방식
  sortData: string; // 정렬데이터
  row: number; // 페이지당 행수
  page: number; // 현재페이지
  time: string; // 타임스탬프
}
