/**
 * NGO 배너 크롤링 데이터
 * 1시간마다 크롤링된 네이버/카카오톡 배너 정보
 */
export interface NgoBanner {
  bannerSeq: number; // 배너번호
  ngoName: string; // NGO 단체명
  platform: string; // 플랫폼 (naver, kakao)
  bannerTitle: string; // 배너 제목
  bannerImageUrl: string; // 배너 이미지 URL
  bannerLinkUrl: string; // 배너 링크 URL
  crawledDate: string; // 크롤링 일시
  insertDate: string; // 등록일
}

/**
 * NGO 배너 목록 아이템 (체크박스 상태 관리용)
 */
export interface NgoBannerListItem extends NgoBanner {
  chk: boolean; // 체크박스 선택 상태
  nIndex: number; // 인덱스 번호
}

/**
 * NGO 배너 검색
 */
export interface NgoBannerSearchDto {
  startDate: string; // 시작일
  endDate: string; // 종료일
  keyword: string; // 검색어
  opt: string; // 검색 옵션
  platform: string; // 플랫폼 필터
}

/**
 * NGO 배너 페이징 (검색 + 페이징)
 */
export interface NgoBannerPagingDto extends NgoBannerSearchDto {
  sortBy: string; // 정렬 기준 필드
  sortType: string; // 정렬 방식(오름차순(asc)/내림차순(desc))
  sortData: string; // 정렬 데이터 (sortBy,sortType)
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
}
