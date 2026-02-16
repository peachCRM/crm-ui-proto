/**
 * 필라테스 수업
 */
export interface PilatesClass {
  classSeq: number; // 수업번호
  className: string; // 수업명
  instructorName: string; // 강사명
  classType: string; // 수업유형 (개인/그룹/듀엣)
  dayOfWeek: string; // 요일 (1~5: 월~금)
  startTime: string; // 시작시간
  endTime: string; // 종료시간
  maxCapacity: number; // 최대정원
  currentCapacity: number; // 현재인원
  classRoom: string; // 강의실
  status: string; // 상태 (활성/비활성)

  // 감사(audit) 필드
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

/**
 * 필라테스 수업 등록 DTO
 */
export interface PilatesClassInsertDto {
  className: string; // 수업명
  instructorName: string; // 강사명
  classType: string; // 수업유형
  dayOfWeek: string; // 요일
  startTime: string; // 시작시간
  endTime: string; // 종료시간
  maxCapacity: number; // 최대정원
  classRoom: string; // 강의실
}

/**
 * 멤버십
 */
export interface Membership {
  membershipSeq: number; // 멤버십번호
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  membershipType: string; // 멤버십유형 (기본/프리미엄/VIP)
  totalSessions: number; // 총횟수
  remainingSessions: number; // 잔여횟수
  startDate: string; // 시작일
  endDate: string; // 종료일
  status: string; // 상태 (활성/만료/일시정지)
  price: number; // 가격

  // 감사(audit) 필드
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

/**
 * 멤버십 페이징 DTO
 */
export interface MembershipPagingDto {
  keyword: string; // 검색어
  membershipType: string; // 멤버십유형 필터
  status: string; // 상태 필터
  sortBy: string; // 정렬기준
  sortType: string; // 정렬방식
  sortData: string; // 정렬데이터
  row: number; // 페이지당 행수
  page: number; // 현재페이지
  time: string; // 타임스탬프
}

/**
 * 멤버십 등록 DTO
 */
export interface MembershipInsertDto {
  customerName: string; // 고객명
  membershipType: string; // 멤버십유형
  totalSessions: number; // 총횟수
  startDate: string; // 시작일
  endDate: string; // 종료일
  price: number; // 가격
}

/**
 * 멤버십 수정 DTO
 */
export interface MembershipUpdateDto {
  membershipSeq: number; // 멤버십번호
  customerName: string; // 고객명
  membershipType: string; // 멤버십유형
  totalSessions: number; // 총횟수
  remainingSessions: number; // 잔여횟수
  startDate: string; // 시작일
  endDate: string; // 종료일
  status: string; // 상태
  price: number; // 가격
}

/**
 * 출석
 */
export interface Attendance {
  attendanceSeq: number; // 출석번호
  classSeq: number; // 수업번호
  className: string; // 수업명
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  attendanceDate: string; // 출석일
  attendanceTime: string; // 출석시간
  status: string; // 상태 (출석/결석/지각/취소)
  memo: string; // 메모
  insertDate: string; // 등록일
}

/**
 * 출석 체크 DTO
 */
export interface AttendanceCheckDto {
  classSeq: number; // 수업번호
  attendanceDate: string; // 출석일
  customerSeq: number; // 고객번호
  status: string; // 상태 (출석/결석/지각/취소)
  memo: string; // 메모
}
