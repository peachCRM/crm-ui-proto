import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import type {
  KpiCard,
  MonthlyStats,
  AiReport,
  AiReportPagingDto
} from '../type/analytics.type';

/**
 * 통계/분석 모듈 스토어
 * Mock 데이터 기반 (Backend API 없음)
 */
export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    // KPI 카드 (6건)
    kpiCards: [] as KpiCard[],
    // 월별 통계 (12개월)
    monthlyStats: [] as MonthlyStats[],
    // 고객 등급별 분포
    customerByGrade: [
      { grade: 'VIP', count: 45 },
      { grade: '우수', count: 120 },
      { grade: '일반', count: 280 },
      { grade: '관심', count: 55 }
    ] as { grade: string; count: number }[],
    // 상담 유형별 분포
    consultationByType: [
      { type: '전화', count: 234 },
      { type: '방문', count: 156 },
      { type: '온라인', count: 89 }
    ] as { type: string; count: number }[],
    // AI 리포트 목록
    aiReportListData: [] as AiReport[],
    aiReportTotalRow: 0,
    aiReportDetailData: {} as AiReport
  }),

  getters: {},

  actions: {
    /**
     * KPI 카드 데이터 로드
     */
    loadKpi(): void {
      this.kpiCards = [
        {
          kpiSeq: 1,
          title: '신규 고객 수',
          value: '128',
          unit: '명',
          changeRate: 12.5,
          changeType: 'up',
          icon: 'i-lucide-users',
          color: 'primary'
        },
        {
          kpiSeq: 2,
          title: '상담 전환율',
          value: '87',
          unit: '%',
          changeRate: 5.2,
          changeType: 'up',
          icon: 'i-lucide-trending-up',
          color: 'success'
        },
        {
          kpiSeq: 3,
          title: '월 매출',
          value: '2,450',
          unit: '만원',
          changeRate: 8.3,
          changeType: 'up',
          icon: 'i-lucide-wallet',
          color: 'primary'
        },
        {
          kpiSeq: 4,
          title: '활성 멤버십',
          value: '342',
          unit: '개',
          changeRate: 2.1,
          changeType: 'down',
          icon: 'i-lucide-credit-card',
          color: 'warning'
        },
        {
          kpiSeq: 5,
          title: '평균 상담시간',
          value: '15',
          unit: '분',
          changeRate: 10.5,
          changeType: 'down',
          icon: 'i-lucide-clock',
          color: 'error'
        },
        {
          kpiSeq: 6,
          title: '고객 만족도',
          value: '4.5',
          unit: '/5',
          changeRate: 0.3,
          changeType: 'up',
          icon: 'i-lucide-star',
          color: 'success'
        }
      ];
    },

    /**
     * 월별 통계 로드 (12개월 Mock)
     */
    loadMonthlyStats(): void {
      const months: MonthlyStats[] = [];
      for (let i = 11; i >= 0; i--) {
        const date = dayjs().subtract(i, 'month');
        months.push({
          month: date.format('YYYY-MM'),
          newCustomers: Math.floor(80 + Math.random() * 80),
          consultations: Math.floor(150 + Math.random() * 150),
          revenue: Math.floor(1500 + Math.random() * 1500) * 10000,
          conversionRate: Number((75 + Math.random() * 20).toFixed(1))
        });
      }
      this.monthlyStats = months;
    },

    /**
     * AI 리포트 페이징 목록 조회 (Mock)
     */
    aiReportPaging(params: AiReportPagingDto): void {
      const mockList: AiReport[] = [
        {
          reportSeq: 1,
          title: '2025년 1월 월간 영업 분석 리포트',
          reportType: '월간분석',
          summary:
            '1월 신규 고객 128명 유입, 전월 대비 12.5% 증가. 상담 전환율 87%로 목표 달성.',
          insights: [
            'VIP 고객 재방문율 15% 상승',
            '주말 상담 비율이 평일 대비 2배',
            '온라인 채널 유입 23% 증가'
          ],
          recommendations: [
            '주말 상담 인력 증원 검토',
            '온라인 마케팅 예산 확대 권장'
          ],
          generatedDate: '2025-02-01 09:00:00',
          status: '완료',
          insertDate: '2025-02-01 09:00:00'
        },
        {
          reportSeq: 2,
          title: '고객 세그먼트별 행동 분석',
          reportType: '고객분석',
          summary:
            'VIP 고객군의 LTV가 일반 고객 대비 3.2배 높음. 이탈 위험 고객 45명 식별.',
          insights: [
            '20대 여성 고객 비율 35%로 최다',
            '이탈 위험 신호: 최근 30일 미방문',
            '추천 상품 구매율 28%'
          ],
          recommendations: [
            '이탈 위험 고객 대상 맞춤 프로모션',
            '20대 타겟 마케팅 강화'
          ],
          generatedDate: '2025-02-05 14:30:00',
          status: '완료',
          insertDate: '2025-02-05 14:30:00'
        },
        {
          reportSeq: 3,
          title: 'Q1 매출 추이 및 예측',
          reportType: '매출분석',
          summary:
            '1분기 누적 매출 7,350만원, 전년 동기 대비 18% 성장. 2분기 목표 8,200만원 설정.',
          insights: [
            '멤버십 매출 비중 62%',
            '단일 상품 매출 전월 대비 8% 감소',
            '신규 고객 1인당 평균 매출 45만원'
          ],
          recommendations: [
            '크로스셀 전략 강화',
            '멤버십 갱신 알림 자동화'
          ],
          generatedDate: '2025-02-10 11:00:00',
          status: '완료',
          insertDate: '2025-02-10 11:00:00'
        },
        {
          reportSeq: 4,
          title: '업종 트렌드 및 시장 인사이트',
          reportType: '트렌드',
          summary:
            '필라테스 업종 전반 15% 성장세. 경쟁사 대비 가격 경쟁력 우위 유지 중.',
          insights: [
            '그룹 레슨 선호도 67%',
            '1:1 맞춤 수업 수요 23% 증가',
            '경쟁사 평균 단가 대비 8% 저렴'
          ],
          recommendations: [
            '그룹 레슨 패키지 다양화',
            '1:1 수업 프리미엄 전략'
          ],
          generatedDate: '2025-02-12 16:45:00',
          status: '완료',
          insertDate: '2025-02-12 16:45:00'
        },
        {
          reportSeq: 5,
          title: '2월 중간 점검 리포트',
          reportType: '월간분석',
          summary:
            '2월 상반기 목표 대비 48% 달성. 하반기 집중 마케팅 필요.',
          insights: [
            '신규 고객 유입 목표 대비 92%',
            '재방문율 78% 유지',
            '프로모션 응답률 12%'
          ],
          recommendations: [
            '2월 하반기 프로모션 강화',
            '미방문 고객 리텐션 캠페인'
          ],
          generatedDate: '2025-02-15 10:00:00',
          status: '생성중',
          insertDate: '2025-02-15 10:00:00'
        },
        {
          reportSeq: 6,
          title: '고객 이탈 위험 분석 (실패)',
          reportType: '고객분석',
          summary: '',
          insights: [],
          recommendations: [],
          generatedDate: '2025-02-14 09:00:00',
          status: '실패',
          insertDate: '2025-02-14 09:00:00'
        }
      ];

      // 키워드 필터 (Mock)
      let filtered = mockList;
      if (params.keyword.trim()) {
        const kw = params.keyword.toLowerCase();
        filtered = mockList.filter(
          (r) =>
            r.title.toLowerCase().includes(kw) ||
            r.summary.toLowerCase().includes(kw)
        );
      }
      // reportType 필터 (Mock)
      if (params.reportType) {
        filtered = filtered.filter((r) => r.reportType === params.reportType);
      }

      this.aiReportTotalRow = filtered.length;

      // 페이징 (Mock)
      const start = (params.page - 1) * params.row;
      const end = start + params.row;
      this.aiReportListData = filtered.slice(start, end);
    },

    /**
     * AI 리포트 상세 조회 (Mock)
     */
    aiReportDetail(reportSeq: number): void {
      const mockList = [
        {
          reportSeq: 1,
          title: '2025년 1월 월간 영업 분석 리포트',
          reportType: '월간분석' as const,
          summary:
            '1월 신규 고객 128명 유입, 전월 대비 12.5% 증가. 상담 전환율 87%로 목표 달성. VIP 고객 재방문율이 크게 향상되었으며, 온라인 채널을 통한 유입이 두드러집니다.',
          insights: [
            'VIP 고객 재방문율 15% 상승',
            '주말 상담 비율이 평일 대비 2배',
            '온라인 채널 유입 23% 증가'
          ],
          recommendations: [
            '주말 상담 인력 증원 검토',
            '온라인 마케팅 예산 확대 권장'
          ],
          generatedDate: '2025-02-01 09:00:00',
          status: '완료' as const,
          insertDate: '2025-02-01 09:00:00'
        },
        {
          reportSeq: 2,
          title: '고객 세그먼트별 행동 분석',
          reportType: '고객분석' as const,
          summary:
            'VIP 고객군의 LTV가 일반 고객 대비 3.2배 높음. 이탈 위험 고객 45명 식별. 20대 여성 고객 비율이 35%로 가장 높으며, 추천 상품 구매율은 28%를 기록했습니다.',
          insights: [
            '20대 여성 고객 비율 35%로 최다',
            '이탈 위험 신호: 최근 30일 미방문',
            '추천 상품 구매율 28%'
          ],
          recommendations: [
            '이탈 위험 고객 대상 맞춤 프로모션',
            '20대 타겟 마케팅 강화'
          ],
          generatedDate: '2025-02-05 14:30:00',
          status: '완료' as const,
          insertDate: '2025-02-05 14:30:00'
        },
        {
          reportSeq: 3,
          title: 'Q1 매출 추이 및 예측',
          reportType: '매출분석' as const,
          summary:
            '1분기 누적 매출 7,350만원, 전년 동기 대비 18% 성장. 2분기 목표 8,200만원 설정. 멤버십 매출이 전체의 62%를 차지하며, 신규 고객 1인당 평균 매출은 45만원입니다.',
          insights: [
            '멤버십 매출 비중 62%',
            '단일 상품 매출 전월 대비 8% 감소',
            '신규 고객 1인당 평균 매출 45만원'
          ],
          recommendations: [
            '크로스셀 전략 강화',
            '멤버십 갱신 알림 자동화'
          ],
          generatedDate: '2025-02-10 11:00:00',
          status: '완료' as const,
          insertDate: '2025-02-10 11:00:00'
        },
        {
          reportSeq: 4,
          title: '업종 트렌드 및 시장 인사이트',
          reportType: '트렌드' as const,
          summary:
            '필라테스 업종 전반 15% 성장세. 경쟁사 대비 가격 경쟁력 우위 유지 중. 그룹 레슨 선호도가 67%로 가장 높으며, 1:1 맞춤 수업 수요가 23% 증가했습니다.',
          insights: [
            '그룹 레슨 선호도 67%',
            '1:1 맞춤 수업 수요 23% 증가',
            '경쟁사 평균 단가 대비 8% 저렴'
          ],
          recommendations: [
            '그룹 레슨 패키지 다양화',
            '1:1 수업 프리미엄 전략'
          ],
          generatedDate: '2025-02-12 16:45:00',
          status: '완료' as const,
          insertDate: '2025-02-12 16:45:00'
        },
        {
          reportSeq: 5,
          title: '2월 중간 점검 리포트',
          reportType: '월간분석' as const,
          summary:
            '2월 상반기 목표 대비 48% 달성. 하반기 집중 마케팅 필요. 신규 고객 유입은 목표의 92%를 기록했으며, 재방문율은 78%를 유지하고 있습니다.',
          insights: [
            '신규 고객 유입 목표 대비 92%',
            '재방문율 78% 유지',
            '프로모션 응답률 12%'
          ],
          recommendations: [
            '2월 하반기 프로모션 강화',
            '미방문 고객 리텐션 캠페인'
          ],
          generatedDate: '2025-02-15 10:00:00',
          status: '생성중' as const,
          insertDate: '2025-02-15 10:00:00'
        },
        {
          reportSeq: 6,
          title: '고객 이탈 위험 분석 (실패)',
          reportType: '고객분석' as const,
          summary: '데이터 처리 중 오류가 발생하여 리포트 생성에 실패했습니다.',
          insights: [],
          recommendations: [],
          generatedDate: '2025-02-14 09:00:00',
          status: '실패' as const,
          insertDate: '2025-02-14 09:00:00'
        }
      ];

      const found = mockList.find((r) => r.reportSeq === reportSeq);
      this.aiReportDetailData = found || ({} as AiReport);
    },

    /**
     * AI 리포트 상세 데이터 초기화
     */
    aiReportDetailInit(): void {
      this.aiReportDetailData = {} as AiReport;
    }
  }
});
