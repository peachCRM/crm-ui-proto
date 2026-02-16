/**
 * 상품
 */
export interface Product {
  productSeq: number; // 상품번호
  productName: string; // 상품명
  productCode: string; // 상품코드
  category: string; // 카테고리
  price: number; // 판매가
  costPrice: number; // 원가
  stockQty: number; // 재고수량
  description: string; // 상품설명
  imageUrl: string; // 상품이미지URL

  // 감사(audit) 필드
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

export interface ProductDetail extends Product {
  // 파일
  fileList: ProductFile[]; // 파일 목록
  imageList: ProductFile[]; // 이미지 목록
}

/**
 * 상품 리스트 아이템 (체크박스 상태 관리용)
 */
export interface ProductListItem extends ProductDetail {
  chk: boolean; // 체크박스 선택 상태
  nIndex: number; // 인덱스 번호
}

/**
 * 상품 검색
 */
export interface ProductSearchDto {
  startDate: string; // 시작일
  endDate: string; // 종료일
  keyword: string; // 검색어
  opt: string; // 검색 옵션
  isUse: string; // 사용 여부
  category: string; // 카테고리
}

/**
 * 상품 페이징 (검색 + 페이징)
 */
export interface ProductPagingDto extends ProductSearchDto {
  sortBy: string; // 정렬 기준 필드
  sortType: string; // 정렬 방식(오름차순(asc)/내림차순(desc))
  sortData: string; // 정렬 데이터 (sortBy,sortType)
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
}

/**
 * 상품 Insert Dto
 */
export interface ProductInsertDto {
  productName: string; // 상품명
  productCode: string; // 상품코드
  category: string; // 카테고리
  price: number; // 판매가
  costPrice: number; // 원가
  stockQty: number; // 재고수량
  description: string; // 상품설명
  imageUrl: string; // 상품이미지URL

  // 파일(백엔드에서는 fileUuid만 필요)
  fileUuidList: string[]; // 파일 UUID 목록
  imageUuidList: string[]; // 이미지 UUID 목록
}

/**
 * 상품 Update Dto
 */
export interface ProductUpdateDto {
  productName: string; // 상품명
  productCode: string; // 상품코드
  category: string; // 카테고리
  price: number; // 판매가
  costPrice: number; // 원가
  stockQty: number; // 재고수량
  description: string; // 상품설명
  imageUrl: string; // 상품이미지URL

  // 파일(백엔드에서는 fileUuid만 필요)
  fileUuidList: string[]; // 파일 UUID 목록
  imageUuidList: string[]; // 이미지 UUID 목록
}

/**
 * 상품 파일
 */
export interface ProductFile {
  fileSeq: number; // 파일번호
  parentCode: string; // 부모코드
  storageType: string; // 저장소타입
  fileAuth: string; // 접근권한
  fileUuid: string; // 파일UUID
  fileFolder: string; // 파일폴더
  filePath: string; // 파일패스
  fileName: string; // 파일이름
  fileSize: number; // 파일크기
  fileType: string; // 파일종류
  downloadCnt: number; // 다운로드횟수
  orderValue: number; // 순번

  // 감사 필드
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}
