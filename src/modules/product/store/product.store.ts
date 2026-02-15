import { useApi } from '@/modules/_common/services/api.service.ts';
import { defineStore } from 'pinia';
import type {
  ProductDetail,
  ProductInsertDto,
  ProductPagingDto,
  ProductUpdateDto
} from '../type/product.type';

/**
 * 상품 관리 스토어
 * CRUD 기능 포함
 */
export const useProductStore = defineStore('product', {
  state: () => ({
    listData: [] as ProductDetail[],
    listTotalRow: 0,
    detailData: {} as ProductDetail
  }),

  getters: {},

  actions: {
    /**
     * 상세 데이터 초기화
     */
    detailDataInit(): void {
      this.detailData = {
        productSeq: 0,
        productName: '',
        productCode: '',
        category: '',
        price: 0,
        costPrice: 0,
        stockQty: 0,
        description: '',
        imageUrl: '',
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
    async paging(params: ProductPagingDto): Promise<void> {
      const result = await useApi().get<{ totalRow: number; data: ProductDetail[] }>('/product', {
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
    async detail(productSeq: number): Promise<void> {
      this.detailData = await useApi().get<ProductDetail>(`/product/${productSeq}`);
    },

    /**
     * 신규 등록
     */
    insert(params: ProductInsertDto): Promise<{ isSuccess: boolean; productSeq: number }> {
      return useApi().post<{ isSuccess: boolean; productSeq: number }>('/product', params);
    },

    /**
     * 데이터 수정
     */
    update(productSeq: number, params: ProductUpdateDto): Promise<{ isSuccess: boolean }> {
      return useApi().put<{ isSuccess: boolean }>(`/product/${productSeq}`, params);
    },

    /**
     * 사용여부 변경
     */
    updateUse(productSeq: number | number[], isUse: string): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/product/use`, { productSeq, isUse });
    },

    /**
     * 논리 삭제
     */
    softDelete(productSeq: number | number[]): Promise<{ isSuccess: boolean }> {
      return useApi().patch<{ isSuccess: boolean }>(`/product/delete`, { productSeq });
    }
  }
});
