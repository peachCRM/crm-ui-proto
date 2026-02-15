// ==================== Enum Types ====================

/**
 * 서비스 타입
 */
export type ServiceType = 'MENU' | 'SUBMENU' | 'FEATURE';

/**
 * 액션 타입
 */
export type ActionType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

/**
 * 플랜 타입
 */
export type PlanType = 'FREE' | 'PAID' | 'TRIAL';

/**
 * 가격 단위 타입
 */
export type PriceUnitType = 'CASH' | 'POINT';

/**
 * 리다이렉트 표시 타입
 */
export type DisplayType = 'FULL_PAGE' | 'MODAL';

/**
 * 리다이렉트 열기 타입
 */
export type OpenType = 'REDIRECT' | 'IFRAME';

// ==================== Common Response ====================

/**
 * 공통 응답 DTO
 */
export interface CommonResDto<T> {
  code: string; // 응답 코드
  message: string; // 응답 메시지
  data: T; // 응답 데이터
  redirectCode: string; // 리다이렉트 코드
  redirectUrl: string; // 리다이렉트 URL
}

// ==================== Request DTOs ====================

/**
 * 서비스 조회 요청 DTO
 */
export interface ServiceApiReqDto {
  serviceCodePath: string; // 서비스 코드 경로 (예: "#SVC_FILING#SVC_FILING_WHT")
}

/**
 * 포인트 사용 요청 DTO
 */
export interface RedeemPointReqDto {
  serviceCode: string; // 서비스 코드 경로
  count: number; // 상품 사용 건수
}

/**
 * 서비스 사용량 조회 요청 DTO
 */
export interface ServiceUsageReqDto {
  serviceCodePath: string; // 서비스 코드 경로
}

/**
 * 관리자 포인트 지급 요청 DTO
 */
export interface GrantPointByAdminReqDto {
  svcSeq: number; // 대상 사용자 svcSeq
  reason: string; // 지급 사유
  point: number; // 지급할 포인트
}

/**
 * 관리자 포인트 차감 요청 DTO
 */
export interface DeductPointByAdminReqDto {
  svcSeq: number; // 대상 사용자 svcSeq
  reason: string; // 차감 사유
  point: number; // 차감할 포인트
}

// ==================== Response DTOs ====================

/**
 * 유저 포인트 응답 DTO
 */
export interface UserPointResDto {
  freeRemainingPoints: number; // 남은 무료 포인트
  paidRemainingPoints: number; // 남은 유료 포인트
  planName: string; // 플랜 이름
  planCode: string; // 플랜 코드
  planExpiredAt: string; // 플랜 만료 시간
}

/**
 * 가격 정보 DTO
 */
export interface PriceInfoDto {
  id: number; // 가격 ID
  priceUnitType: PriceUnitType; // 가격 단위 타입
  priceUnitTypeDescription: string; // 가격 단위 타입 설명
  supplyPrice: number; // 공급가
  price: number; // 판매가 (VAT 포함)
  vatPrice: number; // 부가세
}

/**
 * 티어 정보 DTO
 */
export interface TierInfoDto {
  id: number; // 티어 ID
  tierOrder: number; // 티어 순서
  minUsage: number; // 최소 사용량
  maxUsage: number; // 최대 사용량 (null이면 무제한)
  price: PriceInfoDto; // 가격 정보
}

/**
 * 플랜별 서비스 정보 DTO
 */
export interface PlanServiceInfoDto {
  planServiceId: number; // 플랜-서비스 연결 ID
  planId: number; // 플랜 ID
  planCode: string; // 플랜 코드
  planName: string; // 플랜명
  planType: PlanType; // 플랜 타입
  planTypeDescription: string; // 플랜 타입 설명
  tiers: TierInfoDto[]; // 티어 목록
}

/**
 * 상품 정보 DTO
 */
export interface ProductInfoDto {
  id: number; // 상품 ID
  code: string; // 상품 코드
  name: string; // 상품명
  description: string; // 상품 설명
}

/**
 * 서비스 API 응답 DTO
 */
export interface ServiceApiResDto {
  id: number; // 서비스 ID
  code: string; // 서비스 코드
  name: string; // 서비스명
  serviceType: ServiceType; // 서비스 타입
  serviceTypeDescription: string; // 서비스 타입 설명
  actionType: ActionType; // 액션 타입
  actionTypeDescription: string; // 액션 타입 설명
  description: string; // 서비스 설명
  sortOrder: number; // 정렬 순서
  isActive: string; // 활성 여부
  product: ProductInfoDto; // 상품 정보
  plans: PlanServiceInfoDto[]; // 플랜별 정보 목록
  children: ServiceApiResDto[]; // 하위 서비스 목록
}

/**
 * 서비스 API 결과 응답 DTO
 */
export interface ServiceApiResultResDto {
  requestedPath: string; // 요청한 서비스 코드 경로
  services: ServiceApiResDto[]; // 서비스 목록
}

/**
 * 포인트 사용 응답 DTO
 */
export interface RedeemPointResDto {
  transactionId: string; // 포인트 사용 거래 ID
  remainingPoint: number; // 사용 후 남은 포인트
}

/**
 * 포인트 취소 응답 DTO
 */
export interface CancelPointResDto {
  remainingPoint: number; // 복구 후 남은 포인트
}

/**
 * 구독 정보 DTO
 */
