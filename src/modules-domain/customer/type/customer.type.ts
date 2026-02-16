/** 고객 정보 */
export interface Customer {
  customerSeq: number; // 고객 시퀀스
  customerName: string; // 고객 이름
  phone: string; // 전화번호
  email: string; // 이메일
  gender: string; // 성별 (M:남성, F:여성)
  birthDate: string; // 생년월일
  address: string; // 주소
  zipcode: string; // 우편번호
  memo: string; // 메모
  customerGrade: string; // 고객 등급 (A:VIP, B:우수, C:일반, D:관심)
  customerStatus: string; // 고객 상태 (A:활성, I:비활성, D:탈퇴)
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

/** 고객 페이징 조회 DTO */
export interface CustomerPagingDto {
  keyword: string; // 검색 키워드
  customerGrade: string; // 고객 등급 필터
  customerStatus: string; // 고객 상태 필터
  startDate: string; // 시작일
  endDate: string; // 종료일
  sortBy: string; // 정렬 기준
  sortType: string; // 정렬 순서
  sortData: string; // 정렬 데이터
  row: number; // 페이지 당 건수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
  selected: string; // 선택된 고객
}

/** 고객 등록 DTO */
export interface CustomerInsertDto {
  customerName: string; // 고객 이름
  phone: string; // 전화번호
  email: string; // 이메일
  gender: string; // 성별
  birthDate: string; // 생년월일
  address: string; // 주소
  zipcode: string; // 우편번호
  memo: string; // 메모
  customerGrade: string; // 고객 등급
}

/** 고객 수정 DTO */
export interface CustomerUpdateDto {
  customerSeq: number; // 고객 시퀀스
  customerName: string; // 고객 이름
  phone: string; // 전화번호
  email: string; // 이메일
  gender: string; // 성별
  birthDate: string; // 생년월일
  address: string; // 주소
  zipcode: string; // 우편번호
  memo: string; // 메모
  customerGrade: string; // 고객 등급
  customerStatus: string; // 고객 상태
}

/** 고객 검색 DTO */
export interface CustomerSearchDto {
  startDate: string; // 시작일
  endDate: string; // 종료일
  keyword: string; // 검색 키워드
  customerGrade: string; // 고객 등급
  customerStatus: string; // 고객 상태
  selected: string; // 선택된 고객
}
