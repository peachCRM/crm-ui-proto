import { defineStore } from 'pinia';
import type {
  NgoBanner,
  NgoBannerPagingDto
} from '../type/ngo-banner.type';
import { mockNgoBannerList, generateMockNgoBannerData } from '../mock/ngo-banner.mock';

/**
 * NGO 배너 크롤링 데이터 조회 스토어
 * 조회 전용 (등록/수정/삭제 없음)
 */
export const useNgoBannerStore = defineStore('ngo-banner', {
  state: () => ({
    listData: [] as NgoBanner[],
    listTotalRow: 0,
    detailData: {} as NgoBanner
  }),

  actions: {
    /**
     * 상세 데이터 초기화
     */
    detailDataInit(): void {
      this.detailData = {} as NgoBanner;
    },

    /**
     * 페이징 목록 조회
     * @param params 페이징 조건
     */
    async paging(params: NgoBannerPagingDto): Promise<void> {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // TODO: Backend API 완성 후 아래 코드로 교체
      // const result = await useApi().get<{ totalRow: number; data: NgoBanner[] }>(
      //   '/ngo-banner',
      //   { params }
      // );
      // this.listData = result.data.map((item, nIndex) => ({ ...item, nIndex, chk: false }));
      // this.listTotalRow = Number(result.totalRow);
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      // Mock 데이터 (임시)
      const allData = [...mockNgoBannerList, ...generateMockNgoBannerData(20)];

      // 플랫폼 필터
      let filtered = allData;
      if (params.platform) {
        filtered = filtered.filter((item) => item.platform === params.platform);
      }

      // 키워드 검색
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.ngoName.toLowerCase().includes(kw) ||
            item.bannerTitle.toLowerCase().includes(kw) ||
            item.bannerLinkUrl.toLowerCase().includes(kw)
        );
      }

      // 날짜 필터
      if (params.startDate) {
        filtered = filtered.filter((item) => item.crawledDate >= params.startDate);
      }
      if (params.endDate) {
        const endDateNext = params.endDate + 'T23:59:59.999Z';
        filtered = filtered.filter((item) => item.crawledDate <= endDateNext);
      }

      // 정렬
      const sortBy = params.sortBy || 'crawledDate';
      const sortType = params.sortType || 'desc';
      filtered.sort((a: any, b: any) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal < bVal) return sortType === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortType === 'asc' ? 1 : -1;
        return 0;
      });

      this.listTotalRow = filtered.length;

      // 페이징
      const page = Number(params.page) || 1;
      const row = Number(params.row) || 10;
      const start = (page - 1) * row;
      const paged = filtered.slice(start, start + row);

      this.listData = paged.map((item, nIndex: number) => ({
        ...item,
        nIndex: this.listTotalRow - start - nIndex,
        chk: false
      }));
    },

    /**
     * 상세 조회
     * @param bannerSeq 배너번호
     */
    async detail(bannerSeq: number): Promise<void> {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // TODO: Backend API 완성 후 아래 코드로 교체
      // this.detailData = await useApi().get<NgoBanner>(`/ngo-banner/${bannerSeq}`);
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      // Mock 데이터 (임시)
      const allData = [...mockNgoBannerList, ...generateMockNgoBannerData(20)];
      this.detailData = allData.find((d) => d.bannerSeq === bannerSeq) || ({} as NgoBanner);
    }
  }
});
