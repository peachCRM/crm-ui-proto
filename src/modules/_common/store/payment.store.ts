import { usePaymentApi } from '@/modules/_common/services/api.service.ts';
import { defineStore } from 'pinia';
import type {
  CancelPointResDto,
  CommonResDto,
  DeductPointByAdminReqDto,
  DeductPointByAdminResDto,
  GrantPointByAdminReqDto,
  GrantPointResDto,
  IframeModalResult,
  IframeModalState,
  OpenType,
  RedeemPointReqDto,
  RedeemPointResDto,
  RedirectUrlDto,
  RedirectUrlListResDto, // API 응답 타입으로 사용
  ServiceApiReqDto,
  ServiceApiResultResDto,
  ServiceUsageParam,
  ServiceUsageReqDto,
  UserPointResDto,
  UserServiceUsageResDto
} from '@/modules/_common/type/payment.type';

/**
 * 결제/포인트 관리 스토어
 * 유저 포인트, 서비스 사용량, 관리자 포인트 지급/차감 기능을 포함
 */
export const usePaymentStore = defineStore('payment', {
  state: () => ({
    FREE_PLAN_CODE: 'PLAN_FREE' as const,
    userPoint: {} as UserPointResDto,
    redirectUrls: [] as RedirectUrlDto[],
    iframeModal: {
      isOpen: false,
      currentUrl: null
    } as IframeModalState
  }),

  getters: {
    /**
     * 무료 플랜 여부 확인
     */
    isFreePlan: (state) => state.userPoint.planCode === 'PLAN_FREE'
  },

  actions: {
    /**
     * 유저 포인트 조회
     *
     * 사용자의 포인트 잔액과 플랜 정보를 조회합니다.
     *
     * @returns 포인트 잔액 및 플랜 정보
     */
    async getUserPoint(): Promise<CommonResDto<UserPointResDto>> {
      const api = usePaymentApi();
      const result = await api.get<CommonResDto<UserPointResDto>>('/external/point/user');
      this.userPoint = result.data;
      return result;
    },

    /**
     * 서비스 목록 조회
     *
     * 이용 가능한 서비스와 가격 정보를 계층 구조로 조회합니다.
     *
     * @param params - 서비스 조회 요청 DTO (serviceCodePath)
     * @returns 서비스 목록 및 가격 정보
     */
    getChildServices(params: ServiceApiReqDto): Promise<CommonResDto<ServiceApiResultResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<ServiceApiResultResDto>>('/external/service/children', params);
    },

    /**
     * 포인트 사용 (차감)
     *
     * 서비스 이용 시 포인트를 차감합니다.
     * 반환된 transactionId를 저장하여 취소 시 사용합니다.
     *
     * @param params - 포인트 사용 요청 DTO (serviceCode, count)
     * @returns 거래 ID 및 남은 포인트
     */
    redeemPoint(params: RedeemPointReqDto): Promise<CommonResDto<RedeemPointResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<RedeemPointResDto>>('/external/point/redeem', params);
    },

    /**
     * 포인트 사용 취소 (복구)
     *
     * 서비스 취소 시 사용한 포인트를 복구합니다.
     *
     * @param transactionId - 포인트 사용 시 반환받은 거래 ID
     * @returns 복구 후 남은 포인트
     */
    cancelPoint(transactionId: string): Promise<CommonResDto<CancelPointResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<CancelPointResDto>>(
        `/external/point/cancel/${transactionId}`,
        {}
      );
    },

    /**
     * 서비스 사용량 조회
     *
     * 월간 서비스별 사용량을 조회합니다.
     *
     * @param params - 서비스 사용량 조회 요청 DTO (serviceCodePath)
     * @returns 서비스별 사용량 정보
     */
    getUserServiceUsage(params: ServiceUsageReqDto): Promise<CommonResDto<UserServiceUsageResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<UserServiceUsageResDto>>('/external/service/usage', params);
    },

    /**
     * 관리자 포인트 지급
     *
     * 관리자가 특정 사용자에게 포인트를 지급합니다.
     *
     * @param params - 포인트 지급 요청 DTO (svcSeq, reason, point)
     * @returns 지급 후 남은 포인트
     */
    grantPointByAdmin(params: GrantPointByAdminReqDto): Promise<CommonResDto<GrantPointResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<GrantPointResDto>>('/external/point/grant/admin', params);
    },

    /**
     * 관리자 포인트 차감
     *
     * 관리자가 특정 사용자의 포인트를 차감합니다.
     *
     * @param params - 포인트 차감 요청 DTO (svcSeq, reason, point)
     * @returns 차감 후 남은 포인트
     */
    deductPointByAdmin(
      params: DeductPointByAdminReqDto
    ): Promise<CommonResDto<DeductPointByAdminResDto>> {
      const api = usePaymentApi();
      return api.post<CommonResDto<DeductPointByAdminResDto>>(
        '/external/point/deduct/admin',
        params
      );
    },

    /**
     * 리다이렉트 URL 목록 조회
     *
     * 등록된 모든 리다이렉트 URL 목록을 조회합니다.
     *
     * @returns 리다이렉트 URL 목록
     */
    async getAllRedirectUrls(): Promise<CommonResDto<RedirectUrlListResDto>> {
      const api = usePaymentApi();
      const result = await api.get<CommonResDto<RedirectUrlListResDto>>('/external/redirect-url');
      this.redirectUrls = result.data.list;
      return result;
    },

    /**
     * 리다이렉트 URL 조회
     *
     * 코드로 리다이렉트 URL을 조회합니다.
     *
     * @param code - 리다이렉트 URL 코드 (예: "POINT_CHARGE")
     * @returns 리다이렉트 URL 정보
     */
    getRedirectUrlByCode(code: string): Promise<CommonResDto<RedirectUrlDto>> {
      const api = usePaymentApi();
      return api.get<CommonResDto<RedirectUrlDto>>(`/external/redirect-url/${code}`);
    },

    /**
     * 캐시된 목록에서 리다이렉트 URL 조회
     *
     * redirectUrls 배열에서 코드와 openType으로 URL을 찾습니다.
     *
     * @param code - 리다이렉트 URL 코드 (예: "SUBSCRIPTION_REQUIRED")
     * @param openType - 열기 타입 (예: "IFRAME", "REDIRECT")
     * @returns 리다이렉트 URL 정보 또는 undefined
     */
    async getRedirectUrlFromList(code: string, openType?: OpenType): Promise<RedirectUrlDto | undefined> {
      if (!this.redirectUrls.length) {
        await this.getAllRedirectUrls();
      }
      return this.redirectUrls.find((item) => {
        if (item.code !== code) return false;
        if (openType && item.openType !== openType) return false;
        return true;
      });
    },

    /**
     * 리다이렉트 처리
     *
     * openType에 따라 리다이렉트 또는 iframe 모달을 실행합니다.
     *
     * @param item - 리다이렉트 URL 정보
     */
    processRedirect(item: RedirectUrlDto): void {
      if (!item.url) return;

      if (item.openType === 'IFRAME') {
        this.openIframeModal(item);
      } else {
        // REDIRECT 또는 openType이 없는 경우 기본 리다이렉트
        window.location.href = item.url;
      }
    },

    /**
     * iframe 모달 열기
     *
     * @param item - 리다이렉트 URL 정보
     */
    openIframeModal(item: RedirectUrlDto): void {
      this.iframeModal.currentUrl = item;
      this.iframeModal.isOpen = true;
    },

    /**
     * iframe 모달 닫기
     */
    closeIframeModal(): void {
      this.iframeModal.isOpen = false;
      this.iframeModal.currentUrl = null;
      this.iframeModal.services = undefined;
      this.iframeModal.onResult = undefined;
    },

    /**
     * iframe 결과 처리
     *
     * iframe에서 postMessage로 전달받은 결과를 처리합니다.
     *
     * @param result - iframe 모달 결과
     */
    handleIframeResult(result: IframeModalResult): void {
      // onResult 콜백이 있으면 먼저 호출
      if (this.iframeModal.onResult) {
        this.iframeModal.onResult(result);
        this.iframeModal.onResult = undefined; // 콜백 초기화
      }

      this.closeIframeModal();

      // redirectUrl이 있으면 해당 URL로 이동
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    },

    /**
     * 포인트 사용 확인 모달 열기
     *
     * SMS 발송 전 사용자에게 포인트 사용을 확인받는 모달을 표시합니다.
     *
     * @param smsCount - 전송할 SMS 개수
     * @returns Promise that resolves with { confirmed, transactionId }
     */
    async openPointUsageModal(smsCount: number): Promise<{ confirmed: boolean; transactionId: string }> {
      if (!this.redirectUrls.length) {
        await this.getAllRedirectUrls();
      }
      // 1. POINT_USAGE redirectUrl 찾기
      const pointUsageUrl = await this.getRedirectUrlFromList('POINT_USAGE', 'IFRAME');

      if (!pointUsageUrl) {
        console.error('[PaymentStore] POINT_USAGE redirectUrl not found');
        return { confirmed: false, transactionId: '' };
      }

      // 2. 서비스 파라미터 준비
      const services: ServiceUsageParam[] = [
        {
          serviceCode: 'ITAX_WORK_MANAGE_ALIMTALK',
          count: smsCount
        }
      ];

      // 3. 서비스 데이터 저장 (iframe에서 접근 가능하도록)
      this.iframeModal.services = services;

      // 4. iframe 모달 열기
      this.openIframeModal(pointUsageUrl);

      // 5. 사용자 응답 대기
      return new Promise((resolve) => {
        this.iframeModal.onResult = (result: IframeModalResult) => {
          if (result.code === 'POINT_USAGE' && result.action === 'confirm') {
            // transactions 배열에서 transactionId 추출
            const transactionId = result.transactions?.[0]?.transactionId || '';
            resolve({ confirmed: true, transactionId });
          } else {
            resolve({ confirmed: false, transactionId: '' });
          }
        };
      });
    }
  }
});
