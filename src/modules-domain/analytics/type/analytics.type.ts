/**
 * 통계/분석 모듈 타입 정의
 */

/** KPI 카드 (대시보드용) */
export interface KpiCard {
  kpiSeq: number; // KPI 순번
  title: string; // 제목
  value: string; // 표시값
  unit: string; // 단위
  changeRate: number; // 변화율(%)
  changeType: 'up' | 'down' | 'flat'; // 변화 방향
  icon: string; // 아이콘 클래스
  color: 'primary' | 'success' | 'warning' | 'error'; // 카드 색상
}

/** 차트 데이터 (라벨-값) */
export interface KpiChartData {
  label: string; // 라벨
  value: number; // 값
  color: string; // 색상
}

/** 월별 통계 */
export interface MonthlyStats {
  month: string; // 월 (YYYY-MM)
  newCustomers: number; // 신규 고객 수
  consultations: number; // 상담 수
  revenue: number; // 매출 (원)
  conversionRate: number; // 전환율 (%)
}

/** AI 리포트 */
export interface AiReport {
  reportSeq: number; // 리포트 순번
  title: string; // 제목
  reportType: '월간분석' | '고객분석' | '매출분석' | '트렌드'; // 리포트 유형
  summary: string; // 요약
  insights: string[]; // 주요 인사이트
  recommendations: string[]; // 추천 사항
  generatedDate: string; // 생성일시
  status: '생성중' | '완료' | '실패'; // 상태
  insertDate: string; // 등록일
}

/** AI 리포트 페이징 DTO */
export interface AiReportPagingDto {
  keyword: string; // 검색어
  reportType: string; // 리포트 유형 필터
  startDate: string; // 시작일
  endDate: string; // 종료일
  sortBy: string; // 정렬 기준
  sortType: string; // 정렬 방식
  sortData: string; // 정렬 데이터
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
}
