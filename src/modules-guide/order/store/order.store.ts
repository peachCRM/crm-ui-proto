import { useApi } from '@/modules/_common/services/api.service.ts';
import { defineStore } from 'pinia';
import type {
  OrderDetail,
  OrderInsertDto,
  OrderPagingDto,
  OrderUpdateDto
} from '../type/order.type';

/**
 * 주문 관리 스토어
 * CRUD 기능 포함
 */
export const useOrderStore = defineStore('order', {
  state: () => ({
    listData: [] as OrderDetail[],
    listTotalRow: 0,
    detailData: {} as OrderDetail
  }),

  getters: {},

  actions: {
    /**
     * 상세 데이터 초기화
     */
    detailDataInit(): void {
      this.detailData = {
        orderSeq: 0,
        orderNo: '',
        orderDate: '',
        orderStatus: 'pending',
        ordererName: '',
        ordererPhone: '',
        ordererEmail: '',
        productSeq: 0,
        productName: '',
        productCode: '',
        productImageUrl: '',
        quantity: 1,
        unitPrice: 0,
        receiverName: '',
        receiverPhone: '',
        receiverZipcode: '',
        receiverAddress: '',
        receiverAddressDetail: '',
        deliveryMemo: '',
        paymentMethod: 'card',
        totalAmount: 0,
        shippingFee: 0,
        discountAmount: 0,
        isUse: 'Y',
        isDelete: 'N',
        insertSeq: 0,
        insertDate: '',
        updateSeq: 0,
        updateDate: '',
        fileList: [],
        imageList: []
      };
    },

    /**
     * 페이징 목록 조회
     */
    async paging(params: OrderPagingDto): Promise<void> {
      const result = await useApi().get<{ totalRow: number; data: OrderDetail[] }>('/order', {
        params
      });

      this.listData = result.data.map((item, nIndex: number) => {
        return { ...item, nIndex, chk: false };
      });

      this.listTotalRow = Number(result.totalRow);
    },

    /**
     * 상세 조회
     */
    async detail(orderSeq: number): Promise<void> {
      this.detailData = await useApi().get<OrderDetail>(`/order/${orderSeq}`);
    },

    /**
     * 신규 등록
     */
    insert(params: OrderInsertDto): Promise<{ isSuccess: boolean; orderSeq: number }> {
      return useApi().post<{ isSuccess: boolean; orderSeq: number }>('/order', params);
    },

    /**
     * 데이터 수정
     */
    update(orderSeq: number, params: OrderUpdateDto): Promise<{ isSuccess: boolean }> {
      return useApi().put<{ isSuccess: boolean }>(`/order/${orderSeq}`, params);
    },

    /**
     * 주문상태 변경
     */
    updateStatus(orderSeq: number | number[], orderStatus: string): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/order/status`, { orderSeq, orderStatus });
    },

    /**
     * 논리 삭제
     */
    softDelete(orderSeq: number | number[]): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/order/delete`, { orderSeq });
    }
  }
});