export interface SubscriptionInfoDto {
  subscriptionId: number; // 구독 ID
  planId: number; // 플랜 ID
  planCode: string; // 플랜 코드
  planName: string; // 플랜명
  planType: PlanType; // 플랜 타입
  planTypeDescription: string; // 플랜 타입 설명
  status: string; // 구독 상태
  startDate: string; // 구독 시작일
  endDate: string; // 구독 종료일
  nextBillingDate: string; // 다음 결제일
}

/**
 * 서비스별 사용량 정보 DTO
 */
export interface ServiceUsageInfoDto {
  serviceId: number; // 서비스 ID
  serviceCode: string; // 서비스 코드
  serviceName: string; // 서비스명
  serviceType: ServiceType; // 서비스 타입
  serviceTypeDescription: string; // 서비스 타입 설명
  actionType: ActionType; // 액션 타입
  actionTypeDescription: string; // 액션 타입 설명
  description: string; // 서비스 설명
  sortOrder: number; // 정렬 순서
  freeQuota: number; // 무료 할당량
  currentUsage: number; // 현재 사용량
  remainingFreeUsage: number; // 남은 무료 사용량
  overageUsage: number; // 초과 사용량
  isUnlimited: boolean; // 무제한 여부
  isInPlan: boolean; // 플랜에 포함된 서비스 여부
  children: ServiceUsageInfoDto[]; // 하위 서비스 사용량 목록
}

/**
 * 유저 서비스 사용량 응답 DTO
 */
export interface UserServiceUsageResDto {
  svcSeq: number; // 서비스 시퀀스
  requestedPath: string; // 요청한 서비스 코드 경로
  subscription: SubscriptionInfoDto; // 구독 정보
  services: ServiceUsageInfoDto[]; // 서비스별 사용량 목록
  periodStartDate: string; // 조회 기준일 (해당 월 시작일)
  periodEndDate: string; // 조회 기준 종료일 (해당 월 종료일)
}

/**
 * 관리자 포인트 지급 응답 DTO
 */
export interface GrantPointResDto {
  remainingPoint: number; // 지급 후 남은 포인트
}

/**
 * 관리자 포인트 차감 응답 DTO
 */
export interface DeductPointByAdminResDto {
  remainingPoint: number; // 차감 후 남은 포인트
}

// ==================== Redirect URL DTOs ====================

/**
 * 리다이렉트 URL 정보 DTO
 */
export interface RedirectUrlDto {
  id: number; // 리다이렉트 URL ID
  code: string; // 리다이렉트 코드 (예: "POINT_CHARGE")
  url: string; // 리다이렉트 URL
  description: string; // 설명
  displayType?: DisplayType; // 표시 타입 (예: "MODAL")
  openType?: OpenType; // 열기 타입 (예: "IFRAME")
  width?: number; // 너비 (px)
  height?: number; // 높이 (px)
  requestParams?: string; // 요청 파라미터 (예: "token,name")
  responseParams?: string; // 응답 파라미터 (예: "type,action,redirectUrl")
}

/**
 * 리다이렉트 URL 목록 응답 DTO
 */
export interface RedirectUrlListResDto {
  list: RedirectUrlDto[]; // 리다이렉트 URL 목록
}

/**
 * iframe 모달에 전달할 서비스 정보
 */
export interface ServiceUsageParam {
  serviceCode: string; // 서비스 코드 (예: 'ITAX_WORK_MANAGE_ALIMTALK')
  count: number; // 사용 횟수 (SMS 발송 건수)
}

/**
 * iframe 모달 상태 인터페이스
 */
export interface IframeModalState {
  isOpen: boolean; // 모달 열림 여부
  currentUrl: RedirectUrlDto | null; // 현재 표시 중인 리다이렉트 URL 정보
  services?: ServiceUsageParam[]; // 서비스 사용 정보 (포인트 사용 모달용)
  onResult?: (result: IframeModalResult) => void; // 결과 콜백
}

// ==================== Iframe Modal Types ====================

/**
 * iframe 모달 트랜잭션 아이템 인터페이스
 */
export interface IframeModalTransaction {
  serviceCode: string; // 서비스 코드 (예: 'ITAX_WORK_MANAGE_ALIMTALK')
  transactionId: string; // 트랜잭션 ID (예: 'PT20260116163707ESU7')
}

/**
 * iframe 모달 결과 인터페이스
 */
export interface IframeModalResult {
  type: 'MODAL_RESULT';
  code: string; // e.g., 'SUBSCRIPTION_REQUIRED', 'POINT_USAGE', 'SERVICE_RESTRICTED'
  action: string; // e.g., 'confirm', 'cancel', 'viewSubscription'
  redirectUrl: string; // 이동할 URL (선택적 값이지만 빈 문자열로 처리)
  remainingPoint: number; // 남은 포인트
  transactions: IframeModalTransaction[]; // 트랜잭션 목록
}

/**
 * iframe 모달 Props 인터페이스
 */
export interface PaymentIframeModalProps {
  modelValue: boolean; // v-model for modal open/close
  url: string; // iframe URL to load
  width: number; // iframe width in px (default: 400)
  height: number; // iframe height in px (-1 for auto)
  token: string; // auth token to send to iframe
  zIndex: number; // z-index for overlay (default: 50)
}

/**
 * iframe 모달 Emits 인터페이스
 */
export interface PaymentIframeModalEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'result', result: IframeModalResult): void;
}

/**
 * postMessage로 전송되는 토큰 데이터 인터페이스
 */
export interface IframeTokenMessage {
  token: string;
}
