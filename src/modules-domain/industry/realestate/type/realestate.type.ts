/**
 * 부동산 매물
 */
export interface Property {
  propertySeq: number; // 매물번호
  propertyName: string; // 매물명
  propertyType: string; // 매물유형 (아파트/오피스텔/빌라/상가/토지)
  transactionType: string; // 거래유형 (매매/전세/월세)
  address: string; // 주소
  zipcode: string; // 우편번호
  area: number; // 면적(m²)
  price: number; // 가격(만원)
  deposit: number; // 보증금(만원)
  monthlyRent: number; // 월세(만원)
  floor: number; // 층
  totalFloor: number; // 총층수
  buildYear: number; // 준공년도
  description: string; // 설명
  status: string; // 상태 (등록/계약중/계약완료/보류)
  ownerName: string; // 소유자명
  ownerPhone: string; // 소유자연락처

  // 감사(audit) 필드
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

/**
 * 매물 페이징 DTO
 */
export interface PropertyPagingDto extends PropertySearchDto {
  sortBy: string; // 정렬 기준 필드
  sortType: string; // 정렬 방식(asc/desc)
  sortData: string; // 정렬 데이터
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
}

/**
 * 매물 검색 DTO
 */
export interface PropertySearchDto {
  keyword: string; // 검색어 (주소, 소유자명)
  propertyType: string; // 매물유형
  transactionType: string; // 거래유형
  status: string; // 상태
}

/**
 * 매물 등록 DTO
 */
export interface PropertyInsertDto {
  propertyName: string; // 매물명
  propertyType: string; // 매물유형
  transactionType: string; // 거래유형
  address: string; // 주소
  zipcode: string; // 우편번호
  area: number; // 면적
  price: number; // 가격
  deposit: number; // 보증금
  monthlyRent: number; // 월세
  floor: number; // 층
  totalFloor: number; // 총층수
  buildYear: number; // 준공년도
  description: string; // 설명
  ownerName: string; // 소유자명
  ownerPhone: string; // 소유자연락처
}

/**
 * 매물 수정 DTO
 */
export interface PropertyUpdateDto extends PropertyInsertDto {
  propertySeq: number; // 매물번호
  status: string; // 상태
}

/**
 * 고객-매물 매칭
 */
export interface PropertyMatching {
  matchingSeq: number; // 매칭번호
  propertySeq: number; // 매물번호
  propertyName: string; // 매물명
  customerSeq: number; // 고객번호
  customerName: string; // 고객명
  matchScore: number; // 매칭 점수 (0-100)
  matchReason: string; // 매칭 사유
  status: string; // 상태 (추천/상담예정/상담완료/계약)
  contactDate: string; // 상담일
  memo: string; // 메모
  insertDate: string; // 등록일
}

/**
 * 매칭 페이징 DTO
 */
export interface MatchingPagingDto extends MatchingSearchDto {
  sortBy: string; // 정렬 기준
  sortType: string; // 정렬 방식
  sortData: string; // 정렬 데이터
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
  selected: string; // 선택된 매칭
}

/**
 * 매칭 검색 DTO
 */
export interface MatchingSearchDto {
  keyword: string; // 검색어 (고객명, 매물명)
  status: string; // 상태
}
