/**
 * 주문
 */
export interface Order {
  orderSeq: number; // 주문번호
  orderNo: string; // 주문번호(표시용)
  orderDate: string; // 주문일시
  orderStatus: string; // 주문상태 (pending, confirmed, shipped, delivered, cancelled)

  // 주문자 정보
  ordererName: string; // 주문자명
  ordererPhone: string; // 주문자 연락처
  ordererEmail: string; // 주문자 이메일

  // 상품 정보
  productSeq: number; // 상품번호
  productName: string; // 상품명
  productCode: string; // 상품코드
  productImageUrl: string; // 상품이미지
  quantity: number; // 주문수량
  unitPrice: number; // 단가

  // 받는사람 정보
  receiverName: string; // 받는사람
  receiverPhone: string; // 받는사람 연락처
  receiverZipcode: string; // 우편번호
  receiverAddress: string; // 주소
  receiverAddressDetail: string; // 상세주소
  deliveryMemo: string; // 배송메모

  // 결제 정보
  paymentMethod: string; // 결제수단 (card, bank, cash)
  totalAmount: number; // 총 결제금액
  shippingFee: number; // 배송비
  discountAmount: number; // 할인금액

  // 감사(audit) 필드
  isUse: string; // 사용여부
  isDelete: string; // 삭제여부
  insertSeq: number; // 등록자
  insertDate: string; // 등록일
  updateSeq: number; // 수정자
  updateDate: string; // 수정일
}

export interface OrderDetail extends Order {
  // 파일
  fileList: OrderFile[]; // 파일 목록
  imageList: OrderFile[]; // 이미지 목록
}

/**
 * 주문 리스트 아이템 (체크박스 상태 관리용)
 */
export interface OrderListItem extends OrderDetail {
  chk: boolean; // 체크박스 선택 상태
  nIndex: number; // 인덱스 번호
}

/**
 * 주문 검색
 */
export interface OrderSearchDto {
  startDate: string; // 시작일
  endDate: string; // 종료일
  keyword: string; // 검색어
  opt: string; // 검색 옵션
  orderStatus: string; // 주문상태
  paymentMethod: string; // 결제수단
}

/**
 * 주문 페이징 (검색 + 페이징)
 */
export interface OrderPagingDto extends OrderSearchDto {
  sortBy: string; // 정렬 기준 필드
  sortType: string; // 정렬 방식(오름차순(asc)/내림차순(desc))
  sortData: string; // 정렬 데이터 (sortBy,sortType)
  row: number; // 페이지당 행 수
  page: number; // 현재 페이지
  time: string; // 타임스탬프
}

/**
 * 주문 Insert Dto
 */
export interface OrderInsertDto {
  orderDate: string; // 주문일시
  orderStatus: string; // 주문상태

  // 주문자 정보
  ordererName: string; // 주문자명
  ordererPhone: string; // 주문자 연락처
  ordererEmail: string; // 주문자 이메일

  // 상품 정보
  productSeq: number; // 상품번호
  productName: string; // 상품명
  productCode: string; // 상품코드
  productImageUrl: string; // 상품이미지
  quantity: number; // 주문수량
  unitPrice: number; // 단가

  // 받는사람 정보
  receiverName: string; // 받는사람
  receiverPhone: string; // 받는사람 연락처
  receiverZipcode: string; // 우편번호
  receiverAddress: string; // 주소
  receiverAddressDetail: string; // 상세주소
  deliveryMemo: string; // 배송메모

  // 결제 정보
  paymentMethod: string; // 결제수단
  totalAmount: number; // 총 결제금액
  shippingFee: number; // 배송비
  discountAmount: number; // 할인금액
}

/**
 * 주문 Update Dto
 */
export interface OrderUpdateDto {
  orderStatus: string; // 주문상태

  // 받는사람 정보
  receiverName: string; // 받는사람
  receiverPhone: string; // 받는사람 연락처
  receiverZipcode: string; // 우편번호
  receiverAddress: string; // 주소
  receiverAddressDetail: string; // 상세주소
  deliveryMemo: string; // 배송메모
}

/**
 * 주문 파일
 */
export interface OrderFile {
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
